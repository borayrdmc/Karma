import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const priceUpdateQueue = new Queue("price-update-queue",{
    connection: redisConnection,
});

export async function priceUpdateQueueSettings(){

    await priceUpdateQueue.upsertJobScheduler(

        "hourly-price-update-scheduler",    
        {pattern:"0 * * * *"},
        {
            name:"price-update-job",
            data:{},
            opts:{
                removeOnComplete: { count: 24 },
                removeOnFail: { count: 48 },
            },
        }
    );
}