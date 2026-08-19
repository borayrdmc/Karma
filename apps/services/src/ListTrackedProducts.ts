import { getPriceHistoryOfTrackedProducts, getProductInfoOfTrackedProducts, getTrackedProducts } from "@repo/db";

export async function listTrackedProducts(userId: string){

    const trackedProductList = await getTrackedProducts(userId);

    const [productInfoList, priceHistoryList] = await Promise.all([
        getProductInfoOfTrackedProducts(trackedProductList),
        getPriceHistoryOfTrackedProducts(trackedProductList),
    ]);

    const productList= priceHistoryList.map(({trackedProduct, productPriceHistory})=>{

        const product = productInfoList.find(product => product.productId===trackedProduct.productId);

        return {trackedProduct, product, productPriceHistory};
    });

    return productList;
}