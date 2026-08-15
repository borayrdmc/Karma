import { ServiceError } from "@repo/errors";

export function extractTrendyolProductCode(productUrl:string){

    const match = productUrl.match(/-p-(\d+)/);
    
	if(!match || !match[1]){
        throw new ServiceError(`Product code not found`,400);
    }
    const productCode = match[1];

    return productCode; //Ignore first (all of the regex) match and 3rd match (search params)
}
