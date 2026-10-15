import { and, eq } from "drizzle-orm";
import { db } from "../../client";
import { products } from "../../schemas";
import { ProductInputType, ProductOutputType } from "@repo/types";

export async function findProductInProductsTable(productPlatform:ProductInputType["productPlatform"],productCode:ProductInputType["productCode"]): Promise<ProductOutputType | undefined>{

    const [foundProduct]= await db.select().from(products).where(and(eq(products.productCode,productCode),eq(products.productPlatform,productPlatform))).limit(1);

    return foundProduct;
}