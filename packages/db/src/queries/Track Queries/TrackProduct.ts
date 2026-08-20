import { TrackedProductDataType } from "@repo/types";
import { db } from "../../client";
import { trackedProducts } from "../../schemas";
import { ServiceError } from "@repo/errors";

export async function trackProduct({userId,productId}:TrackedProductDataType){
    
    const trackedProduct=await db.insert(trackedProducts)
        .values({userId,productId})
        .onConflictDoNothing()
        .returning();

    if(trackedProduct.length===0){
        throw new ServiceError("Product already tracked",409);
    }

    return trackedProduct[0];
}