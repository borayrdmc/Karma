import { ServiceError } from "@repo/errors";
import { extractHepsiburadaProductCodeAndPlatform } from "./hepsiburada/ExtractHepsiburadaProductCodeAndPlatform";
import { extractTrendyolProductCodeAndPlatform } from "./trendyol/ExtractTrendyolProductCode";

export function extractProductCodeAndPlatformFromGivenUrl(productUrl:string): {productPlatform:"hepsiburada"|"trendyol",productCode:string}{

    if(productUrl.includes("hepsiburada")){

        const {productPlatform,productCode}= extractHepsiburadaProductCodeAndPlatform(productUrl);

        return {productPlatform,productCode};
    }
    if(productUrl.includes("trendyol")){

        const {productPlatform,productCode}= extractTrendyolProductCodeAndPlatform(productUrl);

        return {productPlatform,productCode};
    }
    throw new ServiceError("Product platform not supported.",400);
}