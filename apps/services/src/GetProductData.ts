import { ScraperDataType } from "@repo/types";
import { hepsiburadaService } from "./platforms/hepsiburada/HepsiburadaService";
import { trendyolService } from "./platforms/trendyol/TrendyolService";

export async function getProductData(productUrl:string): Promise<ScraperDataType>{

    if(productUrl.includes("hepsiburada")){

        const productData=await hepsiburadaService(productUrl);
        return productData;
    }
    if(productUrl.includes("trendyol")){

        const productData=await trendyolService(productUrl);
        return productData;
    }
    throw new Error("Unsupported product platform.");
}