import { ServiceError } from "@repo/errors";

interface RetryBackoffOptions<T>{

    productUrl:string;
    getTrendyolHtml:(productUrl:string)=>Promise<T>;
    baseTimeoutMs?:number;
    maxAttemptCount?:number;
}

export function isFatalError(error:ServiceError) : boolean{

    if(error.statusCode===429 || error.statusCode===403){
        return true;
    }
    
    const fatalErrorList : string[] = [
        "url not resolved to an adress",//Playwright error
        "connection shut down by server",//Playwright error
        "browser killed during process", //Playwright error
        "browser couldn't be launched", //Playwright error
        "source html code changed", //Extractor error
        "429 too many requests", //Playwright http error
        "403 forbidden", //Playwright http error
        "product data missing",//Playwright softblock error (Retry maybe? Not sure)
    ]

    for(const fatalError of fatalErrorList){

        if(error.message.toLowerCase().includes(fatalError)){
            return true;
        }
    }
    return false;
}

export async function retryWithBackoff<T>({productUrl,getTrendyolHtml: parameterFunction,baseTimeoutMs=1000,maxAttemptCount=3}:RetryBackoffOptions<T>) : Promise<T>{

    for(let attemptCount=1;attemptCount<=maxAttemptCount;attemptCount++){

        try{
            const trendyolRawHtml= await parameterFunction(productUrl);
            return trendyolRawHtml;
        }
        catch(error){

            if(error instanceof AggregateError){

                const playwrightError : ServiceError =error.errors[1];

                const fatalErrorOccured=isFatalError(playwrightError);

                if(fatalErrorOccured || attemptCount===maxAttemptCount){

                    throw new ServiceError(playwrightError.message,playwrightError.statusCode,{cause:error});
                }
            }
            else{
                throw new ServiceError("Unexpected error.",500,{cause:error});
            }
            
            //Jitter block
            if(!(attemptCount===maxAttemptCount)){
                const maxTimeout = baseTimeoutMs * Math.pow(2, attemptCount - 1);
                const minTimeout = attemptCount === 1 ? 0 : baseTimeoutMs * Math.pow(2, attemptCount - 2);
                const nextTimeout = minTimeout + Math.random() * (maxTimeout - minTimeout);
                await new Promise((resolve) => setTimeout(resolve, nextTimeout));
            }
        }
    }
    throw new ServiceError("All retry attempts failed.", 500);
}
