"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_IN_OUT } from "../Motion";

gsap.registerPlugin(useGSAP,ScrollTrigger);

interface StepLineDrawProps{
    children:ReactNode;
    className?:string;
}

// Adım metinleri baştan görünür; yalnızca adımları bağlayan [data-step-line] çizgileri yukarıdan aşağı sırayla çizilir.
// Sırayı metni bekletmeden çizgi anlatır. Hareket azaltılmışsa çizgiler hareketsiz durur.
export function StepLineDraw({children,className}:StepLineDrawProps){

    const scope=useRef<HTMLDivElement>(null);

    useGSAP(()=>{

        const mm=gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)",()=>{
            gsap.from("[data-step-line]",{
                scaleY:0,
                transformOrigin:"50% 0%",
                duration:0.4,
                ease:EASE_IN_OUT,
                stagger:0.4,
                scrollTrigger:{trigger:scope.current,start:"top 75%",once:true},
            });
        });

    },{scope});

    return <div ref={scope} className={className}>{children}</div>;
}
