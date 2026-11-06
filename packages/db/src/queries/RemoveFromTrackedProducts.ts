import { ServiceError } from "@repo/errors";
import { TrackedProductInputType } from "@repo/types";
import { and, eq } from "drizzle-orm";
import { trackedProducts } from "../schemas";
import { db } from "../client";

export async function removeFromTrackedProducts({userId,productId}:TrackedProductInputType){
    
    const untrackedProduct=await db.delete(trackedProducts)
        .where(
            and(
                eq(trackedProducts.userId,userId),
                eq(trackedProducts.productId,productId)
            )
        ).returning();

    if(untrackedProduct.length===0){
        throw new ServiceError("Takip edilen ürün bulunamadı",404,true);
    }

    return untrackedProduct[0];
}