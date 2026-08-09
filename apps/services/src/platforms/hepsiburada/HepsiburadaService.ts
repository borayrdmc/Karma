import { findCheapestAlternative } from "./FindCheapestListing";
import { extractProductCode } from "./ExtractProductCode";
import {HepsiburadaProductData } from "./HepsiburadaTypes";
import { fetchHepsiburadaProductData } from "./FetchHepsiburadaProductData";

const HEPSIBURADA_API_BASE_URL = "https://www.hepsiburada.com/api/v1/product/listings";

export async function hepsiburadaService(productUrl:string): Promise<HepsiburadaProductData>{

    try{
        const productCode=extractProductCode(productUrl);

        const responseData=await fetchHepsiburadaProductData(productCode);
        
        const cheapestListing=findCheapestAlternative(responseData);
        
        const merchantName=cheapestListing.merchantName;
        const price=cheapestListing.price.value;

        return {merchantName,price}
    }
    catch(productServiceError){
        throw new Error("Product service failed.",{cause:productServiceError});
    }
}