import { ScraperDataType } from "@repo/types";
import { extractProductData } from "./ExtractProductData";
import { getTrendyolHtml } from "./GetTrendyolHtml";
import { retryWithBackoff } from "./RetryWithBackoff";
import { extractTrendyolProductCode } from "./ExtractTrendyolProductCode";
import { ServiceError } from "@repo/errors";

export async function trendyolService(productUrl:string) : Promise<ScraperDataType>{

    try{
        
        const trendyolRawHtml= await retryWithBackoff({productUrl,getTrendyolHtml});

        const productDataJSON=extractProductData(trendyolRawHtml);

        if(!productDataJSON.product.merchantListing){
            throw new ServiceError("No listings were found.",404);
        }
        const winnerVariant=productDataJSON.product.merchantListing.winnerVariant;

        const productCode=extractTrendyolProductCode(productUrl);
        const productName=productDataJSON.product.name;
        const price=winnerVariant.price.sellingPrice.value.toString();

        return{
            productData:{productUrl,productPlatform:"trendyol",productCode,productName},price};
    }
    catch(productServiceError){
        throw productServiceError;
    }
}
