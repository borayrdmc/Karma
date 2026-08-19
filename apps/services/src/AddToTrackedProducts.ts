import { ScraperDataType } from "@repo/types";
import { insertOrGetProductData, insertPriceData, trackProduct } from "@repo/db";
import { ServiceError } from "@repo/errors";

export async function addTrackedProduct(scraperProductData:ScraperDataType){

    try{

        const databaseProductData=await insertOrGetProductData(scraperProductData.productData);

        if(!databaseProductData){
            throw new ServiceError("Couldn't save or get product data.",500);
        }
        
        await trackProduct({userId:"test_user",productId:databaseProductData.productId});
        await insertPriceData({price:scraperProductData.price,productId:databaseProductData.productId});

        return databaseProductData;
    }
    catch(databaseError){

        if(databaseError instanceof ServiceError){
            throw databaseError;
        }
    }   
}