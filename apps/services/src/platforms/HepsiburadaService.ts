import { ScraperDataType } from "@repo/types";
import { ServiceError } from "@repo/errors";
import { hepsiburadaApiCall } from "./hepsiburada/HepsiburadaApiCall";
import { findCheapestListing } from "./hepsiburada/FindCheapestListing";
import { fetchHepsiburadaHtml } from "./hepsiburada/FetchHepsiburadaHtml";
import { extractHepsiburadaCode } from "./hepsiburada/ExtractHepsiburadaCode";
import { extractHepsiburadaName } from "./hepsiburada/ExtractHepsiburadaName";
import { extractHepsiburadaImage } from "./hepsiburada/ExtractHepsiburadaImage";

export async function hepsiburadaService(productUrl:string): Promise<ScraperDataType>{

    try{
        
        const htmlData=await fetchHepsiburadaHtml(productUrl);
        const productCode=await extractHepsiburadaCode(productUrl,htmlData);
        const productName=extractHepsiburadaName(htmlData);
        const productImageUrl=extractHepsiburadaImage(htmlData);

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
            throw new ServiceError("Sunucu hatası.",500);
        }
    }
}
