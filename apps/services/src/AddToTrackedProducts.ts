import { ProductOutputType, ScraperDataType } from "@repo/types";
import { createNewProduct, findProductInProductsTable, insertPriceData, trackProduct } from "@repo/db";
import { extractProductCodeAndPlatform } from "./platforms/ExtractProductCodeAndPlatform";
import { scrapeProductData } from "./ScrapeProductData";

export async function addToTrackedProducts(productUrl:string,userId:string): Promise<ProductOutputType>{

    const {productPlatform,productCode}=extractProductCodeAndPlatform(productUrl);
    
    const matchedProduct=await findProductInProductsTable(productPlatform,productCode);

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