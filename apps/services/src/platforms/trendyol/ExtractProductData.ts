import { TrendyolResponseProductData } from "./TrendyolTypes";

export function extractProductData(trendyolRawHtml:string){

    const sharedPropsText = 'window["__envoy__SHARED_PROPS"]=';
    const startIndexOfPropsText = trendyolRawHtml.indexOf(sharedPropsText);

    if(startIndexOfPropsText===-1){
        throw new Error("SHARED PROPS not found. Check HTML for changes.");
    }

    const startIndexOfJson = startIndexOfPropsText+sharedPropsText.length;

    const lastIndexOfJson = trendyolRawHtml.indexOf('</script>',startIndexOfJson);

    if(lastIndexOfJson===-1){
        throw new Error("</script> tag not found. Check HTML for changes.")
    }

    const rawStringJSON = trendyolRawHtml.slice(startIndexOfJson,lastIndexOfJson).trim();
    const productDataJSON = JSON.parse(rawStringJSON);

    return productDataJSON as TrendyolResponseProductData;
}