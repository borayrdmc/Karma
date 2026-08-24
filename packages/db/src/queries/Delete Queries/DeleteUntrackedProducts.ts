import { notInArray } from "drizzle-orm";
import { db } from "../../client";
import { products } from "../../schemas";

export async function deleteUntrackedProducts(trackedProductsIdList:string[]){

    if(trackedProductsIdList.length===0){
        return;
    }

    const deletedProducts= await db.delete(products).where(notInArray(products.productId,trackedProductsIdList)).returning()

    return deletedProducts
}