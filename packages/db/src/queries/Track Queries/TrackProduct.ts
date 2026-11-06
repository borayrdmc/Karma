import { TrackedProductInputType, TrackedProductOutputType } from "@repo/types";
import { db } from "../../client";
import { trackedProducts } from "../../schemas";
import { ServiceError } from "@repo/errors";

export async function trackProduct({userId,productId,customName}:TrackedProductInputType): Promise<TrackedProductOutputType>{
    
    const trackedProduct=await db.insert(trackedProducts)
        .values({userId,productId,customName})
        .onConflictDoNothing()
        .returning();

    if(trackedProduct.length===0){
        throw new ServiceError("Ürün zaten takip ediliyor.",409);
    }

    if(!trackedProduct[0]){
        throw new ServiceError("Veritabanı hatası.",500);
    }

    return trackedProduct[0];
}