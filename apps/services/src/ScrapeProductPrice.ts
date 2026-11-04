import { findCheapestListing } from "./platforms/hepsiburada/FindCheapestListing";
import { hepsiburadaApiCall } from "./platforms/hepsiburada/HepsiburadaApiCall";
import { trendyolService } from "./platforms/TrendyolService";
import { extractPlatformFromUrl } from "./platforms/ExtractPlatformFromUrl";

export async function scrapeProductPrice(productUrl:string, productCode:string): Promise<{price:string | null, inStock:boolean}>{

    const platform=extractPlatformFromUrl(productUrl);

    if(platform==="hepsiburada"){

        const responseData=await hepsiburadaApiCall(productCode);
        const cheapestListing=findCheapestListing(responseData);

        if(!cheapestListing){
            return {price:null, inStock:false};
        }

        return {price:cheapestListing.price.value.toString(), inStock:true};
    }
    
    const scraperData=await trendyolService(productUrl);

    return {price:scraperData.price, inStock:scraperData.productData.inStock};
}
