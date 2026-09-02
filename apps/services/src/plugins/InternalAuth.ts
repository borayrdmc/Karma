import { ServiceError } from "@repo/errors";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

async function internalAuthPlugin(fastify:FastifyInstance){

    fastify.addHook("onRequest",async (request:FastifyRequest,reply:FastifyReply)=>{

        if(request.url==="/health"){
            return;
        }

        const clientApiKey=request.headers["x-internal-api-key"];
        const internalApiKey=process.env.INTERNAL_API_KEY;

        if(!clientApiKey || clientApiKey!==internalApiKey){
            throw new ServiceError("Unauthorized.",401);
        }
    })
}

export const internalAuth=fp(internalAuthPlugin);