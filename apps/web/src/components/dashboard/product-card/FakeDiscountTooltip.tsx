import { PriceInsightResultType } from "@repo/types";
import { formatPrice, formatTime } from "@/lib";
import { TriangleAlert } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface FakeDiscountTooltipProps {
    priceInsightResult: PriceInsightResultType;
    formattedCurrentPrice: string;
}

export function FakeDiscountTooltip({
    priceInsightResult,
    formattedCurrentPrice,
}: FakeDiscountTooltipProps) {
    if (priceInsightResult.status !== "fake_discount") {
        return null;
    }

    const baseTime = priceInsightResult.baseDate
        ? formatTime(priceInsightResult.baseDate)
        : "Kayıt";
    const basePrice = priceInsightResult.basePrice
        ? formatPrice(Math.round(priceInsightResult.basePrice))
        : "—";
    const peakTime = priceInsightResult.peakDate
        ? formatTime(priceInsightResult.peakDate)
        : "Kayıt";
    const peakPrice = priceInsightResult.peakPrice
        ? formatPrice(Math.round(priceInsightResult.peakPrice))
        : "—";

    const diffAmount = priceInsightResult.priceChangeAmount != null
        ? formatPrice(
            priceInsightResult.priceChangeAmount >= 1
                ? Math.round(priceInsightResult.priceChangeAmount)
                : priceInsightResult.priceChangeAmount
          )
        : "—";

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className="absolute left-2.5 top-2.5 z-10 inline-flex size-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-sm backdrop-blur-md transition-all hover:bg-amber-500/25 cursor-help"
                    onClick={(e) => e.stopPropagation()}
                >
                    <TriangleAlert className="size-4" />
                </span>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="w-64 p-3 whitespace-normal z-50">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 border-b border-zinc-800/80 pb-1.5 text-xs font-semibold text-amber-400">
                        <TriangleAlert className="size-3.5 shrink-0" />
                        <span>Sahte İndirim Şüphesi</span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between gap-2 text-zinc-400">
                            <span>• {baseTime} taban:</span>
                            <span className="font-semibold text-[#F4F4F4]">{basePrice}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-zinc-400">
                            <span>• {peakTime} zirve:</span>
                            <span className="font-semibold text-rose-400">{peakPrice}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-zinc-400">
                            <span>• Güncel indirimli fiyat:</span>
                            <span className="font-semibold text-emerald-400">{formattedCurrentPrice}</span>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800/80 pt-1.5 text-[11px] text-zinc-400 leading-snug">
                        Fiyat, zam öncesi tabanın hâlâ{" "}
                        <span className="font-semibold text-amber-400">
                            {diffAmount}
                        </span>{" "}
                        üzerinde. Fiyat değişim grafiğini incelemeniz önerilir.
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
