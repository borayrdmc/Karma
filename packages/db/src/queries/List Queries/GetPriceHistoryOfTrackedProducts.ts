import { asc, inArray } from "drizzle-orm";
import { db } from "../../client";
import { priceHistory } from "../../schemas";
import { PriceHistoryOutputType, TrackedProductOutputType } from "@repo/types";

export async function getPriceHistoryOfTrackedProducts(trackedProductList:TrackedProductOutputType[]): Promise<PriceHistoryOutputType[]>{

    const productIds=trackedProductList.map(trackedProduct=>trackedProduct.productId);

    const priceHistoryList = await db.select().from(priceHistory).where(inArray(priceHistory.productId, productIds)).orderBy(asc(priceHistory.checkedAt));

    return priceHistoryList
}