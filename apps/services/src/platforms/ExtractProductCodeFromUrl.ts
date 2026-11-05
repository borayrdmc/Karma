import { extractPlatformFromUrl } from "./ExtractPlatformFromUrl";
import { extractHepsiburadaCode } from "./hepsiburada/ExtractHepsiburadaCode";
import { extractTrendyolProductCode } from "./trendyol/ExtractTrendyolProductCode";

export async function extractProductCodeFromUrl(productUrl:string){

    const platform=extractPlatformFromUrl(productUrl);

    if(platform==="hepsiburada"){
        const productCode=await extractHepsiburadaCode(productUrl);
        return productCode;
    }

    const productCode=extractTrendyolProductCode(productUrl);
    return productCode;
    
}