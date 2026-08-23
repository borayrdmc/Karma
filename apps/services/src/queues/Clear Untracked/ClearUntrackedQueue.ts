import { Queue, Worker } from "bullmq";
import { redisConnection } from "../connection";
import { clearUntrackedProducts } from "@repo/db";

export const cleanupQueue = new Queue("cleanup-queue",{
    
    connection:redisConnection,
});

const cleanupWorker = new Worker(
    
    "cleanup-queue",
    
    async()=>{
        await clearUntrackedProducts();
    },

    {
        connection: redisConnection,
        removeOnComplete: { count: 20 },
        removeOnFail: { count: 20 },
    }
);

export async function cleanupJobScheduler(){

    await cleanupQueue.upsertJobScheduler(

        "cleanup-job-scheduler",

        { pattern: "0 3 * * 0" }, //Every sunday 03:00 AM
        { 
            name: "cleanup-job",
            data: {},
            opts: {}
        }
    );
}