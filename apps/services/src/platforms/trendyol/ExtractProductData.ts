import { ServiceError } from "@repo/errors";
import { TrendyolResponseProductData } from "@repo/types";

export function extractProductData(trendyolRawHtml:string){

    try{
        const sharedPropsText = 'window["__envoy__SHARED_PROPS"]=';
        const startIndexOfPropsText = trendyolRawHtml.indexOf(sharedPropsText);

        if(startIndexOfPropsText===-1){
            throw new ServiceError("Trendyol ürün bilgisi alınamadı.",502,true);
        }

        const startIndexOfJson = startIndexOfPropsText+sharedPropsText.length;

        const lastIndexOfJson = trendyolRawHtml.indexOf('</script>',startIndexOfJson);

        if(lastIndexOfJson===-1){
            throw new ServiceError("Trendyol ürün bilgisi alınamadı!",502,true);
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
            throw new ServiceError("Geçersiz ürün bilgisi yapısı.",502,true);
        }
        throw new ServiceError("Beklenmeyen hata.",500,false);
    }
}
