import { HepsiburadaResponseProductData } from "./HepsiburadaTypes";

const HEPSIBURADA_API_BASE_URL = "https://www.hepsiburada.com/api/v1/product/listings";

export async function fetchHepsiburadaProductData(productCode:string) : Promise<HepsiburadaResponseProductData>{

    const response = await fetch(`${HEPSIBURADA_API_BASE_URL}/${productCode}`);
            
    const responseData: HepsiburadaResponseProductData = await response.json();
    
    if(!responseData.data){
        throw new Error("Data is null. Invalid product code.");
    }

    return responseData;
}