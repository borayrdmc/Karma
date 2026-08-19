import { inArray } from "drizzle-orm";
import { products, trackedProducts } from "../../schemas";
import { db } from "../../client";

export type Product = typeof products.$inferSelect;
type TrackedProduct = typeof trackedProducts.$inferSelect;

export async function getProductInfoOfTrackedProducts(trackedProductList: TrackedProduct[]): Promise<Product[]> {

    const productIds = trackedProductList.map(trackedProduct => trackedProduct.productId);

    const productInfoList=db.select().from(products).where(inArray(products.productId, productIds));

    return productInfoList;
}