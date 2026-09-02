import { pgEnum, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const platformEnum = pgEnum('platform_type',[
  'trendyol',
  'hepsiburada'
]);

export const products = pgTable("products",{

    productId: uuid("product_id").primaryKey().defaultRandom(),
    productUrl: text("product_url").notNull(),
	productName: text("product_name"),
    productPlatform: platformEnum("product_platform").notNull(),
    productCode: text("product_code").notNull(),
	},
	//Schema Configs
	(table)=>[
		unique('product_code_and_platform_unique').on(table.productPlatform,table.productCode),
	]
)