import { ScraperDataType, TrackedProductItemType } from "@repo/types";
import { createNewProduct, findProductInProductsTable, getPriceHistoryOfProduct, insertPriceData, trackProduct } from "@repo/db";
import { extractProductCodeAndPlatform } from "./platforms/ExtractProductCodeAndPlatform";
import { scrapeProductData } from "./ScrapeProductData";

export async function addToTrackedProducts(productUrl:string,userId:string): Promise<TrackedProductItemType>{

    const {productPlatform,productCode}=extractProductCodeAndPlatform(productUrl);
    
    const matchedProduct=await findProductInProductsTable(productPlatform,productCode);

    if(matchedProduct!==undefined){

        const trackedProduct=await trackProduct({userId,productId:matchedProduct.productId});

        const productPriceHistory=await getPriceHistoryOfProduct(matchedProduct.productId);

        const trackedProductItem:TrackedProductItemType={trackedProduct,product:matchedProduct,productPriceHistory}

        return trackedProductItem;
    }

    else{

        const scraperData:ScraperDataType=await scrapeProductData(productUrl);

        const createdProduct=await createNewProduct(scraperData.productData)
        const trackedProduct=await trackProduct({userId,productId:createdProduct.productId});
        const currentProductPrice=await insertPriceData({price:scraperData.price,productId:createdProduct.productId});

        const trackedProductItem:TrackedProductItemType={trackedProduct,product:createdProduct,productPriceHistory:[currentProductPrice]}

        return trackedProductItem;
    }
}