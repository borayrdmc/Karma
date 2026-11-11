import { chromium } from 'patchright';
import { ServiceError } from "@repo/errors";
import { getPlaywrightProxyConfig } from "../ProxyConfig";

export async function fetchTrendyolHtmlViaPlaywright(productUrl:string) : Promise<string>{

    const PLAYWRIGHT_ERRORS : [string,string,number,boolean?][] = [

        ["timeout","İstek zaman aşımına uğradı.",504,false],
        ["target page, context or browser has been closed","Tarayıcı kapatıldı.",500,false],
        ["browsertype.launch","Tarayıcı başlatılamadı.",500,true],
        ["err_http_response_code_failure", "Sunucu bağlanmayı reddetti.",502,true],
    ]

    let browser;

    try{

        const chromeChannel=process.env.CHROME_CHANNEL || (process.platform==="win32" ? "chrome" : undefined);
        const proxyConfig=getPlaywrightProxyConfig();

        browser=await chromium.launch({
            channel:chromeChannel,
            proxy:proxyConfig,

            ignoreDefaultArgs: ['--enable-automation'], //Remove automation flag
            args: [
                '--headless=new', //Hide browser in screen but run it in background like headless
                '--window-size=1920,1080', //Like normal browser
                '--no-sandbox',//Linux?
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        
        const context = await browser.newContext({
            viewport:{width:1920,height:1080},
            userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            locale:'tr-TR',
            timezoneId:'Europe/Istanbul',
            extraHTTPHeaders:{ //Additional protection layer, dunno what this does but if it works dont touch it.
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            }
        });

        const page=await context.newPage();

        await page.route("**/*", (route) => {
            if (route.request().resourceType() !== "document") {
                return route.abort();
            }
            return route.continue();
        });

        const response = await page.goto(productUrl,{waitUntil:'domcontentloaded',timeout:15000});

        if(!response){
            throw new ServiceError("Sayfaya ulaşılamadı.",500);
        }

        if(!response.ok()){

            const responseStatusCode=response.status();

            if(responseStatusCode===403){
                throw new ServiceError("Trendyol bağlantıyı reddetti.",502,true);
            }
            else if(responseStatusCode===429){
                throw new ServiceError("Trendyol istek sınırında takıldı.",502,false);
            }
            else if(responseStatusCode===404){
                throw new ServiceError("Ürün bulunamadı.",404,true);
            }
            else{
                throw new ServiceError("Trendyol sayfasına ulaşılamadı.",502)
            }            
        }

        const trendyolRawHtml=await page.content();

        if(!trendyolRawHtml.includes('window["__envoy__SHARED_PROPS"]=')){
            throw new ServiceError("Ürün bilgisi eksik.",502,false); //Sent to a cloudflare security check or captcha check
        }

        return trendyolRawHtml;
    }

    catch(error){

        if(error instanceof ServiceError){
            throw error;
        }

        if(error instanceof Error){

            const lowerErrorMessage=error.message.toLowerCase();

            for( const [errorType,errorMessage,errorStatusCode,isFatal] of PLAYWRIGHT_ERRORS){

                if(lowerErrorMessage.includes(errorType)){
                    throw new ServiceError(errorMessage,errorStatusCode,isFatal);
                }   
            }
        }

        throw new ServiceError("Beklenmeyen hata.",500);
    }

    finally{
        await browser?.close();
    }
}
