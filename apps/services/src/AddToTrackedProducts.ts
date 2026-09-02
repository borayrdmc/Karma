import { ScraperDataType } from "@repo/types";
import { createNewProduct, findProductWithGivenPlatformAndCode, insertPriceData, trackProduct } from "@repo/db";
import { extractProductCodeAndPlatformFromGivenUrl } from "./platforms/ExtractProductCodeAndPlatformFromGivenUrl";
import { scrapeProductData } from "./ScrapeProductData";

export async function addToTrackedProducts(productUrl:string,userId:string){

    const {productPlatform,productCode}=extractProductCodeAndPlatformFromGivenUrl(productUrl);
    
    const matchedProduct=await findProductWithGivenPlatformAndCode(productPlatform,productCode);

    if(matchedProduct!==undefined){

        await trackProduct({userId,productId:matchedProduct.productId});

        return matchedProduct;
    }

    else{

        const scraperData:ScraperDataType=await scrapeProductData(productUrl);

        const createdProduct=await createNewProduct(scraperData.productData)
        await trackProduct({userId,productId:createdProduct.productId});
        await insertPriceData({price:scraperData.price,productId:createdProduct.productId});

        return createdProduct;
    }
}