import { asc, inArray } from "drizzle-orm";
import { db } from "../../client";
import { priceHistory } from "../../schemas";
import { PriceHistoryOutputType, TrackedProductOutputType } from "@repo/types";

interface ProductPriceHistory{

    trackedProduct: TrackedProductOutputType;
    productPriceHistory: PriceHistoryOutputType[];
}

export async function getPriceHistoryOfTrackedProducts(trackedProductList:TrackedProductOutputType[]): Promise<ProductPriceHistory[]>{

    const productIds=trackedProductList.map(trackedProduct => trackedProduct.productId);

    const rawPriceHistory = await db.select().from(priceHistory).where(inArray(priceHistory.productId, productIds)).orderBy(asc(priceHistory.checkedAt));;

    const priceHistoryList:ProductPriceHistory[]=[];

    for(const trackedProduct of trackedProductList){

        const productPriceHistory:PriceHistoryOutputType[]=[];

        for(const priceHistoryData of rawPriceHistory){

            if(trackedProduct.productId===priceHistoryData.productId){

                productPriceHistory.push(priceHistoryData);
            }
        }
        priceHistoryList.push({trackedProduct,productPriceHistory: productPriceHistory});
    }
    return priceHistoryList;
}

//Find eklemek?
