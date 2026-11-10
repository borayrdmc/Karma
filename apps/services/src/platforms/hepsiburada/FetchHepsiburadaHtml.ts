import { ServiceError } from "@repo/errors";
import { getFetchDispatcher } from "../ProxyConfig";

export async function fetchHepsiburadaHtml(productUrl:string){

    try{
        const dispatcher = getFetchDispatcher();
        
        const response=await fetch(productUrl,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            },
            signal: AbortSignal.timeout(10_000),
            ...(dispatcher ? { dispatcher } : {})
        } as RequestInit);
        
        if(!response.ok){

            if(response.status===403 ||response.status===429){
                throw new ServiceError("Hepsiburada bağlantıyı reddetti.",502,true);
            }
            throw new ServiceError("Hepsiburada ürün bilgisi alınamadı.",502);
        }

        const htmlData=await response.text();

        return htmlData;
    }
    catch(error){
        if(error instanceof ServiceError){
            throw error;
        }
        if(error instanceof Error && error.name === "TimeoutError"){
            throw new ServiceError("Hepsiburada istek zaman aşımına uğradı.",504,false);
        }
        throw error;
    }
}
