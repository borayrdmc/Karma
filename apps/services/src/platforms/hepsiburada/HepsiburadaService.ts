import { findCheapestAlternative } from "./FindCheapestListing";
import { extractHepsiburadaProductCode } from "./ExtractHepsiburadaProductCode";
import { fetchHepsiburadaProductData } from "./FetchHepsiburadaProductData";
import { ScraperDataType } from "@repo/types";

export async function hepsiburadaService(productUrl:string): Promise<ScraperDataType>{

    try{
        const productCode=extractHepsiburadaProductCode(productUrl);

        const responseData=await fetchHepsiburadaProductData(productCode);
        
        const cheapestListing=findCheapestAlternative(responseData);

        const price=cheapestListing.price.value.toString();

        return {productData:{productUrl,productPlatform:"hepsiburada",productCode},price};
    }
    catch(productServiceError){
        throw new Error("Product service failed.",{cause:productServiceError});
    }
}