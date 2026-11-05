import { ScraperDataType } from "@repo/types";
import { fetchTrendyolHtmlViaPlaywright } from "./trendyol/FetchTrendyolHtmlViaPlaywright";
import { extractProductData } from "./trendyol/ExtractProductData";
import { extractTrendyolProductCode } from "./trendyol/ExtractTrendyolProductCode";

export async function trendyolService(productUrl:string) : Promise<ScraperDataType>{

    try{
        
        const trendyolRawHtml= await fetchTrendyolHtmlViaPlaywright(productUrl);

        const productDataJSON=extractProductData(trendyolRawHtml);

        const winnerVariant=productDataJSON.product.merchantListing?.winnerVariant ?? null;

        const productCode= extractTrendyolProductCode(productUrl);
        const productName=productDataJSON.product.name;
        const price=winnerVariant ? winnerVariant.price.sellingPrice.value.toString() : null;

        const productImageUrl=productDataJSON.product.images?.[0] ?? null;
        const inStock=Boolean(productDataJSON.product.inStock && winnerVariant?.inStock);
        
        return {productData:{productUrl,productPlatform:"trendyol",productCode,productName,productImageUrl,inStock},price};
    }
    catch(productServiceError){
        throw productServiceError;
    }
}