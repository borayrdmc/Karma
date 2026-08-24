import { Queue, Worker } from "bullmq";
import { redisConnection } from "../connection";
import { clearUntrackedProducts } from "@repo/db";

export const cleanupQueue = new Queue("cleanup-queue",{
    
    connection:redisConnection,
});

const cleanupWorker = new Worker(
    
    "cleanup-queue",
    
    async()=>{
        console.log("Untracked product removal queue started");
        const deletedProducts=await clearUntrackedProducts();

        if(!deletedProducts || deletedProducts.length===0){
            console.log("Untracked product removal queue finished. No products were deleted.");
        }
        else{
            console.log(`Untracked product removal queue finished. Deleted products: ${JSON.stringify(deletedProducts)}`);
        }
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

        { pattern: "0 */2 * * *" }, // Every 2 hours
        { 
            name: "cleanup-job",
            data: {},
            opts: {}
        }
    );
}