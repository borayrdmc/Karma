import { count, eq } from "drizzle-orm";
import { db } from "../../client";
import { trackedProducts } from "../../schemas";

export async function getUserTrackedProductCount(userId:string){

    const [result]=await db
        .select({value:count()})
        .from(trackedProducts)
        .where(eq(trackedProducts.userId, userId));

    return result?.value ?? 0;
}
