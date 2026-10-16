import { ScraperDataType } from "@repo/types";

import { ServiceError } from "@repo/errors";
import { hepsiburadaService } from "./platforms/HepsiburadaService";
import { trendyolService } from "./platforms/TrendyolService";

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