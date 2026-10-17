export type PriceStatus ="price_increase" | "no_change" | "real_discount" | "fake_discount" | "insufficient_data";

export interface PriceInsightResultType{

    status:PriceStatus;
    priceChangeAmount?:number;
    priceChangePercent?:number; 
}