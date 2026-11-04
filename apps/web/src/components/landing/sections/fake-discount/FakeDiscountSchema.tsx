"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE_OUT, EASE_TIME } from "../../Motion";

gsap.registerPlugin(useGSAP,ScrollTrigger,DrawSVGPlugin);

// Çizginin uzunluğu boyunca noktaların yeri (0–1): düz taban 80, çıkış ~190, iniş ~154 birim.
// Çizim doğrusal olduğu için her nokta, çizgi ona vardığı anda belirir.
const LINE_DURATION=1.2;
const POINT_AT=[0,0.64,1];

// Soldaki ekran görüntüsündeki HP Victus'un gerçek kayıtları: 23 Ekim taban 49.448,85 → 29 Ekim zirve 55.999 → 30 Ekim 50.000 TL.
// Rakamlar gerçek, çizim ölçekli değil: ölçekli çizimde 551 TL'lik fark yaklaşık 9 px kalıyordu, okunsun diye 30 px'e
// büyütüldü (taban y=200, 50.000 TL y=170, zirve y=53). Alt yazı bunu açıkça söyler.
// Zaman ekseni sıkıştırılmıştır. Çıkış ve iniş yaklaşık 50° eğimle çizilir; dik çizgiler bıçak gibi duruyordu.
// Çizim görünür halde render edilir; animasyon yalnızca JS çalışınca ve hareket azaltılmamışsa uygulanır.
export function FakeDiscountSchema(){

    const scope=useRef<HTMLDivElement>(null);

    useGSAP(()=>{

        const mm=gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)",()=>{
            const timeline=gsap.timeline({scrollTrigger:{trigger:scope.current,start:"top 80%",once:true}});
            timeline.from("[data-schema-line]",{drawSVG:"0%",duration:LINE_DURATION,ease:EASE_TIME});

            // Nokta çizgiye konar (hafif büyüyerek), etiketi hemen ardından yerine oturur.
            scope.current?.querySelectorAll<SVGGElement>("[data-schema-point]").forEach((point,index)=>{
                const at=LINE_DURATION*POINT_AT[index]!;
                timeline.from(point.querySelector("circle"),{opacity:0,scale:0.8,transformOrigin:"50% 50%",duration:0.2,ease:EASE_OUT},at);
                timeline.from(point.querySelectorAll("text"),{opacity:0,y:4,duration:0.25,ease:EASE_OUT},at+0.05);
            });

            // Fark ölçülür: köşeli çizgi zam öncesi tabandan son fiyata doğru çizilir, rakam ardından gelir.
            timeline.from("[data-schema-gap] path",{drawSVG:"0%",duration:0.4,ease:EASE_OUT},LINE_DURATION+0.1);
            timeline.from("[data-schema-gap] text",{opacity:0,y:4,duration:0.25,ease:EASE_OUT},"-=0.1");
        });

    },{scope});

    return(
        <div ref={scope} className="rounded-xl border border-zinc-800/80 bg-[#09090b]/60 p-4 sm:p-5">
            <svg viewBox="0 0 440 250" className="h-auto w-full" role="img" aria-labelledby="schema-title schema-desc">
                <title id="schema-title">HP Victus fiyat hareketi</title>
                <desc id="schema-desc">23 Ekim&apos;de 49.449 TL olan fiyat 29 Ekim&apos;de 55.999 TL&apos;ye zamlanıyor, 30 Ekim&apos;de 5.999 TL &quot;indirimle&quot; 50.000 TL&apos;ye iniyor. Son fiyat zamdan önceki fiyatın hâlâ 551 TL üzerinde.</desc>

                <line x1="30" y1="200" x2="352" y2="200" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="5 5"/>

                <path data-schema-line d="M30 200 L110 200 L230 53 L330 170" fill="none" stroke="#10b981" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>

                <g data-schema-point>
                    <circle cx="30" cy="200" r="5" fill="#a1a1aa" stroke="#16171a" strokeWidth="2"/>
                    <text x="30" y="224" fontSize="14" fill="#d4d4d8">49.449 TL</text>
                    <text x="30" y="240" fontSize="12" fill="#a1a1aa">taban · 23 Ekim</text>
                </g>
                <g data-schema-point>
                    <circle cx="230" cy="53" r="5" fill="#fb7185" stroke="#16171a" strokeWidth="2"/>
                    <text x="230" y="20" fontSize="12" fill="#a1a1aa" textAnchor="middle">29 Ekim</text>
                    <text x="230" y="36" fontSize="14" fill="#fb7185" textAnchor="middle">55.999 TL · zam</text>
                </g>
                <g data-schema-point>
                    <circle cx="330" cy="170" r="5" fill="#34d399" stroke="#16171a" strokeWidth="2"/>
                    <text x="338" y="112" fontSize="12" fill="#a1a1aa">30 Ekim</text>
                    <text x="338" y="128" fontSize="14" fill="#34d399">50.000 TL</text>
                    <text x="338" y="144" fontSize="12" fill="#a1a1aa">5.999 TL &quot;indirim&quot;</text>
                </g>

                <g data-schema-gap>
                    <path d="M340 200 H352 M346 200 V170 M340 170 H352" fill="none" stroke="#fbbf24" strokeWidth="2"/>
                    <text x="358" y="190" fontSize="14" fontWeight="600" fill="#fbbf24">+551 TL</text>
                </g>
            </svg>

            <p className="mt-3 text-xs text-zinc-400">Resimdeki ürünün gerçek kayıtları · Farkın görülmesi için büyütülmüştür.</p>
        </div>
    );
}
