import { ProductType } from "@repo/db";
import { ServiceError } from "@repo/errors";

export function extractHepsiburadaProductCodeAndPlatform(url:string):{productPlatform:ProductType["productPlatform"],productCode:ProductType["productCode"]}{

    const match = url.match(/-p-([A-Za-z0-9]+)(?:[/?#].*)?$/); //2nd part is for search params

    if(!match || !match[1]){
        throw new ServiceError("Product code not found in given URL.",400);
    }
    const productCode = match[1];

    return {productPlatform:"hepsiburada", productCode}; //Ignore first (all of the regex) match and 3rd match (search params)
}
