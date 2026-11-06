import { insertPriceData, updateProductStockStatus } from "@repo/db";
import { Job, UnrecoverableError, Worker } from "bullmq";
import { redisConnection } from "../connection";
import { ServiceError } from "@repo/errors";
import { scrapeProductPrice } from "../../ScrapeProductPrice";

export const priceUpdateWorker = new Worker(

    "price-update-queue",

    async(job: Job<{productId:string; productUrl:string; latestPrice?:string; productCode:string; inStock:boolean}>)=>{

        const {productId,productUrl,latestPrice,productCode,inStock}=job.data;

        try{

            console.log(`Started processing product Id: ${productId}`);

            const {price:currentPrice,inStock:currentInStock}=await scrapeProductPrice(productUrl,productCode);

            if(currentInStock!==inStock){
                await updateProductStockStatus(productId,currentInStock);
                console.log(`Stock status of Product ID:${productId} has been changed to: ${currentInStock}`);
            }

            if(!currentInStock || currentPrice===null){
                console.log(`Product ID:${productId} is out of stock. Skipping price update.`);
                return;
            }

            if(latestPrice===undefined || Number(currentPrice)!==Number(latestPrice)){
                await insertPriceData({price:currentPrice,productId});
                console.log(`Price of Product ID:${productId} has been changed. Latest price: ${latestPrice} Current Price: ${currentPrice}`);
            }
            else{
                console.log(`Price of ${productId} not changed.`);
            }
        }
        catch(error){
            if(error instanceof ServiceError && error.isFatal){
                console.error(`Error occured on Product ID: ${productId}. Details: ${error.message} ${error.statusCode}`);
                throw new UnrecoverableError(error.message);
            }
            console.error(`Unknown error occured on Product ID: ${productId} Details: ${error}`);
            throw error;
        }
        
    },

    {
        connection:redisConnection,
        concurrency:1,
        limiter:{max:1,duration:2000},
        settings:{
            backoffStrategy:(attemptsMade)=>{
                const baseTimeoutMs = 1000;
                const maxTimeout = baseTimeoutMs * Math.pow(2, attemptsMade - 1);
                const minTimeout = attemptsMade === 1 ? 0 : baseTimeoutMs * Math.pow(2, attemptsMade - 2);
                return minTimeout + Math.random() * (maxTimeout - minTimeout);
            },
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 500 },
    }
);
