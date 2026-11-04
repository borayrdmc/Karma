import { ScraperDataType, TrackedProductItemType } from "@repo/types";
import { createNewProduct, findProductInProductsTable, getPriceHistoryOfProduct, insertPriceData, trackProduct } from "@repo/db";
import { scrapeProductData } from "./ScrapeProductData";
import { extractProductCodeAndPlatform } from "./platforms/ExtractPlatformAndCode";
import { removeUrlParameters } from "./platforms/RemoveUrlParameters";

export async function addToTrackedProducts(rawProductUrl:string,userId:string,customName?:string): Promise<TrackedProductItemType>{

    const {cleanUrl}=removeUrlParameters(rawProductUrl);

    const {productPlatform,productCode}=await extractProductCodeAndPlatform(cleanUrl);
    
    const matchedProduct=await findProductInProductsTable(productPlatform,productCode);

    if(matchedProduct!==undefined){

        const trackedProduct=await trackProduct({userId,productId:matchedProduct.productId,customName});

        const productPriceHistory=await getPriceHistoryOfProduct(matchedProduct.productId);

        const trackedProductItem:TrackedProductItemType={trackedProduct,product:matchedProduct,productPriceHistory}

        return trackedProductItem;
    }

    else{

        const scraperData:ScraperDataType=await scrapeProductData(cleanUrl);

        const createdProduct=await createNewProduct(scraperData.productData)
        const trackedProduct=await trackProduct({userId,productId:createdProduct.productId,customName});
        const currentProductPrice=await insertPriceData({price:scraperData.price,productId:createdProduct.productId});

        const trackedProductItem:TrackedProductItemType={trackedProduct,product:createdProduct,productPriceHistory:[currentProductPrice]}

        return trackedProductItem;
    }
}