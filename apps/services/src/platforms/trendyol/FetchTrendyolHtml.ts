export async function fetchTrendyolHtml(productUrl: string): Promise<string> {

    try{

        const response = await fetch(productUrl,{
            signal: AbortSignal.timeout(10000),
            headers:{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            }
        });

        if(!response.ok){
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        return html;
    }
    catch(error:unknown){

        if(error instanceof Error){

            if(error.name==="TimeoutError"){
                throw new Error("Fetch request timed out.");
            }
            else{
                throw new Error(`Fetch request failed: ${error.message}`)
            }
        }
        else{
            throw new Error(`Unknown error type: ${error}`)
        }
    }
}