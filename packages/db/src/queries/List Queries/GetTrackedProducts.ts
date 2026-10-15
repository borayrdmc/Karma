import { eq } from "drizzle-orm";
import { db } from "../../client";
import { trackedProducts } from "../../schemas";

export async function getTrackedProducts(userId:string){

    const trackedProductList =await db.select().from(trackedProducts).where(eq(trackedProducts.userId,userId));
    
    return trackedProductList;
}