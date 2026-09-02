import { ProductDataType } from "@repo/types";
import { products } from "../../schemas";
import { db } from "../../client";
import { ServiceError } from "@repo/errors";

export async function createNewProduct({productUrl,productPlatform,productCode,productName}:ProductDataType){

    const [createdProduct]=await db.insert(products)
            .values({productUrl,productPlatform,productCode,productName})
            .onConflictDoNothing()
            .returning();
    
    if(!createdProduct){
        throw new ServiceError("Couldn't create new product.",500);
    }
    return createdProduct;
}