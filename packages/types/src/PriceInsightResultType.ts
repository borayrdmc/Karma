export type PriceStatus ="price_increase" | "real_discount" | "fake_discount" | "no_change" | "insufficient_data";

export interface PriceInsightResultType{

    status:PriceStatus;
    priceChangeAmount?:number;
    priceChangePercent?:number; 
    recentDropPercent?:number; 
    recentDropAmount?:number;
    basePrice?:number;
    baseDate?:Date | string;
    peakPrice?:number;
    peakDate?:Date | string;
}