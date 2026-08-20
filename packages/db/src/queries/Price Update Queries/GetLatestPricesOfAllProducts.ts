import { inArray, desc } from "drizzle-orm";
import { db } from "../../client";
import { priceHistory } from "../../schemas";

export async function getLatestPricesOfAllProducts(productIds: string[]){
    
    if(productIds.length===0){return []}

    const latestPrices = await db
        .selectDistinctOn([priceHistory.productId],{
            productId:priceHistory.productId,
            price:priceHistory.price,
        })
        .from(priceHistory)
        .orderBy(priceHistory.productId, desc(priceHistory.checkedAt));

    return latestPrices;
}