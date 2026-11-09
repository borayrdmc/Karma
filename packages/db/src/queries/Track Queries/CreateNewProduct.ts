import { products } from "../../schemas";
import { db } from "../../client";
import { ServiceError } from "@repo/errors";
import { ProductInputType, ProductOutputType } from "@repo/types";
import { findProductInProductsTable } from "./FindProductInProductsTable";

export async function createNewProduct({productUrl,productPlatform,productCode,productName,productImageUrl,inStock}:ProductInputType): Promise<ProductOutputType>{

    const [createdProduct]=await db.insert(products)
            .values({productUrl,productPlatform,productCode,productName,productImageUrl,inStock})
            .onConflictDoNothing()
            .returning();
    
    if(!createdProduct){

        const existingProduct=await findProductInProductsTable(productPlatform, productCode);

        if (existingProduct){
            return existingProduct;
        }
        throw new ServiceError("Ürün bilgisi oluşturulamadı.",500);
    }

    return createdProduct;
}