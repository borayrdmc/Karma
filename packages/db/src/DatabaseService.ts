import { ScraperDataType } from "@repo/types";
import { insertOrGetProductData } from "./queries/InsertOrGetProductData";
import { trackProduct } from "./queries/TrackProduct";
import { insertPriceData } from "./queries/InsertPriceData";

export async function databaseService(scraperProductData:ScraperDataType){

    const databaseProductData=await insertOrGetProductData(scraperProductData.productData);

    if(!databaseProductData){
        throw new Error("Couldn't save or get product data.");
    }

    await trackProduct({userId:"test_user",productId:databaseProductData.productId});
    await insertPriceData({price:scraperProductData.price,productId:databaseProductData.productId});
}