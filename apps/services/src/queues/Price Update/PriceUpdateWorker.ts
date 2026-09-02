import { insertPriceData } from "@repo/db";
import { Job, UnrecoverableError, Worker } from "bullmq";
import { scrapeProductData } from "../../ScrapeProductData";
import { redisConnection } from "../connection";
import { isFatalError, ServiceError } from "@repo/errors";

export const priceUpdateWorker = new Worker(

    "price-update-queue",

    async(job: Job<{productId:string; productUrl:string; latestPrice:string}>)=>{

        const {productId,productUrl,latestPrice}=job.data;

        try{

            console.log(`Started processing product Id: ${productId}`);

            const currentPrice=(await scrapeProductData(productUrl)).price;

            if(Number(currentPrice)!==Number(latestPrice)){
                await insertPriceData({price:currentPrice,productId});
                console.log(`Price of Product ID:${productId} has been changed. Latest price: ${latestPrice} Current Price: ${currentPrice}`);
            }
            else{
                console.log(`Price of ${productId} not changed.`);
            }
        }
        catch(error){
            if(error instanceof ServiceError && isFatalError(error)){
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