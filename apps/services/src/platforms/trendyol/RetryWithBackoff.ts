interface RetryBackoffOptions<T>{

    productUrl:string;
    getTrendyolHtml:(productUrl:string)=>Promise<T>;
    baseTimeoutMs?:number;
    maxAttemptCount?:number;
}

export function isFatalError(error:Error) : boolean{

    const fatalErrorList : string[] = [
        "url not resolved to an adress",//Playwright error
        "connection shut down by server",//Playwright error
        "browser killed during process", //Playwright error
        "browser couldn't be launched", //Playwright error
        "shared props not found. check html for changes.", //Extractor error
        "</script> tag not found. check html for changes.", //Extractor error
        "429 too many requests", //Playwright http error
        "403 forbidden", //Playwright http error
        "html fetched successfully but product data is missing. captcha, waf or invalid response."//Playwright softblock error (Retry maybe? Not sure)
    ]

    for(const fatalError of fatalErrorList){

        if(error.message.toLowerCase().includes(fatalError)){
            return true;
        }
    }
    return false;
}

export async function retryWithBackoff<T>({productUrl,getTrendyolHtml: parameterFunction,baseTimeoutMs=1000,maxAttemptCount=3}:RetryBackoffOptions<T>) : Promise<T>{

    const errorLog = []

    for(let attemptCount=1;attemptCount<=maxAttemptCount;attemptCount++){

        try{
            const trendyolRawHtml= await parameterFunction(productUrl);
            return trendyolRawHtml;
        }
        catch(error){

            errorLog.push(error);

            if(error instanceof AggregateError){

                const fatalErrorOccured=error.errors.every(e=>e instanceof Error && isFatalError(e));

                if(fatalErrorOccured || attemptCount===maxAttemptCount){

                    if(fatalErrorOccured){
                        console.warn("Fatal error occured. Aborting process...");
                        errorLog.push(new Error("Fatal error occured"));
                        break;
                    }
                    errorLog.push(new Error("All retry attempts failed. Aborting process..."));
                }
                if(!(attemptCount===maxAttemptCount)){
                    console.log(`Attempt ${attemptCount}/${maxAttemptCount} failed. Retrying...`);
                }
            }

            else{
                console.log(`Unknown type catched ${error}`);
                errorLog.push(new Error(`Unknown type catched ${error}`));
                break;
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
    throw new AggregateError(errorLog,"Retry attempts failed. Error log sent.");
}