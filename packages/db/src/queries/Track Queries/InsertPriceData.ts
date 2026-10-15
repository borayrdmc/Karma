import { PriceHistoryInputType, PriceHistoryOutputType } from "@repo/types";
import { db } from "../../client";
import { priceHistory } from "../../schemas";
import { asc, eq } from "drizzle-orm";
import { ServiceError } from "@repo/errors";

export async function insertPriceData({price,productId}:PriceHistoryInputType): Promise<PriceHistoryOutputType>{

    const productPriceHistory=await db
        .select({id:priceHistory.id})
        .from(priceHistory)
        .where(eq(priceHistory.productId,productId))
        .orderBy(asc(priceHistory.checkedAt));

    if(productPriceHistory.length>=6 && productPriceHistory[0]){
        await db.delete(priceHistory).where(eq(priceHistory.id,productPriceHistory[0].id));
    }
    
    const [newPrice]=await db.insert(priceHistory).values({ productId, price }).returning();

    if(!newPrice){
        throw new ServiceError("Couldn't save price data.", 500);
    }

    return newPrice;
}