import { ServiceError } from "@repo/errors";

export function extractTrendyolProductCode(productUrl:string){

    const match=productUrl.match(/-p-(\d+)/);
    
	if(!match || !match[1]){
        throw new ServiceError("Verilen linkte ürün kodu bulunamadı.",400);
    }
    const productCode = match[1];

    return productCode
}