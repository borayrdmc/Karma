import { ScraperDataType } from "@repo/types";
import { ServiceError } from "@repo/errors";
import { fetchTrendyolHtmlViaPlaywright } from "./trendyol/FetchTrendyolHtml";
import { extractProductData } from "./trendyol/ExtractProductData";
import { extractTrendyolProductCode } from "./trendyol/ExtractTrendyolProductCode";

const TRENDYOL_CDN_BASE_URL = "https://cdn.dsmcdn.com";

export async function trendyolService(productUrl:string) : Promise<ScraperDataType>{

    try{
        const trendyolRawHtml= await fetchTrendyolHtmlViaPlaywright(productUrl);

        const productDataJSON=extractProductData(trendyolRawHtml);

        const winnerVariant=productDataJSON.product.merchantListing?.winnerVariant ?? null;

        const productCode= extractTrendyolProductCode(productUrl);
        const productName=productDataJSON.product.name;
        const price=winnerVariant ? winnerVariant.price.sellingPrice.value.toString() : null;

        const rawImageUrl=productDataJSON.product.images?.[0] ?? null;
        const productImageUrl = rawImageUrl
            ? (rawImageUrl.startsWith("http") ? rawImageUrl : `${TRENDYOL_CDN_BASE_URL}${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`)
            : null;

        const inStock=Boolean(productDataJSON.product.inStock && winnerVariant?.inStock);
        
        return {productData:{productUrl,productPlatform:"trendyol",productCode,productName,productImageUrl,inStock},price};
    }
    catch(productServiceError){

        if(productServiceError instanceof ServiceError){
            throw productServiceError;
        }
        else{
            console.error("Unexpected error in Trendyol service:", productServiceError);
            throw new ServiceError("Sunucu hatası.",500);
        }
    }
}
