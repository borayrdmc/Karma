import { STATUS_CODES } from 'node:http';

export async function fetchTrendyolHtmlViaFetch(productUrl: string): Promise<string> {

    const TYPE_ERRORS : [string,string][] = [
        ["ECONNREFUSED","Connection refused by server."],
        ["ENOTFOUND","DNS lookup failed. IP not resolved."],
        ["ECONNRESET","Connection reset by server."],
        ["ETIMEDOUT","Connection timed out."]
    ];

    try{
        const response = await fetch(productUrl,{
            signal: AbortSignal.timeout(10000),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Referer': 'https://www.google.com/',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'cross-site',
                'sec-fetch-user': '?1',
                'Upgrade-Insecure-Requests': '1',
                'Priority': 'u=0, i',
            }
        });

        if(!response.ok){

            const responseStatusCode=response.status;
            const responseStatusText=STATUS_CODES[responseStatusCode] ?? 'Unknown status';

            throw new Error(`${responseStatusCode} ${responseStatusText}`);
        }

        const trendyolRawHtml = await response.text();
        return trendyolRawHtml;
    }
    catch(error){
   
        if(error instanceof Error){

            if(error.name==="TimeoutError"||error.name==="AbortError"){
                throw new Error("Fetch request timed out.");
            }
            else if(error.name==="TypeError"){

                const cause=error.cause as NodeJS.ErrnoException | undefined;
                const causeCode= cause?.code;

                for(const [errorType,errorMessage] of TYPE_ERRORS){
                    if(causeCode?.includes(errorType)){
                        throw new Error(errorMessage);
                    }
                }
                throw new Error(`Network error: ${error.message}`);
            }
        }
        throw error;  
    }
}