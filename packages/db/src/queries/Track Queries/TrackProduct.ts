import { TrackedProductInputType, TrackedProductOutputType } from "@repo/types";
import { db } from "../../client";
import { trackedProducts } from "../../schemas";
import { ServiceError } from "@repo/errors";

export async function trackProduct({userId,productId}:TrackedProductInputType): Promise<TrackedProductOutputType>{
    
    const trackedProduct=await db.insert(trackedProducts)
        .values({userId,productId})
        .onConflictDoNothing()
        .returning();

    if(trackedProduct.length===0){
        throw new ServiceError("Product already tracked",409);
    }

    if(!trackedProduct[0]){
        throw new ServiceError("Database Error",500);
    }

    return trackedProduct[0];
}