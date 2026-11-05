import { ServiceError } from "@repo/errors";
import { HepsiburadaResponseProductData } from "@repo/types";

const HEPSIBURADA_API_BASE_URL = "https://www.hepsiburada.com/api/v1/product/listings";

export async function hepsiburadaApiCall(productCode:string) : Promise<HepsiburadaResponseProductData>{

    const response = await fetch(`${HEPSIBURADA_API_BASE_URL}/${productCode}`,{
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept":"application/json"
        }
    });

    if(!response.ok){
        throw new ServiceError("Couldn't fetch Hepsiburada listings.",response.status);
    }
            
    const responseData: HepsiburadaResponseProductData = await response.json();
    
    if(!responseData.data){
        throw new ServiceError("Invalid product code.",400);
    }

    return responseData;
}