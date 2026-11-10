import "dotenv/config";
import { initSentry, Sentry } from "./sentry";

initSentry();

import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { ServiceError } from "@repo/errors";
import { listTrackedProducts } from "./ListTrackedProducts";
import { addToTrackedProducts } from "./AddToTrackedProducts";
import { removeFromTrackedProducts } from "@repo/db";
import { priceUpdateWorker } from "./queues/Price Update/PriceUpdateWorker";
import { redisConnection } from "./queues/connection";
import { priceUpdateQueueScheduler } from "./queues/Price Update/PriceUpdateQueueScheduler";
import { cleanupJobScheduler, cleanupWorker } from "./queues/Clear Untracked/ClearUntrackedQueue";
import { internalAuth } from "./plugins/InternalAuth";

function validateEnv(){
    const required=["DATABASE_URL", "INTERNAL_API_KEY"];
    const missing=required.filter((key)=>!process.env[key]);
    if(missing.length>0){
        console.error(`❌ [SERVICES] Eksik ortam değişkeni: ${missing.join(", ")}. Lütfen .env dosyasını kontrol edin.`);
        process.exit(1);
    }
}
validateEnv();

const app = Fastify({ logger: true });

app.register(internalAuth);

app.register(rateLimit,{

    max:30, 
    timeWindow:"1 minute",
    allowList:["/health"],

    keyGenerator:(request)=>{
        return (request.headers["x-user-id"] as string) || request.ip;
    },
    
    errorResponseBuilder: () => {
        return {
            success: false,
            error: "Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin."
        };
    }
});

app.setErrorHandler((error,request,reply)=>{

    if(error instanceof ServiceError){
        if(error.statusCode >= 500 || error.isFatal){
            Sentry.captureException(error, {
                extra: { url: request.url, method: request.method, userId: request.headers["x-user-id"] }
            });
        }

        app.log.error(error);
        
        reply.status(error.statusCode).send({
            success:false,
            error:error.message
        });
        return;
    }

    Sentry.captureException(error, {
        extra: { url: request.url, method: request.method, userId: request.headers["x-user-id"] }
    });

    app.log.error(error);

    reply.status(500).send({
        success: false,
        error: "Bilinmeyen bir hata oluştu."
    });  
});

app.get("/health",async()=>{
    return {status:"ok"};
});

app.post<{Body:{productUrl?:string,customName?:string}}>("/api/products", async(request,reply)=>{

    const productUrl=request.body?.productUrl;
    const customName=request.body?.customName;
    const userId=request.headers["x-user-id"] as string;

    if(!userId){
        throw new ServiceError("Yetkisiz erişim. Kullanıcı kimliği bulunamadı.", 401);
    }

    if(!productUrl){
        throw new ServiceError("Ürün linki boş olamaz.", 400);
    }

    const productData=await addToTrackedProducts(productUrl,userId,customName);

    return reply.status(201).send({
        success: true,
        data: productData
    });
});

app.get("/api/products", async(request,reply)=>{

    const userId=request.headers["x-user-id"] as string;

    if(!userId){
        throw new ServiceError("Yetkisiz erişim. Kullanıcı kimliği bulunamadı.", 401);
    }

    const productList = await listTrackedProducts(userId);

    return reply.status(200).send({
        success: true,
        data: productList,
    });
});

app.delete<{Params:{productId:string}}>("/api/products/:productId", async(request,reply)=>{

    const productId=request.params.productId;
    const userId=request.headers["x-user-id"] as string;

    if(!userId){
        throw new ServiceError("Yetkisiz erişim. Kullanıcı kimliği bulunamadı.", 401);
    }

    if(!productId){
        throw new ServiceError("Ürün ID bilgisi eksik.", 400);
    }

    await removeFromTrackedProducts({userId,productId});

    return reply.status(200).send({
        success: true,
    });
});

const port=Number(process.env.PORT) || 3001;
const host=process.env.HOST || "0.0.0.0";

try{
    const address=await app.listen({port,host});
    console.log(`Server listening at ${address}`);

    await priceUpdateQueueScheduler();
    await cleanupJobScheduler();

    priceUpdateWorker.on("failed", (job, err) => {
        Sentry.captureException(err, {
            extra: {
                queue: "price-update-queue",
                jobId: job?.id,
                productId: job?.data?.productId,
                productUrl: job?.data?.productUrl,
            },
        });
    });

    cleanupWorker.on("failed", (job, err) => {
        Sentry.captureException(err, {
            extra: {
                queue: "cleanup-queue",
                jobId: job?.id,
            },
        });
    });
}
catch(err){
    Sentry.captureException(err);
    console.error(err);
    process.exit(1);
}

async function gracefulShutdown(signal:string){
    app.log.info(`[SERVICES] ${signal} sinyali alındı. Sunucu güvenle kapatılıyor...`);
    try{
        await Sentry.close(2000);
        await app.close();
        await priceUpdateWorker.close();
        await cleanupWorker.close();
        await redisConnection.quit();
        app.log.info("[SERVICES] Tüm bağlantılar temizce kapatıldı.");
        process.exit(0);
    }
    catch(error){
        app.log.error(error, "[SERVICES] Kapanış sırasında hata oluştu.");
        process.exit(1);
    }
}

process.on("SIGTERM",()=>gracefulShutdown("SIGTERM"));
process.on("SIGINT",()=>gracefulShutdown("SIGINT"));
