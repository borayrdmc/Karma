import { ServiceError } from "@repo/errors";
import { HepsiburadaResponseProductData } from "@repo/types";

const HEPSIBURADA_API_BASE_URL = "https://www.hepsiburada.com/api/v1/product/listings";

export async function hepsiburadaApiCall(productCode:string) : Promise<HepsiburadaResponseProductData>{

    try{
        const response = await fetch(`${HEPSIBURADA_API_BASE_URL}/${productCode}`,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept":"application/json"
            },
            signal: AbortSignal.timeout(10_000)
        });

        if(!response.ok){

            if(response.status===403 ||response.status==429){
                throw new ServiceError("Hepsiburada bağlantıyı reddetti.",502,true);
            }
            throw new ServiceError("Hepsiburada ürün bilgisi alınamadı.",502);
        }
                
        const responseData: HepsiburadaResponseProductData = await response.json();
        
        if(!responseData.data){
            throw new ServiceError("Ürün bulunamadı.",400,true);
        }

        return responseData;
    }
    catch(error){
        if(error instanceof ServiceError){
            throw error;
        }
        if(error instanceof Error && error.name === "TimeoutError"){
            throw new ServiceError("Hepsiburada API istek zaman aşımına uğradı.",504,false);
        }
        throw error;
    }
}
