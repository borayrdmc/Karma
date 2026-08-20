import { db } from "../../client";
import { products } from "../../schemas";

export async function getAllProducts(){
    return db.select().from(products);
}