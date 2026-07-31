import { chromium } from 'playwright';
import { STATUS_CODES } from 'node:http';

export async function fetchTrendyolHtmlViaPlaywright(productUrl:string) : Promise<string>{

    const PLAYWRIGHT_ERRORS : [string,string][] = [

        ["timeout","Request timed out."],
        ["net::err_name_not_resolved","URL not resolved to an adress"],
        ["target page, context or browser has been closed","Browser killed during process"],
        ["browsertype.launch","Browser couldn't be launched"]
    ]

    let browser;

    try{

        browser=await chromium.launch();
        const page=await browser.newPage();
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