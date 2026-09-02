import { ProductType } from "@repo/db";
import { ServiceError } from "@repo/errors";

export function extractTrendyolProductCodeAndPlatform(productUrl:string):{productPlatform:ProductType["productPlatform"],productCode:ProductType["productCode"]}{

    const match = productUrl.match(/-p-(\d+)/);
    
	if(!match || !match[1]){
        throw new ServiceError(`Product code not found in given URL.`,400);
    }
    const productCode = match[1];

    return {productPlatform:"trendyol",productCode}; //Ignore first (all of the regex) match and 3rd match (search params)
}
