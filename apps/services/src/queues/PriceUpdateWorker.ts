import { getAllProducts, getLatestPricesOfAllProducts, insertPriceData } from "@repo/db";
import { Job, Worker } from "bullmq";
import { getProductData } from "../GetProductData";
import { redisConnection } from "./connection";
import { ServiceError } from "@repo/errors";

const priceUpdateWorker=new Worker(

    "price-update-queue",

    async(job:Job)=>{
        
        let successfulUpdateCount=0;
        let failedUpdateCount=0;
        let skippedUpdateCount=0

        const productsToUpdate=await getAllProducts();
        const productIds=productsToUpdate.map(product=>product.productId);
        const latestPricesList=await getLatestPricesOfAllProducts(productIds);
                
        const latestPricesMap = new Map<string, string>();
        
        for(const latestPrice of latestPricesList){
            latestPricesMap.set(latestPrice.productId, latestPrice.price);
        }

        for(const product of productsToUpdate){

            try{
                console.log(`Checking Id: ${product.productId}`);

                const productLatestPrice=latestPricesMap.get(product.productId);
                const productCurrentPrice=(await getProductData(product.productUrl)).price

                if(productLatestPrice!==productCurrentPrice){
                    await insertPriceData({price:productCurrentPrice,productId:product.productId});
                    successfulUpdateCount++;
                    console.log(`Product Id: ${product.productId} successfully updated.`);
                }
                else{
                    console.log(`No changes on:${product.productId}, skipped.`);
                    skippedUpdateCount++;
                }
            }
            catch(error){
                if(error instanceof ServiceError){
                    console.log(`Product Id: ${product.productId} failed : ${error.message} ${error.statusCode}`);
                    failedUpdateCount++;
                }
                else{
                    console.log(`Unexpected error for ${product.productId}, ${error}`);
                }
            }
            const jitterMs = Math.floor(Math.random() * 1500);
            await new Promise((resolve) => setTimeout(resolve, jitterMs));
        }
    },
    {
        connection:redisConnection,
        concurrency:1
    }          
)

priceUpdateWorker.on('completed',(job)=>{
    console.log(`Job - ${job.id} finished.`);
});
priceUpdateWorker.on('failed',(job, err)=>{
    console.error(`Job - ${job?.id} failed.`, err);
});