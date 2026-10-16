import { ScraperDataType } from "@repo/types";
import { ServiceError } from "@repo/errors";
import { extractHepsiburadaProductCodeAndPlatform } from "./hepsiburada/ExtractHepsiburadaProductCodeAndPlatform";
import { fetchHepsiburadaProductData } from "./hepsiburada/FetchHepsiburadaProductData";
import { findCheapestListing } from "./hepsiburada/FindCheapestListing";
import { extractHepsiburadaProductName } from "./hepsiburada/ExtractHepsiburadaProductName";

export async function hepsiburadaService(productUrl:string): Promise<ScraperDataType>{

    try{
        const {productCode}=extractHepsiburadaProductCodeAndPlatform(productUrl);

        const responseData=await fetchHepsiburadaProductData(productCode);
        
        const cheapestListing=findCheapestListing(responseData);

        const price=cheapestListing.price.value.toString();

        const productName=extractHepsiburadaProductName(productUrl);

        return {productData:{productUrl,productPlatform:"hepsiburada",productCode,productName},price};
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
