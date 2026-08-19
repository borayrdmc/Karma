import { ServiceError } from "@repo/errors";
import { TrackedProductDataType } from "@repo/types";
import { and, eq } from "drizzle-orm";
import { trackedProducts } from "../schemas";
import { db } from "../client";

export async function removeFromTrackedProducts({userId,productId}:TrackedProductDataType){
    
    const untrackedProduct=await db.delete(trackedProducts)
        .where(
            and(
                eq(trackedProducts.userId,userId),
                eq(trackedProducts.productId,productId)
            )
        ).returning();

    if(untrackedProduct.length===0){
        throw new ServiceError("Tracked product not found",404);
    }

    return untrackedProduct[0];
}