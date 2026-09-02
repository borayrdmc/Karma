import { and, eq } from "drizzle-orm";
import { db } from "../../client";
import { products, ProductType } from "../../schemas";

export async function findProductWithGivenPlatformAndCode(productPlatform:ProductType["productPlatform"],productCode:ProductType["productCode"]){

    const [foundProduct]= await db.select().from(products).where(and(eq(products.productCode,productCode),eq(products.productPlatform,productPlatform))).limit(1);

    return foundProduct;
}