import { ServiceError } from "@repo/errors";

export async function fetchHepsiburadaHtml(productUrl:string){

    const response=await fetch(productUrl,{
                    headers:{
                        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                    }
                })
    
    if(!response.ok){

        if(response.status===403 ||response.status===429){
            throw new ServiceError("Hepsiburada bağlantıyı reddetti.",502,true);
        }
        throw new ServiceError("Hepsiburada ürün bilgisi alınamadı.",502);
    }

    const htmlData=await response.text();

    return htmlData;
}