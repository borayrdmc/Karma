import { getPriceHistoryOfTrackedProducts, getProductInfoOfTrackedProducts, getTrackedProducts } from "@repo/db";
import { ServiceError } from "@repo/errors";
import { TrackedProductItemType } from "@repo/types";

export async function listTrackedProducts(userId: string): Promise<TrackedProductItemType[]>{

    const trackedProductList = await getTrackedProducts(userId);

    if(trackedProductList.length===0){
        return [];
    }

    const [productInfoList, priceHistoryList] = await Promise.all([
        getProductInfoOfTrackedProducts(trackedProductList),
        getPriceHistoryOfTrackedProducts(trackedProductList),
    ]);

    const trackedProductItemList=trackedProductList.map((trackedProduct)=>{

        const matchedProduct=productInfoList.find(productItem=>productItem.productId===trackedProduct.productId);

        const productPriceHistory = priceHistoryList.filter(priceHistoryItem => priceHistoryItem.productId === trackedProduct.productId);

        if(!matchedProduct){
            throw new ServiceError(`Verilen ID için ürün bilgisi bulunamadı: ${trackedProduct.productId}`, 404);
        }

        return {trackedProduct,product:matchedProduct,productPriceHistory};
    });

    return trackedProductItemList;
}