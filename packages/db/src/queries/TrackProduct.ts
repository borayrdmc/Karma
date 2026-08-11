import { TrackedProductDataType } from "@repo/types";
import { db } from "../client";
import { trackedProducts } from "../schemas";

export async function trackProduct({userId,productId}:TrackedProductDataType){
    
    const trackedProduct=await db.insert(trackedProducts).values({userId,productId}).returning();

    return trackedProduct[0];
}