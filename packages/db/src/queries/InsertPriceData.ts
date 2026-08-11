import { PriceDataType } from "@repo/types";
import { db } from "../client";
import { priceHistory } from "../schemas";

export async function insertPriceData({price,productId}:PriceDataType){

    const priceData=await db.insert(priceHistory).values({productId,price}).returning();
    return priceData[0];
}