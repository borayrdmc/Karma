import { ServiceError } from "@repo/errors";
import { fetchHepsiburadaHtml } from "./FetchHepsiburadaHtml";

export async function extractHepsiburadaCode(productUrl:string,htmlData?:string): Promise<string>{

    const match=productUrl.match(/-p[m]?-([A-Za-z0-9]+)(?:[/?#].*)?$/);

    if(!match || !match[0] || !match[1]){
        throw new ServiceError("No product code found in given URL",400);
    }
    
    const rawCode=match[1];

    if(rawCode.startsWith("HBCV") || rawCode.startsWith("HBV")){
        return rawCode;
    }
    
    const html=htmlData ?? await fetchHepsiburadaHtml(productUrl);

    const productCodeMatch=html?.match(/<meta\s+name="page_value"\s+content="([^"]+)"/i);

    if(!productCodeMatch || !productCodeMatch[1]){
        throw new ServiceError("Couldn't find product code", 500);
    }

    return productCodeMatch[1];
}