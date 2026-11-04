import { extractTrendyolProductCodeAndPlatform } from "./trendyol/ExtractTrendyolProductCodeAndPlatform";
import { extractPlatformFromUrl } from "./ExtractPlatformFromUrl";
import { extractHepsiburadaProductCodeAndPlatform } from "./hepsiburada/ExtractHepsiburadaProductCodeAndPlatform";

export async function extractProductCodeAndPlatform(productUrl:string): Promise<{ productPlatform: "hepsiburada" | "trendyol"; productCode: string }>{

    const platform=extractPlatformFromUrl(productUrl);

    if(platform==="hepsiburada"){
        return await extractHepsiburadaProductCodeAndPlatform(productUrl);
    }

    return extractTrendyolProductCodeAndPlatform(productUrl);
}