import { ServiceError } from "@repo/errors";

export async function resolveHepsiburadaProductVariant(productCode:string){

    if(productCode.startsWith("HBCV")||productCode.startsWith("HBV")){
        return(productCode);
    }

    try{

        const response=await fetch(`https://www.hepsiburada.com/urun-pm-${productCode}`,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            }
        })

        if(!response.ok){
            throw new ServiceError("Couldn't fetch Hepsiburada data",500);
        }

        const htmlData=await response.text()
        const htmlMatch=htmlData.match(/<meta\s+name="page_value"\s+content="([^"]+)"/i);

        if (!htmlMatch || !htmlMatch[1]) {
            throw new ServiceError("Couldn't get variant code from page.",500);
        }
        return htmlMatch[1];
    }
    catch(error){

        if(error instanceof ServiceError){
            throw error;
        }
        throw new ServiceError("Something went wrong",500);
    }
}