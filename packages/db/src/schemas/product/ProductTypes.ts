import { priceHistory } from "./PriceHistory";
import { products } from "./Products";
import { trackedProducts } from "./TrackedProducts";

export type ProductType=typeof products.$inferSelect;
export type TrackedProductType=typeof trackedProducts.$inferInsert;
export type PriceHistoryType=typeof priceHistory.$inferSelect;
