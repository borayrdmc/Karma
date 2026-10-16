import { PriceHistoryOutputType } from "@repo/types";
import { db } from "../../client";
import { priceHistory } from "../../schemas";
import { asc, eq } from "drizzle-orm";

export async function getPriceHistoryOfProduct(productId: string): Promise<PriceHistoryOutputType[]>{

    const priceHistoryOfProduct= await db
        .select()
        .from(priceHistory)
        .where(eq(priceHistory.productId, productId))
        .orderBy(asc(priceHistory.checkedAt));
    
    return priceHistoryOfProduct;
}