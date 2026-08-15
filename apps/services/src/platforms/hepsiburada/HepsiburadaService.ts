import { findCheapestListing } from "./FindCheapestListing";
import { extractHepsiburadaProductCode } from "./ExtractHepsiburadaProductCode";
import { fetchHepsiburadaProductData } from "./FetchHepsiburadaProductData";
import { ScraperDataType } from "@repo/types";
import { ServiceError } from "@repo/errors";

export async function hepsiburadaService(productUrl:string): Promise<ScraperDataType>{

    try{
        const productCode=extractHepsiburadaProductCode(productUrl);

        const responseData=await fetchHepsiburadaProductData(productCode);
        
        const cheapestListing=findCheapestListing(responseData);

        const price=cheapestListing.price.value.toString();

        return {productData:{productUrl,productPlatform:"hepsiburada",productCode},price};
    }
    catch(productServiceError){

        if(productServiceError instanceof ServiceError){
           throw productServiceError
        }
        else{
            throw new ServiceError("Internal server error.",500);
        }
    }
}
