import { eq } from "drizzle-orm";
import { db } from "../../client";
import { products, trackedProducts } from "../../schemas";

export async function getTrackedProductDetails(){
    return db
        .selectDistinct({
            productId: products.productId,
            productUrl: products.productUrl,
            productCode: products.productCode,
        })
        .from(products)
        .innerJoin(trackedProducts,eq(products.productId,trackedProducts.productId));
}