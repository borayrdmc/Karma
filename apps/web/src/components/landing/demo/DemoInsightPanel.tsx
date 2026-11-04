import { PriceInsightResultType } from "@repo/types";
import { PackageX } from "lucide-react";
import { formatDateTime, formatPrice } from "@/lib";
import { PriceStatusBadge } from "./PriceStatusBadge";

interface DemoInsightPanelProps{
    insight:PriceInsightResultType;
    currentPrice:string;
    currentCheckedAt:Date|string;
    inStock:boolean;
}

function explain(insight:PriceInsightResultType,currentPrice:string):string{

    const amount=formatPrice(Math.round(insight.priceChangeAmount ?? 0));

    switch(insight.status){
        case "fake_discount":
            return `Fiyat zamdan önce ${formatPrice(insight.basePrice ?? 0)}'ydi, şimdi ${formatPrice(currentPrice)}. Etikette indirim görünse de ürün zamdan önceki fiyatına göre hâlâ ${amount} daha pahalı.`;
        case "real_discount":
            return `Fiyat ${amount} düştü ve zamdan önceki seviyenin de altında. Bu gerçek bir indirim.`;
        case "price_increase":
            return `Fiyat son dip noktasına göre ${amount} arttı.`;
        case "no_change":
            return "Fiyat %1'den fazla değişmedi; bu kadarlık oynama gürültü sayılır.";
        case "insufficient_data":
            return "Karar için en az iki fiyat kaydı gerekir; Karma bu noktada yorum yapmaz.";
    }
}

function Row({label,price,checkedAt,tone}:{label:string;price:string|number;checkedAt?:Date|string;tone?:string}){
    return(
        <div data-demo-verdict className="flex items-baseline justify-between gap-3 py-2">
            <dt className="text-sm text-zinc-400">
                {label}
                {checkedAt && <span className="block font-mono text-xs text-zinc-400">{formatDateTime(checkedAt)}</span>}
            </dt>
            <dd className={`text-base font-semibold tabular-nums ${tone ?? "text-[#F4F4F4]"}`}>{formatPrice(price)}</dd>
        </div>
    );
}

// "Karma bu kararı nasıl verdi?": kararın dayandığı fiyatları tarihleriyle gösterir.
// data-demo-verdict öğeleri demonun giriş animasyonunda sırayla belirir (DemoProductCard).
export function DemoInsightPanel({insight,currentPrice,currentCheckedAt,inStock}:DemoInsightPanelProps){

    return(
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-800/80 bg-[#09090b]/60 p-4 sm:p-5">
            <div data-demo-verdict className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#F4F4F4]">Karma bu kararı nasıl verdi?</h3>
                {inStock
                    ? <PriceStatusBadge status={insight.status}/>
                    : (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-1 text-xs font-semibold leading-none text-zinc-300">
                            <PackageX className="size-3.5" aria-hidden="true"/>
                            Stokta yok
                        </span>
                    )}
            </div>

            <dl className="divide-y divide-zinc-800/80">
                {inStock && insight.status==="fake_discount" && insight.basePrice!=null && (
                    <Row label="Zam öncesi taban" price={insight.basePrice} checkedAt={insight.baseDate}/>
                )}
                {inStock && insight.status==="fake_discount" && insight.peakPrice!=null && (
                    <Row label="Zirve" price={insight.peakPrice} checkedAt={insight.peakDate} tone="text-rose-400"/>
                )}
                <Row label="Güncel fiyat" price={currentPrice} checkedAt={currentCheckedAt}/>
            </dl>

            <p data-demo-verdict className="text-sm leading-relaxed text-zinc-300" aria-live="polite">
                {inStock ? explain(insight,currentPrice) : "Ürün stokta değil; tekrar satışa çıkana kadar indirim yorumu yapılmaz."}
            </p>
        </div>
    );
}
