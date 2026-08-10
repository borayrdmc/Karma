import { db } from "../client";
import { trackedProducts } from "../schemas";

interface TrackedProductData{

    userId:string;
    productId:string;
}

export async function trackProduct({userId,productId}:TrackedProductData){
    
    const trackedProduct=await db.insert(trackedProducts).values({userId,productId}).returning();

    return trackedProduct[0];
}