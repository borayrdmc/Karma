import { inArray } from "drizzle-orm";
import { db } from "../../client";
import { priceHistory, trackedProducts } from "../../schemas";

export type TrackedProduct = typeof trackedProducts.$inferSelect;
export type PriceData = typeof priceHistory.$inferSelect;

interface ProductPriceHistory{

    trackedProduct: TrackedProduct;
    productPriceHistory: PriceData[];
}

export async function getPriceHistoryOfTrackedProducts(trackedProductList:TrackedProduct[]): Promise<ProductPriceHistory[]>{

    const productIds=trackedProductList.map(trackedProduct => trackedProduct.productId);

    const rawPriceHistory = await db.select().from(priceHistory).where(inArray(priceHistory.productId, productIds));

    const priceHistoryList:ProductPriceHistory[]=[];

    for(const trackedProduct of trackedProductList){

        const productPriceHistory:PriceData[]=[];

        for(const priceHistoryData of rawPriceHistory){

            if(trackedProduct.productId===priceHistoryData.productId){

                productPriceHistory.push(priceHistoryData);
            }
        }
        priceHistoryList.push({trackedProduct,productPriceHistory: productPriceHistory});
    }
    return priceHistoryList;
}

//Find eklemek?
