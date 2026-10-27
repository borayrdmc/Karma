import { formatPrice } from "@/lib";
import { PriceInsightResultType } from "@repo/types";
import { MoveUp, MoveDown } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface PriceSectionProps{

    priceInsightResult:PriceInsightResultType;
    formattedPrice:string;
    formattedLastChangeTime:string;
    priceHistoryLength:number;
}

function formatTooltipText(percent:number|undefined, amount:number|undefined, label:"İndirim" | "Zam"){

    const formattedAmount=formatPrice(Math.round(amount ?? 0));
    
    if(percent!=null && percent>=5){
        return `%${Math.round(percent)} - ${formattedAmount} ${label}`;
    }
    return `${formattedAmount} ${label}`;
}

export function PriceSection({priceInsightResult,formattedPrice,formattedLastChangeTime,priceHistoryLength}:PriceSectionProps){
    
    return(
        
        <div className="flex flex-col gap-1">

            <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1 min-h-6">
            
                <span className="text-xl font-bold tracking-tight leading-none text-[#F4F4F4]">
                    {formattedPrice}
                </span>

                {priceInsightResult.status==="real_discount" && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-1 rounded-md leading-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-help">
                                <MoveDown className="size-3"/>
                                {formatPrice(Math.round(priceInsightResult.priceChangeAmount ?? 0))}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {formatTooltipText(priceInsightResult.priceChangePercent, priceInsightResult.priceChangeAmount, "İndirim")}
                        </TooltipContent>
                    </Tooltip>
                )}

                {priceInsightResult.status==="price_increase" && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-1 rounded-md leading-none bg-rose-500/10 text-rose-400 border border-rose-500/25 cursor-help">
                                <MoveUp className="size-3"/>
                                {formatPrice(Math.round(priceInsightResult.priceChangeAmount ?? 0))}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {formatTooltipText(priceInsightResult.priceChangePercent, priceInsightResult.priceChangeAmount, "Zam")}
                        </TooltipContent>
                    </Tooltip>
                )}

                {priceInsightResult.status==="fake_discount" && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-1 rounded-md leading-none bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 cursor-help">
                                <MoveDown className="size-3"/>
                                {formatPrice(Math.round(priceInsightResult.recentDropAmount ?? 0))}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {formatTooltipText(priceInsightResult.recentDropPercent, priceInsightResult.recentDropAmount, "İndirim")}
                        </TooltipContent>
                    </Tooltip>
                )}

            </div> 

            {priceHistoryLength>1 ? (
                <p className="text-xs text-zinc-500 truncate">
                    Son fiyat değişimi: <span className="font-medium text-zinc-400" suppressHydrationWarning>{formattedLastChangeTime}</span>
                </p>
                ) : (
                <p className="text-xs text-zinc-500 truncate">
                    Takibe başlandı: <span className="font-medium text-zinc-400" suppressHydrationWarning>{formattedLastChangeTime}</span>
                </p>
            )}
                

        </div>
    )
}