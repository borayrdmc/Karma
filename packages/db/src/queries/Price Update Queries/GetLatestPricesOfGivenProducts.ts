import { desc, inArray } from "drizzle-orm";
import { db } from "../../client";
import { priceHistory, products, trackedProducts } from "../../schemas";

export async function getLatestPricesOfGivenProducts(trackedProductsIds:string[]){

    if(!trackedProductsIds || trackedProductsIds.length===0){
        return [];
    }

    const latestPricesOfGivenProducts=await db
        .selectDistinctOn([priceHistory.productId],{productId:priceHistory.productId,latestPrice:priceHistory.price})
        .from(priceHistory)
        .where(inArray(priceHistory.productId,trackedProductsIds))
        .orderBy(priceHistory.productId,desc(priceHistory.checkedAt))

    return latestPricesOfGivenProducts;
}