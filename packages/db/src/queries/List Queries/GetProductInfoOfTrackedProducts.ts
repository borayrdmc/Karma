import { inArray } from "drizzle-orm";
import { products } from "../../schemas";
import { db } from "../../client";
import { ProductOutputType, TrackedProductOutputType } from "@repo/types";

export async function getProductInfoOfTrackedProducts(trackedProductList: TrackedProductOutputType[]): Promise<ProductOutputType[]> {

    const productIds = trackedProductList.map(trackedProduct => trackedProduct.productId);

    const productInfoList=await db.select().from(products).where(inArray(products.productId, productIds));

    return productInfoList;
}