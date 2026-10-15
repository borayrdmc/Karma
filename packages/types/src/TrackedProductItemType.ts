import { PriceHistoryOutputType } from "./PriceHistoryTypes";
import { ProductOutputType } from "./ProductTypes";
import { TrackedProductOutputType } from "./TrackedProductTypes";

export interface TrackedProductItemType{

    trackedProduct:TrackedProductOutputType;
    product:ProductOutputType;
    productPriceHistory:PriceHistoryOutputType[];
}