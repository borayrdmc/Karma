import { formatPrice } from "@/lib";
import { PriceInsightResultType } from "@repo/types";
import { MoveUp, MoveDown } from 'lucide-react';

interface PriceSectionProps{

    priceInsightResult:PriceInsightResultType;
    formattedPrice:string;
    formattedLastChangeTime:string;
}

export function PriceSection({priceInsightResult,formattedPrice,formattedLastChangeTime}:PriceSectionProps){
    
    return(
        
        <div className="flex flex-col gap-1">

            <div className="flex flex-row items-center gap-2">
            
                <span className="text-xl font-bold tracking-tight text-gray-900">
                    {formattedPrice}
                </span>

                {priceInsightResult.status==="real_discount" && (

                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <MoveDown className="size-3"/>
                        
                        {(priceInsightResult.priceChangePercent ?? 0) >=5 && (
                            <span> %{Math.round(priceInsightResult.priceChangePercent ?? 0)} - </span>
                        )}
                    
                        {formatPrice(priceInsightResult.priceChangeAmount ?? 0)}
                    </span>
                )}

                {priceInsightResult.status==="price_increase" && (
                    
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">

                        <MoveUp className="size-3"/>

                        {(priceInsightResult.priceChangePercent ?? 0) >=5 && (
                            <span>%{Math.round(priceInsightResult.priceChangePercent ?? 0)} - </span>
                        )}

                        {formatPrice(priceInsightResult.priceChangeAmount ?? 0)}
                    </span>
                )}

                {priceInsightResult.status==="fake_discount" && (

                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 px-2 py-1 rounded-md ">

                        <MoveDown className="size-3"/>

                        {(priceInsightResult.recentDropPercent ?? 0) >= 5 && (
                            <span>%{Math.round(priceInsightResult.recentDropPercent ?? 0)} - </span>
                        )}

                        {formatPrice(priceInsightResult.recentDropAmount ?? 0)}
                    </span>
                )}

                {(priceInsightResult.status==="no_change" || priceInsightResult.status==="insufficient_data") && (
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                        Fiyat Değişimi Yok
                    </span> 
                )}

            </div> 

            {priceInsightResult.status==="fake_discount" && (
                
                <span className="inline-flex justify-center  gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 border border-amber-300">

                        Sahte İndirim Şüphesi
                        <MoveUp className="size-3 translate-y-0.5"/>

                        {(priceInsightResult.priceChangePercent ?? 0) >=5 && (
                            <span> %{Math.round(priceInsightResult.priceChangePercent ?? 0)} - </span>
                        )}
                        
                        {formatPrice(priceInsightResult.priceChangeAmount ?? 0)}
                </span>
            )}

            <p className="text-xs text-gray-400">
                Son fiyat değişimi: <span className="font-medium text-gray-500" suppressHydrationWarning>{formattedLastChangeTime}</span>
            </p>

        </div>
    )
}