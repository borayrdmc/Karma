import { Queue, Worker } from "bullmq";
import { redisConnection } from "../connection";
import { deleteUntrackedProducts } from "@repo/db";

export const cleanupQueue = new Queue("cleanup-queue",{
    
    connection:redisConnection,
});

export const cleanupWorker = new Worker(
    
    "cleanup-queue",
    
    async()=>{
        console.log("Untracked product removal queue started");
        const deletedProducts=await deleteUntrackedProducts();

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

        { pattern: "0 4 * * 0", tz: "Europe/Istanbul" }, // Every Sunday at 04:00 (Turkey time)
        { 
            name: "cleanup-job",
            data: {},
            opts: {}
        }
    );
}
