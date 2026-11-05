import { ServiceError } from "@repo/errors";

export async function fetchHepsiburadaHtml(productUrl:string){

    const response=await fetch(productUrl,{
                    headers:{
                        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                    }
                })
    
    if(!response.ok){
        throw new ServiceError("Couldn't fetch Hepsiburada data",response.status);
    }

    const htmlData=await response.text();

    return htmlData;
}