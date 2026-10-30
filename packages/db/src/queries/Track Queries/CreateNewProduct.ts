import { products } from "../../schemas";
import { db } from "../../client";
import { ServiceError } from "@repo/errors";
import { ProductInputType, ProductOutputType } from "@repo/types";

export async function createNewProduct({productUrl,productPlatform,productCode,productName,productImageUrl}:ProductInputType): Promise<ProductOutputType>{

    const [createdProduct]=await db.insert(products)
            .values({productUrl,productPlatform,productCode,productName,productImageUrl})
            .onConflictDoNothing()
            .returning();
    
    if(!createdProduct){
        throw new ServiceError("Couldn't create new product.",500);
    }
    return createdProduct;
}