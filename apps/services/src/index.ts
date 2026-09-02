import Fastify from "fastify";
import { ServiceError } from "@repo/errors";
import { listTrackedProducts } from "./ListTrackedProducts";
import { addToTrackedProducts } from "./AddToTrackedProducts";
import { removeFromTrackedProducts } from "@repo/db";
import "./queues/Price Update/PriceUpdateWorker";
import { priceUpdateQueueScheduler } from "./queues/Price Update/PriceUpdateQueueScheduler";
import { cleanupJobScheduler } from "./queues/Clear Untracked/ClearUntrackedQueue";
import { internalAuth } from "./plugins/InternalAuth";

const app = Fastify({ logger: true });

app.register(internalAuth);

app.setErrorHandler((error,request,reply)=>{

    if(error instanceof ServiceError){

        app.log.error(error);
        
        reply.status(error.statusCode).send({
            success:false,
            error:error.message
        });
        return;
    }

    app.log.error(error);

    reply.status(500).send({
        success: false,
        error: "Unknown error occured"
    });  
});

app.get("/health",async()=>{
    return {status:"ok"};
});

app.post<{Body:{productUrl:string}}>("/api/products", async(request,reply)=>{

    const productUrl=request.body.productUrl;
    const userId=request.headers["x-user-id"] as string;

    const productData=await addToTrackedProducts(productUrl,userId);

    return reply.status(201).send({
        success: true,
        data: productData
    });
});

app.get("/api/products", async(request,reply)=>{

    const userId=request.headers["x-user-id"] as string; //Zod already validated it 

    const productList = await listTrackedProducts(userId);

    return reply.status(200).send({
        success: true,
        data: productList,
    });
});

app.delete<{Params:{productId:string}}>("/api/products/:productId", async(request,reply)=>{

    const productId=request.params.productId;
    const userId=request.headers["x-user-id"] as string; //Zod already validated it 

    await removeFromTrackedProducts({userId,productId});

    return reply.status(200).send({
        success: true,
    });
});

app.listen({port:3001},async(err,address)=>{

    if(err){
        console.error(err);
        process.exit(1);
    }

  console.log(`Server listening at ${address}`);

    await priceUpdateQueueScheduler();
    await cleanupJobScheduler();
});
