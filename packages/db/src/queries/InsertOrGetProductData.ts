import { and, eq } from "drizzle-orm";
import { ServiceError } from "@repo/errors";
import { db } from "../client";
import { products } from "../schemas";
import { ProductDataType } from "@repo/types";

export async function insertOrGetProductData({productUrl,productPlatform,productCode,productName}:ProductDataType){

    const existingProducts=await db.select().from(products).where(and(eq(products.productCode,productCode),eq(products.productPlatform,productPlatform)))

    if(existingProducts.length>0){

        return existingProducts[0]
    }

    const insertedProduct=await db.insert(products)
        .values({productUrl,productPlatform,productCode,productName})
        .onConflictDoNothing()
        .returning();

    if(insertedProduct.length===0){
        throw new ServiceError("Something went wrong while adding the product. Please try again",409);
    }

    return insertedProduct[0];
}