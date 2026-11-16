import { ServiceError } from "@repo/errors";

const MAX_REDIRECT_HOPS=5;
const REQUEST_TIMEOUT_MS=10000;
const DESKTOP_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const TARGET_PLATFORM_HOSTS=new Set([
    "trendyol.com",
    "www.trendyol.com",
    "hepsiburada.com",
    "www.hepsiburada.com",
]);

const MOBILE_SHORT_HOSTS=new Set([
    "ty.gl",
    "app.hb.biz",
]);

function isAllowedIntermediateHost(hostname:string): boolean{
    return MOBILE_SHORT_HOSTS.has(hostname) || /^(?:[a-z0-9-]+\.)?adj\.st$/i.test(hostname);
}

function parseHttpsUrl(rawUrl:string,errorMessage:string,baseUrl?:string): URL{

    let parsedUrl:URL;

    try{
        parsedUrl=baseUrl ? new URL(rawUrl,baseUrl) : new URL(rawUrl);
    }
    catch{
        throw new ServiceError(errorMessage,400);
    }

    if(parsedUrl.protocol!=="https:" || parsedUrl.port!==""){
        throw new ServiceError("Geçersiz protokol.",400);
    }

    return parsedUrl;
}

export async function resolveLinkFormat(productUrl:string): Promise<string>{

    const initialUrl=parseHttpsUrl(productUrl.trim(),"Geçerli bir ürün linki giriniz.");
    const initialHost=initialUrl.hostname.toLowerCase();

    if(TARGET_PLATFORM_HOSTS.has(initialHost)){
        return initialUrl.toString();
    }

    if(!MOBILE_SHORT_HOSTS.has(initialHost)){
        throw new ServiceError("Lütfen geçerli bir Hepsiburada veya Trendyol ürün linki giriniz.",400);
    }

    let currentUrl=initialUrl.toString();

    for(let hop=0;hop<MAX_REDIRECT_HOPS;hop++){

        let response:Response;

        try{
            response=await fetch(currentUrl,{
                method:"GET",
                redirect:"manual",
                signal:AbortSignal.timeout(REQUEST_TIMEOUT_MS),
                headers:{
                    "User-Agent":DESKTOP_USER_AGENT,
                    "Accept":"text/html,application/xhtml+xml",
                },
            });
        }
        catch(error){
            throw new ServiceError("Kısa link çözümlenemedi. Lütfen tekrar deneyiniz.",502,false,{cause:error});
        }

        const locationHeader=response.headers.get("location");
        await response.body?.cancel().catch(()=>{});

        const isRedirect=response.status>=300 && response.status<400;

        if(!isRedirect || !locationHeader){
            if(response.status===404 || response.status===410){
                throw new ServiceError("Ürün linki bulunamadı veya süresi dolmuş.",400);
            }
            throw new ServiceError("Mobil ürün linki çözümlenemedi.",400);
        }

        const nextUrl=parseHttpsUrl(locationHeader,"Geçersiz yönlendirme hedefi.",currentUrl);
        const nextHost=nextUrl.hostname.toLowerCase();

        if(TARGET_PLATFORM_HOSTS.has(nextHost)){
            return nextUrl.toString();
        }

        if(!isAllowedIntermediateHost(nextHost)){
            throw new ServiceError("Kısa link desteklenmeyen bir adrese yönlendiriyor.",400);
        }

        currentUrl=nextUrl.toString();
    }

    throw new ServiceError("Link yönlendirme sınırı aşıldı.",400);
}