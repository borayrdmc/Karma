import { ScraperDataType, TrackedProductItemType } from "@repo/types";
import { createNewProduct, findProductInProductsTable, getPriceHistoryOfProduct, getUserTrackedProductCount, insertPriceData, trackProduct } from "@repo/db";
import { ServiceError } from "@repo/errors";
import { scrapeProductData } from "./ScrapeProductData";
import { removeUrlParameters } from "./platforms/RemoveUrlParameters";
import { extractPlatformFromUrl } from "./platforms/ExtractPlatformFromUrl";
import { extractProductCodeFromUrl } from "./platforms/ExtractProductCodeFromUrl";

const TRACKED_PRODUCT_LIMIT=24;

export async function addToTrackedProducts(rawProductUrl:string,userId:string,customName?:string): Promise<TrackedProductItemType>{

    const trackedProductCount=await getUserTrackedProductCount(userId);

    if(trackedProductCount===TRACKED_PRODUCT_LIMIT){
        throw new ServiceError(`En fazla ${TRACKED_PRODUCT_LIMIT} ürün takip edebilirsiniz.`, 403);
    }

    const {cleanUrl}=removeUrlParameters(rawProductUrl);

    const productPlatform=extractPlatformFromUrl(cleanUrl)
    const productCode=await extractProductCodeFromUrl(cleanUrl);
    
    const matchedProduct=await findProductInProductsTable(productPlatform,productCode);

    if(matchedProduct!==undefined){

        const trackedProduct=await trackProduct({userId,productId:matchedProduct.productId,customName});

        const productPriceHistory=await getPriceHistoryOfProduct(matchedProduct.productId);

        const trackedProductItem:TrackedProductItemType={trackedProduct,product:matchedProduct,productPriceHistory}

        return trackedProductItem;
    }

    else{

        const scraperData:ScraperDataType=await scrapeProductData(cleanUrl);

        const createdProduct=await createNewProduct(scraperData.productData);
        const trackedProduct=await trackProduct({userId,productId:createdProduct.productId,customName});
        const productPriceHistory=scraperData.price!==null
            ? [await insertPriceData({price:scraperData.price,productId:createdProduct.productId})]
            : [];

        const trackedProductItem:TrackedProductItemType={trackedProduct,product:createdProduct,productPriceHistory}

        return trackedProductItem;
    }
}