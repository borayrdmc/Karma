import { eq } from "drizzle-orm";
import { db } from "../../client";
import { trackedProducts } from "../../schemas";
import { TrackedProductOutputType } from "@repo/types";

export async function getTrackedProducts(userId:string): Promise<TrackedProductOutputType[]>{

    const trackedProductList =await db.select().from(trackedProducts).where(eq(trackedProducts.userId,userId));
    
    return trackedProductList;
}