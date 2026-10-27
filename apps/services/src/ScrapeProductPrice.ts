import { findCheapestListing } from "./platforms/hepsiburada/FindCheapestListing";
import { hepsiburadaApiCall } from "./platforms/hepsiburada/HepsiburadaApiCall";
import { trendyolService } from "./platforms/TrendyolService";
import { extractPlatformFromUrl } from "./platforms/ExtractPlatformFromUrl";

export async function scrapeProductPrice(productUrl:string, productCode:string): Promise<string>{

    const platform=extractPlatformFromUrl(productUrl);

    if(platform==="hepsiburada"){

        const responseData=await hepsiburadaApiCall(productCode);
        const cheapestListing=findCheapestListing(responseData);
        return cheapestListing.price.value.toString();
    }
    
    const productData=await trendyolService(productUrl);

    return productData.price;
}