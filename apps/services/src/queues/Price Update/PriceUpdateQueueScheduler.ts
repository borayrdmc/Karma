import { Queue, Worker } from "bullmq";
import { redisConnection } from "../connection";
import { createPriceUpdateJobs } from "./CreatePriceUpdateJobs";

export const priceUpdateSchedulerQueue = new Queue("price-update-scheduler-queue",{
    connection: redisConnection,
});

export const schedulerWorker = new Worker(
    
    "price-update-scheduler-queue", 
    
    async()=>{
        await createPriceUpdateJobs();
    }, 

    { 
        connection:redisConnection
    }
);

export async function priceUpdateQueueScheduler(){

    await priceUpdateSchedulerQueue.upsertJobScheduler(

        "price-update-scheduler",

        {pattern:"0 * * * *"},
        {
            name:"create-price-updater-job",
            data:{},
            opts:{
                removeOnComplete: { count: 24 },
                removeOnFail: { count: 48 },
            },
        }
    );
}