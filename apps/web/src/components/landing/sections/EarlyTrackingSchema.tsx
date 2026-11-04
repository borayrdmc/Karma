"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_OUT, EASE_TIME } from "../Motion";

gsap.registerPlugin(useGSAP,ScrollTrigger);

// Yeşil alan ve fiyat çizgisi aynı kırpma alanıyla "Bugün"den kampanya gününe doğru açılır: Karma'nın gördüğü geçmiş
// zamanla birikir. Eksen zaman olduğu için açılma doğrusaldır; noktalar, açılma onların x konumuna vardığında belirir.
const REVEAL_DURATION=1.2;
const REVEAL_FROM=60;
const REVEAL_WIDTH=350;

// Fiyat ekseni şematik: sakin dönem y=140, zam y=50, "indirim" y=104.
// Çizim görünür halde render edilir; animasyon yalnızca JS çalışınca uygulanır. Hareket azaltılmışsa şema yalnızca soluklaşarak gelir.
export function EarlyTrackingSchema(){

    const scope=useRef<SVGSVGElement>(null);

    useGSAP(()=>{

        const mm=gsap.matchMedia();
        const scrollTrigger={trigger:scope.current,start:"top 75%",once:true};

        mm.add("(prefers-reduced-motion: no-preference)",()=>{
            const timeline=gsap.timeline({scrollTrigger});
            timeline.from("[data-early-clip]",{scaleX:0,transformOrigin:"0% 50%",duration:REVEAL_DURATION,ease:EASE_TIME},0);

            scope.current?.querySelectorAll<SVGGElement>("[data-early-point]").forEach((point)=>{
                const x=Number(point.dataset.earlyPoint);
                const at=REVEAL_DURATION*(x-REVEAL_FROM)/REVEAL_WIDTH;
                timeline.from(point.querySelector("circle"),{opacity:0,scale:0.8,transformOrigin:"50% 50%",duration:0.2,ease:EASE_OUT},at);
                timeline.from(point.querySelectorAll("text"),{opacity:0,y:4,duration:0.25,ease:EASE_OUT},at+0.05);
            });
        });

        mm.add("(prefers-reduced-motion: reduce)",()=>{
            gsap.from(scope.current,{opacity:0,duration:0.2,ease:"power1.out",scrollTrigger});
        });

    },{scope});

    return(
        <svg
            ref={scope}
            viewBox="0 0 440 210"
            role="img"
            aria-label="Şematik fiyat çizgisi: fiyat bir süre sabit kalıyor, kampanyadan önce zamlanıyor, kampanya günü indirimli gösteriliyor. Bugün eklenen ürünün tüm bu geçmişi Karma'da kayıtlı; kampanya günü eklenen ürünün yalnızca son fiyatı var."
            className="h-auto w-full"
        >
            <defs>
                <clipPath id="early-seen-clip">
                    <rect data-early-clip x={REVEAL_FROM} y="0" width={REVEAL_WIDTH} height="190"/>
                </clipPath>
            </defs>

            <g clipPath="url(#early-seen-clip)">
                <rect x="60" y="24" width="350" height="156" fill="#10b981" fillOpacity="0.06"/>
                <path d="M60 140 L230 140 L270 50 L330 58 L410 104" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round"/>
            </g>
            <line x1="20" y1="180" x2="420" y2="180" stroke="#27272a" strokeWidth="1.5"/>
            <path d="M20 140 L60 140" fill="none" stroke="#52525b" strokeWidth="2.5" strokeDasharray="4 4"/>

            <line x1="60" y1="24" x2="60" y2="180" stroke="#34d399" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="4 4"/>
            <line x1="410" y1="24" x2="410" y2="180" stroke="#a1a1aa" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="4 4"/>

            <circle cx="60" cy="140" r="5" fill="#34d399" stroke="#09090b" strokeWidth="2"/>
            <g data-early-point="270">
                <circle cx="270" cy="50" r="5" fill="#fb7185" stroke="#09090b" strokeWidth="2"/>
                <text x="278" y="44" fill="#fb7185" fontSize="13">zam</text>
            </g>
            <g data-early-point="410">
                <circle cx="410" cy="104" r="5" fill="#fbbf24" stroke="#09090b" strokeWidth="2"/>
                <text x="404" y="128" fill="#fbbf24" fontSize="13" textAnchor="end">“indirim”</text>
            </g>

            <text x="66" y="18" fill="#34d399" fontSize="14" fontWeight="600">Bugün</text>
            <text x="404" y="18" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="end">Kampanya günü</text>
            <text x="235" y="200" fill="#a1a1aa" fontSize="13" textAnchor="middle">Karma&apos;nın gördüğü fiyat geçmişi</text>
        </svg>
    );
}
