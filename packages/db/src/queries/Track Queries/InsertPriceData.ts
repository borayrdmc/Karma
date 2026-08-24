import { PriceDataType } from "@repo/types";
import { db } from "../../client";
import { priceHistory } from "../../schemas";
import { asc, eq } from "drizzle-orm";

export async function insertPriceData({price,productId}:PriceDataType){

    const productPriceHistory=await db
        .select({id:priceHistory.id})
        .from(priceHistory)
        .where(eq(priceHistory.productId,productId))
        .orderBy(asc(priceHistory.checkedAt));

    if(productPriceHistory.length>=6 && productPriceHistory[0]){
        await db.delete(priceHistory).where(eq(priceHistory.id,productPriceHistory[0].id));
    }
    
    const priceData=await db.insert(priceHistory).values({productId,price}).returning();
    return priceData[0];
}