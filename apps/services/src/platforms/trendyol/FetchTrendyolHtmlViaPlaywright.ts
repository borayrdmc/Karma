import { chromium } from 'patchright';
import { STATUS_CODES } from 'node:http';

export async function fetchTrendyolHtmlViaPlaywright(productUrl:string) : Promise<string>{

    const PLAYWRIGHT_ERRORS : [string,string][] = [

        ["timeout","Request timed out."],
        ["net::err_name_not_resolved","URL not resolved to an adress"],
        ["target page, context or browser has been closed","Browser killed during process"],
        ["browsertype.launch","Browser couldn't be launched"],
        ["err_http_response_code_failure", "Connection shut down by server"],
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
            throw new Error("Response is null.");
        }

        if(!response.ok()){

            const responseStatusCode=response.status();
            const responseStatusText=STATUS_CODES[responseStatusCode] ?? 'Unknown status';

            throw new Error(`${responseStatusCode} ${responseStatusText}`);
        }

        const trendyolRawHtml=await page.content();

        if(!trendyolRawHtml.includes('window["__envoy__SHARED_PROPS"]=')){
            throw new Error("HTML fetched successfully but product data is missing. Captcha, WAF or invalid response."); //Sent to a cloudflare security check or captcha check
        }

        return trendyolRawHtml;
    }

    catch(error){

        if(error instanceof Error){

            const lowerErrorMessage=error.message.toLowerCase();

            for( const [errorType,errorMessage] of PLAYWRIGHT_ERRORS){

                if(lowerErrorMessage.includes(errorType)){
                    throw new Error(errorMessage);
                }
            }
        }
        throw error;
    }

    finally{
        await browser?.close();
    }
}