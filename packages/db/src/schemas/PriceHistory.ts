import { index, numeric, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "./Products";

export const priceHistory = pgTable("price_history",{

    id: uuid('id').primaryKey().defaultRandom(),
    productId : uuid('product_id').notNull().references(()=>products.productId,{onDelete: "cascade"}),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    checkedAt: timestamp("checked_at").defaultNow().notNull(),
    },
    (table)=>[
        index("time_and_id_index").on(table.productId,table.checkedAt)
    ]   
)