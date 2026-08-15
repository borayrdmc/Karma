import { ServiceError } from "@repo/errors";
import { TrendyolResponseProductData } from "./TrendyolTypes";

export function extractProductData(trendyolRawHtml:string){

    try{
        const sharedPropsText = 'window["__envoy__SHARED_PROPS"]=';
        const startIndexOfPropsText = trendyolRawHtml.indexOf(sharedPropsText);

        if(startIndexOfPropsText===-1){
            throw new ServiceError("Source HTML code changed.",502);
        }

        const startIndexOfJson = startIndexOfPropsText+sharedPropsText.length;

        const lastIndexOfJson = trendyolRawHtml.indexOf('</script>',startIndexOfJson);

        if(lastIndexOfJson===-1){
            throw new ServiceError("Source HTML code changed.",502);
        }

        const rawStringJSON = trendyolRawHtml.slice(startIndexOfJson,lastIndexOfJson).trim();
        const productDataJSON = JSON.parse(rawStringJSON);

        return productDataJSON as TrendyolResponseProductData;
    }   
    catch(parsingError){

        if(parsingError instanceof ServiceError){
            throw parsingError
        }
        if(parsingError instanceof SyntaxError){
            throw new ServiceError("JSON parse failed",502);
        }
        throw new ServiceError("Unknown error",500,{cause:parsingError});
    }
}
