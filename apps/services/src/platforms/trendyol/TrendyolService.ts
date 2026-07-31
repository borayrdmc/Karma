import { extractProductData } from "./ExtractProductData";
import { getTrendyolHtml } from "./GetTrendyolHtml";
import { TrendyolProductData } from "./TrendyolTypes";

export async function trendyolService(productUrl:string) : Promise<TrendyolProductData>{

    try{
        
        const trendyolRawHtml= await getTrendyolHtml(productUrl)

        const productDataJSON=extractProductData(trendyolRawHtml);

        if(!productDataJSON.product.merchantListing){
            throw new Error("No listings were found.");
        }
        const winnerVariant=productDataJSON.product.merchantListing.winnerVariant;

        const productTitle= productDataJSON.product.name;
        const sellingPrice =winnerVariant.price.sellingPrice.value;
        const inStock=winnerVariant.inStock;

        return {productTitle,sellingPrice,inStock};
    }
    catch(productServiceError){
        throw new Error("Product service failed.",{cause:productServiceError});
    }
}