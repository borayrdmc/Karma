import { insertPriceData } from "@repo/db";
import { Job, UnrecoverableError, Worker } from "bullmq";
import { getProductData } from "../../GetProductData";
import { redisConnection } from "../connection";
import { isFatalError, ServiceError } from "@repo/errors";

export const priceUpdateWorker = new Worker(

    "price-update-queue",

    async(job: Job<{productId:string; productUrl:string; latestPrice:string}>)=>{

        const {productId,productUrl,latestPrice}=job.data;

        try{
            const currentPrice=(await getProductData(productUrl)).price;

            if(currentPrice!==latestPrice){
                await insertPriceData({price:currentPrice,productId});
            }
        }
        catch(error){
            if(error instanceof ServiceError && isFatalError(error)){
                throw new UnrecoverableError(error.message);
            }
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