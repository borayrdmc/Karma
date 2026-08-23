import { getAllTrackedProductIds, getLatestPricesOfGivenProducts, getTrackedProductDetails } from "@repo/db";
import { priceUpdateQueue } from "./PriceUpdateQueue";

export async function createPriceUpdateJobs(){

    const productsToUpdate=await getTrackedProductDetails();

    if(productsToUpdate.length===0){
        return;
    }
    
    const productIds = productsToUpdate.map(product => product.productId);

    const latestPricesOfGivenProducts=await getLatestPricesOfGivenProducts(productIds);
    const latestPricesMap=new Map(latestPricesOfGivenProducts.map(product=>[product.productId, product.latestPrice]));

    await priceUpdateQueue.addBulk(

        productsToUpdate.map(product=>({

            name:"price-update-job",
            data:{
                productId:product.productId,
                productUrl:product.productUrl,
                latestPrice:latestPricesMap.get(product.productId)
            },
            opts: {attempts:3, backoff:{type:"custom"}},
        }))
    )

}