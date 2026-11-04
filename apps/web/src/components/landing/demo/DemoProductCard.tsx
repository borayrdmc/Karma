"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatDateTime, formatPrice, PriceInsight } from "@/lib";
import { PriceSection } from "@/components/dashboard/product-card/PriceSection";
import { ProductImagePlaceholder } from "@/components/shared/ProductImagePlaceholder";
import type { DemoProduct } from "./DemoData";
import { DemoPriceChart, getPlotInset } from "./DemoPriceChart";
import { DemoTimeline } from "./DemoTimeline";
import { DemoInsightPanel } from "./DemoInsightPanel";
import { EASE_OUT, EASE_TIME } from "../Motion";

gsap.registerPlugin(useGSAP,ScrollTrigger);

const PLATFORM_NAMES={trendyol:"Trendyol",hepsiburada:"Hepsiburada"} as const;

// Kart, kaydırıcıda ya da grafikte seçilen ana göre çalışır: o güne kadar olan kayıtlarla PriceInsight yeniden hesaplanır.
export function DemoProductCard({demo}:{demo:DemoProduct}){

    const {priceHistory,snapshotAt,inStock,isPlaceholder,product}=demo;
    const lastIndex=priceHistory.length-1;
    const [selectedIndex,setSelectedIndex]=useState(lastIndex);
    // Giriş animasyonunda yalnızca grafik ve kaydırıcı kayıtları gezer (sweepIndex); ürün bilgisi ve karar paneli
    // güncel halde sabit kalır, fiyatlar hızla değişip göz yormasın diye.
    const [sweepIndex,setSweepIndex]=useState<number|null>(null);
    const chartIndex=sweepIndex ?? selectedIndex;

    const scope=useRef<HTMLDivElement>(null);
    const intro=useRef<gsap.core.Timeline|null>(null);

    // Görünüme girince fiyat çizgisi soldan sağa çizilir, kaydırıcı da kayıtları sırayla gezer. Aynı sürede karar panelinin
    // satırları sırayla belirir; ikisi birlikte biter. Kartın geri kalanı hareketsizdir: göz tek hikâyeyi, çizimi izler.
    // Kart HTML'de tam haliyle gelir: JS çalışmazsa ya da hareket azaltılmışsa animasyon kurulmaz.
    useGSAP(()=>{

        const mm=gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)",()=>{
            const chart=scope.current?.querySelector<HTMLElement>("[data-demo-chart]");
            const sweep={index:0};
            // Kırpma değeri kapsayıcıya yazılır ve alan ile çizgi yollarına miras geçer. Değeri doğrudan yollara yazmak
            // stil hesabını küçültürdü ama Recharts seçili kayıt her değiştiğinde bu yolları yeniden oluşturuyor;
            // yeni yol değeri bilmeden doğar ve bir kare görünmez olurdu. Grafik küçük olduğu için miras maliyeti önemsiz.
            const drawTo=(index:number)=>{
                chart?.style.setProperty("--demo-reveal",`${(1-index/Math.max(1,lastIndex))*100}%`);
            };
            const clearReveal=()=>chart?.style.removeProperty("--demo-reveal");

            const sweepDuration=Math.min(3,0.22*lastIndex);

            setSweepIndex(0);
            drawTo(0);

            const timeline=gsap.timeline({
                scrollTrigger:{trigger:scope.current,start:"top 70%",once:true},
                onComplete:()=>{
                    clearReveal();
                    setSweepIndex(null);
                },
            });
            // Eksen zaman olduğu için çizim doğrusaldır. Nokta, çizgi ona vardığında belirir (floor): yuvarlama noktayı çizginin önüne geçirirdi.
            timeline.to(sweep,{
                index:lastIndex,
                duration:sweepDuration,
                ease:EASE_TIME,
                onUpdate:()=>{
                    drawTo(sweep.index);
                    setSweepIndex(Math.floor(sweep.index));
                },
            });
            // Karar paneli grafikle aynı anda kurulur: satırlar çizim süresine yayılır, son satır çizgiyle birlikte yerine oturur.
            timeline.from("[data-demo-verdict]",{opacity:0,y:12,duration:0.4,ease:EASE_OUT,stagger:{amount:Math.max(0,sweepDuration-0.4)}},0);
            intro.current=timeline;

            return ()=>{
                intro.current=null;
                clearReveal();
                setSweepIndex(null);
            };
        });

    },{scope,dependencies:[lastIndex]});

    // Kullanıcı animasyon sürerken kaydırıcıya ya da grafiğe dokunursa animasyon hemen biter, seçim kullanıcıya geçer.
    const handleSelect=(index:number)=>{
        intro.current?.progress(1);
        intro.current=null;
        setSelectedIndex(index);
    };

    const selectedRecord=priceHistory[selectedIndex]!;

    const insight=useMemo(()=>{
        const historyUntilSelected=priceHistory.slice(0,selectedIndex+1);
        const now=selectedIndex===lastIndex ? new Date(snapshotAt) : new Date(selectedRecord.checkedAt);
        return PriceInsight(historyUntilSelected,now);
    },[priceHistory,selectedIndex,lastIndex,snapshotAt,selectedRecord]);

    const plotInset=useMemo(()=>getPlotInset(priceHistory),[priceHistory]);

    const [imageError,setImageError]=useState(false);
    const showImage=Boolean(product.imageUrl) && !imageError;

    return(
        <div ref={scope} className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#16171a] shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)]">

            {isPlaceholder && (
                <div className="border-b border-dashed border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300 sm:px-6">
                    Yer tutucu veri · Gerçek demo ürünü seçilene kadar örnek fiyatlar gösteriliyor.
                </div>
            )}

            <div className="flex flex-col gap-6 p-4 sm:p-6">

                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-300">Örnek ürün</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDateTime(snapshotAt,false)} itibarıyla</span>
                    <span aria-hidden="true">·</span>
                    <span>{PLATFORM_NAMES[product.platform]}</span>
                </p>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-8">

                    <div className="flex min-w-0 flex-col gap-5">
                        <div className="flex items-center gap-4">
                            {/* Dashboard kartıyla aynı davranış: görsel varsa gösterilir, yoksa ya da yüklenemezse yer tutucu. */}
                            <div className="relative flex size-18 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-zinc-600">
                                {showImage ? (
                                    <Image
                                        src={product.imageUrl!}
                                        alt={product.name}
                                        fill
                                        sizes="72px"
                                        onError={()=>setImageError(true)}
                                        className="object-cover"
                                    />
                                ) : (
                                    <ProductImagePlaceholder label="Görsel yok"/>
                                )}
                            </div>
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <div>
                                    <h3 className="truncate text-base font-semibold text-[#F4F4F4]">{product.name}</h3>
                                    {product.brand && <p className="text-xs text-zinc-400">{product.brand}</p>}
                                </div>
                                <PriceSection
                                    priceInsightResult={inStock ? insight : {status:"insufficient_data"}}
                                    formattedPrice={formatPrice(selectedRecord.price)}
                                    formattedLastChangeTime={formatDateTime(selectedRecord.checkedAt)}
                                    priceHistoryLength={selectedIndex+1}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <DemoPriceChart
                                    priceHistory={priceHistory}
                                    selectedIndex={chartIndex}
                                    hideFuture={sweepIndex!=null}
                                    onSelect={handleSelect}
                                />
                            </div>
                            <div>
                                <DemoTimeline
                                    recordCount={priceHistory.length}
                                    selectedIndex={chartIndex}
                                    selectedCheckedAt={priceHistory[chartIndex]!.checkedAt}
                                    plotInset={plotInset}
                                    announce={sweepIndex==null}
                                    onChange={handleSelect}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <DemoInsightPanel
                                insight={insight}
                                currentPrice={selectedRecord.price}
                                currentCheckedAt={selectedRecord.checkedAt}
                                inStock={inStock}
                            />
                        </div>

                        <details data-demo-verdict className="demo-records group rounded-xl border border-zinc-800/80 bg-[#09090b]/60">
                            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 text-sm font-medium text-zinc-300 hover:text-[#F4F4F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 [&::-webkit-details-marker]:hidden">
                                Tüm kayıtları göster ({priceHistory.length})
                                <ChevronDown className="size-4 transition-transform duration-200 ease-out-strong group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"/>
                            </summary>
                            <div className="max-h-72 overflow-y-auto border-t border-zinc-800/80">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-[#09090b] text-xs text-zinc-400">
                                        <tr>
                                            <th scope="col" className="px-4 py-2 font-medium">Tarih ve saat</th>
                                            <th scope="col" className="px-4 py-2 text-right font-medium">Fiyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/60">
                                        {priceHistory.map((record,index)=>(
                                            <tr
                                                key={String(record.checkedAt)}
                                                aria-current={index===selectedIndex ? "true" : undefined}
                                                className={index===selectedIndex ? "bg-emerald-500/10 text-[#F4F4F4]" : "text-zinc-300"}
                                            >
                                                <td className="px-4 py-2 font-mono text-xs">{formatDateTime(record.checkedAt)}</td>
                                                <td className="px-4 py-2 text-right tabular-nums">{formatPrice(record.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
