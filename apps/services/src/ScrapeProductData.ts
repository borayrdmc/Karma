import { ScraperDataType } from "@repo/types";
import { hepsiburadaService } from "./platforms/hepsiburada/HepsiburadaService";
import { trendyolService } from "./platforms/trendyol/TrendyolService";
import { ServiceError } from "@repo/errors";

export async function scrapeProductData(productUrl:string): Promise<ScraperDataType>{

    if(productUrl.includes("hepsiburada")){

        const productData=await hepsiburadaService(productUrl);
        return productData;
    }
    if(productUrl.includes("trendyol")){

        const productData=await trendyolService(productUrl);
        return productData;
    }
    throw new ServiceError("Unsupported product platform.",400);
}