import { STATUS_CODES } from 'node:http';
import { ServiceError } from "@repo/errors";

export async function fetchTrendyolHtmlViaFetch(productUrl: string): Promise<string> {

    const TYPE_ERRORS : [string,string,number][] = [
        ["ECONNREFUSED","Connection refused by server.",503],
        ["ENOTFOUND","DNS lookup failed. IP not resolved.",500],
        ["ECONNRESET","Connection reset by server.",503],
        ["ETIMEDOUT","Connection timed out.",504]
    ];

    try{
        const response = await fetch(productUrl,{
            signal: AbortSignal.timeout(10000),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Referer': 'https://www.google.com/', //Make it look like we came from google like a "human :p"
                'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124", "Google Chrome";v="124"', //Dunno anything about headers beyond this point
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'cross-site',
                'sec-fetch-user': '?1',
                'Upgrade-Insecure-Requests': '1',
            }
        });

        if(!response.ok){

            const responseStatusCode=response.status;
            const responseStatusText=STATUS_CODES[responseStatusCode] ?? 'Unknown status';

            throw new ServiceError(responseStatusText,responseStatusCode);
        }

        const trendyolRawHtml = await response.text();

        if(!trendyolRawHtml.includes('window["__envoy__SHARED_PROPS"]=')){
            throw new ServiceError("Product data missing",502); //Sent to a cloudflare security check or captcha check
        }

        return trendyolRawHtml;
    }
    catch(fetchError){  
        
        if(fetchError instanceof ServiceError){
            
            if(fetchError.statusCode===403 || fetchError.statusCode===429){
                throw new ServiceError("Couldn't get product data", 502);
            }

            throw fetchError;
        }

        if(fetchError instanceof Error){

            if(fetchError.name==="TimeoutError"||fetchError.name==="AbortError"){
                throw new ServiceError("Request timed out.",503);
            }
            else if(fetchError.name==="TypeError"){

                const cause=fetchError.cause as NodeJS.ErrnoException | undefined;
                const causeCode= cause?.code;

                for(const [errorType,errorMessage,errorStatusCode] of TYPE_ERRORS){
                    if(causeCode?.includes(errorType)){
                        throw new ServiceError(errorMessage,errorStatusCode);
                    }
                }
                throw new ServiceError(`Network error`,500);
            }
        }
        throw new ServiceError("Unexpected error",500,{cause:fetchError});  
    }
}
