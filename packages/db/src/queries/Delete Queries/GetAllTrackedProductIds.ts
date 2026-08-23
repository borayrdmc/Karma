import { db } from "../../client";
import { trackedProducts } from "../../schemas";

export async function getAllTrackedProductIds(){

    const trackedProductList=await db.select().from(trackedProducts)
    const trackedProductIdList=trackedProductList.map(trackedProduct=>trackedProduct.productId);

    return trackedProductIdList;
}