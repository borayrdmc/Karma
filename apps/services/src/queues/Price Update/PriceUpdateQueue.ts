import { Queue } from "bullmq";
import { redisConnection } from "../connection";

export const priceUpdateQueue = new Queue("price-update-queue",{
    connection: redisConnection,
});