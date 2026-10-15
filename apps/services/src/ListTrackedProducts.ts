import { getPriceHistoryOfTrackedProducts, getProductInfoOfTrackedProducts, getTrackedProducts } from "@repo/db";
import { ServiceError } from "@repo/errors";
import { TrackedProductItemType } from "@repo/types";

export async function listTrackedProducts(userId: string): Promise<TrackedProductItemType[]>{

    const trackedProductList = await getTrackedProducts(userId);

    const [productInfoList, priceHistoryList] = await Promise.all([
        getProductInfoOfTrackedProducts(trackedProductList),
        getPriceHistoryOfTrackedProducts(trackedProductList),
    ]);

    const productList= priceHistoryList.map(({trackedProduct, productPriceHistory})=>{

        const product = productInfoList.find(product => product.productId===trackedProduct.productId);

        if(!product){
            throw new ServiceError(`Product data not found for id: ${trackedProduct.productId}`,404);
        }

        return {trackedProduct, product, productPriceHistory};
    });

    return productList;
}