import { ScraperDataType } from "@repo/types";
import { hepsiburadaService } from "./platforms/HepsiburadaService";
import { trendyolService } from "./platforms/TrendyolService";
import { extractPlatformFromUrl } from "./platforms/ExtractPlatformFromUrl";

export async function scrapeProductData(productUrl:string): Promise<ScraperDataType>{

    const platform = extractPlatformFromUrl(productUrl);

    if(platform==="hepsiburada"){
        return await hepsiburadaService(productUrl);
    }

    return await trendyolService(productUrl);
}