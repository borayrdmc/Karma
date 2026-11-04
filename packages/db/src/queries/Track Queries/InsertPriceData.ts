import { PriceHistoryInputType, PriceHistoryOutputType } from "@repo/types";
import { db } from "../../client";
import { priceHistory } from "../../schemas";
import { ServiceError } from "@repo/errors";
import { and, desc, eq, inArray, lt } from "drizzle-orm";

const TIMEOUT_DAYS=45

export async function insertPriceData({price,productId}:PriceHistoryInputType): Promise<PriceHistoryOutputType>{

    const [newPrice]=await db
        .insert(priceHistory)
        .values({productId,price})
        .returning();

    if(!newPrice){
        throw new ServiceError("Couldn't save price data.",500);
    }

    const timeoutDate=new Date(Date.now()-TIMEOUT_DAYS*24*60*60*1000);

    const oldRecords=await db
        .select({id:priceHistory.id})
        .from(priceHistory)
        .where(
            and(
                eq(priceHistory.productId,productId),
                lt(priceHistory.checkedAt,timeoutDate)
            )
        )
        .orderBy(desc(priceHistory.checkedAt))
    
    
    if(oldRecords.length>1){

        const oldRecordsToDelete=oldRecords.slice(1)

        const idsToDelete=oldRecordsToDelete.map((record)=>record.id);

        await db
            .delete(priceHistory)
            .where(inArray(priceHistory.id,idsToDelete));
    }

    return newPrice;
}