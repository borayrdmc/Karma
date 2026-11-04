import { ScraperDataType } from "@repo/types";
import { ServiceError } from "@repo/errors";
import { hepsiburadaApiCall } from "./hepsiburada/HepsiburadaApiCall";
import { findCheapestListing } from "./hepsiburada/FindCheapestListing";
import { extractHepsiburadaCodeNameImage } from "./hepsiburada/ExtractHepsiburadaCodeNameImage";

export async function hepsiburadaService(productUrl:string): Promise<ScraperDataType>{

    try{
        const {productCode,productName,productImageUrl}=await extractHepsiburadaCodeNameImage(productUrl);

        const responseData=await hepsiburadaApiCall(productCode);
        
        const cheapestListing=findCheapestListing(responseData);

        const inStock=cheapestListing!==null;
        const price=cheapestListing ? cheapestListing.price.value.toString() : null;

        return {productData:{productUrl,productPlatform:"hepsiburada",productCode,productName,productImageUrl,inStock},price};
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
