import { notExists, eq } from "drizzle-orm";
import { db } from "../../client";
import { products, trackedProducts } from "../../schemas";

export async function deleteUntrackedProducts(){

    const deletedProducts = await db
        .delete(products)
        .where(
            notExists(
                db
                    .select({ id: trackedProducts.id })
                    .from(trackedProducts)
                    .where(eq(trackedProducts.productId, products.productId))
            )
        )
        .returning();

    return deletedProducts;
}