import { chromium } from 'patchright';
import { STATUS_CODES } from 'node:http';
import { ServiceError } from "@repo/errors";

export async function fetchTrendyolHtmlViaPlaywright(productUrl:string) : Promise<string>{

    const PLAYWRIGHT_ERRORS : [string,string,number][] = [

        ["timeout","Request timed out.",504],
        ["net::err_name_not_resolved","URL not resolved to an adress",400],
        ["target page, context or browser has been closed","Browser killed during process",500],
        ["browsertype.launch","Couldn't launch browser",500],
        ["err_http_response_code_failure", "Connection shut down by server",502],
    ]

    let browser;

    try{

        browser=await chromium.launch({
            channel:"chrome", //Use real chrome browser instead of chromium.
            ignoreDefaultArgs: ['--enable-automation'], //Remove automation flag
            args: [
                '--headless=new', //Hide browser in screen but run it in background like headless
                '--window-size=1920,1080', //Like normal browser
                '--no-sandbox',//Linux?
                '--disable-setuid-sandbox'//Linux?
            ]
        });
        
        const context = await browser.newContext({
            viewport:{width:1920,height:1080},
            userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            locale:'tr-TR',
            timezoneId:'Europe/Istanbul',
            extraHTTPHeaders:{ //Additional protection layer, dunno what this does but if it works dont touch it.
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            }
        });

        const page=await context.newPage();

        const response = await page.goto(productUrl,{waitUntil:'domcontentloaded',timeout:10000});

        if(!response){
            throw new ServiceError("Response is null.",500);
        }

        if(!response.ok()){

            const responseStatusCode=response.status();
            const responseStatusText=STATUS_CODES[responseStatusCode] ?? 'Unknown status';

            if(responseStatusCode===403 || responseStatusCode===429){
                throw new ServiceError("Request denied by upstream service.",502);
            }
            
            throw new ServiceError(responseStatusText,responseStatusCode);
        }

        const trendyolRawHtml=await page.content();

        if(!trendyolRawHtml.includes('window["__envoy__SHARED_PROPS"]=')){
            throw new ServiceError("Product data missing.",502); //Sent to a cloudflare security check or captcha check
        }

        return trendyolRawHtml;
    }

    catch(error){

        if(error instanceof ServiceError){

            const lowerErrorMessage=error.message.toLowerCase();

            for( const [errorType,errorMessage,errorStatusCode] of PLAYWRIGHT_ERRORS){

                if(lowerErrorMessage.includes(errorType)){
                    throw new ServiceError(errorMessage,errorStatusCode);
                }
            }

            throw new ServiceError("Couldn't get product data",502);
        }
        throw new ServiceError("Unexpected error",500,{cause:error});
    }

    finally{
        await browser?.close();
    }
}
