import { eq } from "drizzle-orm";
import { db } from "../../client";
import { products } from "../../schemas";

export async function updateProductStockStatus(productId: string, inStock: boolean){
    await db
        .update(products)
        .set({ inStock })
        .where(eq(products.productId, productId));
}
