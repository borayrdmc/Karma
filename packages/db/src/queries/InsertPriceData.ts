import { db } from "../client";
import { priceHistory } from "../schemas";

interface PriceData{

    price:string;
    productId:string;
}

export async function insertPriceData({price,productId}:PriceData){

    const priceData=await db.insert(priceHistory).values({productId,price}).returning();
    return priceData[0];
}