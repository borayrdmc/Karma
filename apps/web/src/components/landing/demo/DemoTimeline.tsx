"use client";

import { Slider } from "radix-ui";
import { formatDateTime } from "@/lib";

interface DemoTimelineProps{
    recordCount:number;
    selectedIndex:number;
    selectedCheckedAt:Date|string;
    plotInset:{left:number;right:number};
    announce?:boolean;
    onChange:(index:number)=>void;
}

// Düğme çapının yarısı (size-5 = 20px). Radix düğmeyi uçlarda izin içinde tutar: ilk değerde düğmenin merkezi
// izin başından yarıçap kadar içeride durur. İz bu kadar dışarı taşırılınca düğme merkezleri grafik noktalarıyla çakışır.
const THUMB_RADIUS=10;

// Kaydırıcı her adımda bir fiyat kaydına denk gelir; klavyeyle ok tuşlarıyla da gezilir.
// Başlık ve kaydırıcı grafiğin çizim alanıyla aynı hizadadır (plotInset): düğme ilk kayıttan son kayda, noktaların tam altında ilerler.
// Giriş animasyonu sırasında announce kapalıdır; ekran okuyucu her kaydı tek tek okumaz.
export function DemoTimeline({recordCount,selectedIndex,selectedCheckedAt,plotInset,announce=true,onChange}:DemoTimelineProps){

    return(
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1" style={{paddingLeft:plotInset.left,paddingRight:plotInset.right}}>
                <span id="demo-timeline-label" className="text-sm font-medium text-[#F4F4F4]">
                    Bu tarihte Karma ne derdi?
                </span>
                <span className="font-mono text-xs text-zinc-400" aria-live={announce ? "polite" : "off"}>
                    {formatDateTime(selectedCheckedAt)} · Kayıt {selectedIndex+1} / {recordCount}
                </span>
            </div>

            {/* Boşluk kaydırıcının dışındaki kapsayıcıda: Radix düğmeyi kökün genişliğine göre konumlar, kökte iç boşluk olsaydı kayardı. */}
            <div style={{paddingLeft:Math.max(0,plotInset.left-THUMB_RADIUS),paddingRight:Math.max(0,plotInset.right-THUMB_RADIUS)}}>
            <Slider.Root
                min={0}
                max={recordCount-1}
                step={1}
                value={[selectedIndex]}
                onValueChange={(value)=>onChange(value[0] ?? selectedIndex)}
                aria-labelledby="demo-timeline-label"
                className="relative flex h-11 w-full touch-none select-none items-center"
            >
                <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-[#09090b] ring-1 ring-zinc-800">
                    <Slider.Range className="absolute h-full rounded-full bg-emerald-500/70"/>
                </Slider.Track>
                <Slider.Thumb
                    aria-label="Fiyat kaydı"
                    aria-valuetext={formatDateTime(selectedCheckedAt)}
                    className="block size-5 cursor-grab rounded-full border-2 border-[#16171a] bg-emerald-400 transition-transform duration-150 ease-out-strong active:scale-110 active:cursor-grabbing motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40"
                />
            </Slider.Root>
            </div>
        </div>
    );
}
