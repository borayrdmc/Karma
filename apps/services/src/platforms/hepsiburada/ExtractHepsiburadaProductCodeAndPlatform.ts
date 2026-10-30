import { ServiceError } from "@repo/errors";
import { ProductInputType } from "@repo/types";
import { extractHepsiburadaCodeNameImage } from "./ExtractHepsiburadaCodeNameImage";

export async function extractHepsiburadaProductCodeAndPlatform(productUrl: string): Promise<{ productPlatform: ProductInputType["productPlatform"]; productCode: string }> {

    const match=productUrl.match(/-p[m]?-([A-Za-z0-9]+)(?:[/?#].*)?$/);

    if(!match || !match[1]){
        throw new ServiceError("Product code not found in given URL.", 400);
    }

    const rawCode=match[1];

    if(rawCode.startsWith("HBCV") || rawCode.startsWith("HBV")){
        return {productPlatform:"hepsiburada", productCode:rawCode};
    }

    const {productCode}=await extractHepsiburadaCodeNameImage(productUrl);

    return {productPlatform:"hepsiburada", productCode};
}