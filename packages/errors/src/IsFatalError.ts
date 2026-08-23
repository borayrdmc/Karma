import { ServiceError } from "./ServiceError";

export function isFatalError(error:ServiceError){

    if(error.statusCode===429 || error.statusCode===403){
        return true;
    }
    
    const fatalErrorList: string[]=[

        //Hepsiburada
        "product code not found in given url", //Product code extractor error - 400
        "invalid product code", //Fetch error - 400 
        "product listings not found", //Cheapest listing finder error - 404
        //Internal server errors not fatal

        //Trendyol
        "source html code changed", //HTML parser error - 502
        "json parse failed", //JSON parser error - 502
        "no listings were found", //Service error - 404
        "url not resolved to an adress", //Playwright error - 400
        "couldn't launch browser", //Playwright error - 500
        "err_http_response_code_failure", //Playwright error - 502
        "request timed out",//Playwright error - 504
        "couldn't get product data" //Playwright error - 502
    ]

    for(const fatalError of fatalErrorList){

        if(error.message.toLowerCase().includes(fatalError)){
            return true;
        }
    }
    return false;
}
