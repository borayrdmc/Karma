import Fastify from "fastify";
import { getProductData } from "./GetProductData";
import { ServiceError } from "@repo/errors";
import { listTrackedProducts } from "./ListTrackedProducts";
import { addTrackedProduct } from "./AddToTrackedProducts";
import { removeFromTrackedProducts } from "@repo/db";

const app = Fastify({ logger: true });

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

    const errorMessage = error instanceof Error ? error.message : "Unknown error type";

    reply.status(500).send({
        success: false,
        error: errorMessage
    });  
});

app.get("/health",async()=>{
    return {status:"ok"};
});

app.post<{Body:{productUrl:string}}>("/api/products", async(request,reply)=>{

    const productUrl=request.body.productUrl;

    const scraperData = await getProductData(productUrl);
    await addTrackedProduct(scraperData);

    return reply.status(201).send({
        success: true,
        data: scraperData,
    }); 
});

app.get("/api/products", async(request,reply)=>{

    const productList = await listTrackedProducts("test_user");

    return reply.status(200).send({
        success: true,
        data: productList,
    });
});

app.delete<{Params:{productId:string}}>("/api/products/:productId", async(request,reply)=>{

    const productId=request.params.productId;

    await removeFromTrackedProducts({userId:"test_user",productId});

    return reply.status(200).send({
        success: true,
    });
});

app.listen({port:3001},(err,address)=>{

    if(err){
        console.error(err);
        process.exit(1);
    }

  console.log(`Server listening at ${address}`);
});
