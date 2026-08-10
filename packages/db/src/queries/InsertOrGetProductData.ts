import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { products } from "../schemas";

interface QueryData{

    productUrl:string;
    productPlatform:"hepsiburada" | "trendyol";
    productCode:string;
    productName?:string;
}

export async function insertOrGetProductData({productUrl,productPlatform,productCode,productName}:QueryData){

    const existingProducts=await db.select().from(products).where(and(eq(products.productCode,productCode),eq(products.productPlatform,productPlatform)))

    if(existingProducts.length>0){

        return existingProducts[0]
    }

    const insertedProduct=await db.insert(products).values({productUrl,productPlatform,productCode,productName}).returning()

    return insertedProduct[0];
    
}