import { index, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { products } from "./Products";
import { timestamp } from "drizzle-orm/pg-core";

export const trackedProducts=pgTable("tracked_products",{

    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    productId: uuid('product_id').notNull().references(()=>products.productId, {onDelete:"cascade"}),
    customName: text('custom_name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    //Schema configs
    (table)=>[
        unique("user_and_product_id_unique").on(table.userId,table.productId)
    ]
);