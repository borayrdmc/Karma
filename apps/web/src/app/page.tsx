import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/sections/header/LandingHeader";
import { DemoSection } from "@/components/landing/demo/DemoSection";
import { HowItWorksSection } from "@/components/landing/sections/HowItWorksSection";
import { FakeDiscountExplainer } from "@/components/landing/sections/fake-discount/FakeDiscountExplainer";
import { EarlyTrackingSection } from "@/components/landing/sections/EarlyTrackingSection";
import { BeforeYouStartSection } from "@/components/landing/sections/BeforeYouStartSection";
import { FinalCtaSection } from "@/components/landing/sections/FinalCtaSection";
import { LandingFooter } from "@/components/landing/sections/LandingFooter";
import { HeroSection } from "@/components/landing/sections/hero/HeroSection";

const DESCRIPTION="Trendyol ve Hepsiburada ürünlerinin fiyat geçmişini takip et. Karma, son 30 günlük geçmişe bakarak indirimin gerçek mi, yoksa öncesinde yapılan bir zamdan mı kaynaklandığını söyler.";

// Demo ürünü veritabanından okunur; sayfa günde bir yeniden üretilir.
export const revalidate=86400;

export const metadata: Metadata={
    title:"Karma",
    description:DESCRIPTION,
    openGraph:{
        title:"Karma",
        description:DESCRIPTION,
        type:"website",
        locale:"tr_TR",
        siteName:"Karma",
    },
    robots:{index:true,follow:true},
};

export default function LandingPage(){

    return(
        // [&_p]:text-pretty: paragrafların son satırında tek kelime kalmasın (Chrome ve Safari; diğerlerinde etkisiz).
        <div className="flex min-h-screen flex-col bg-[#0c0d0e] text-[#F4F4F4] [&_p]:text-pretty">
            <LandingHeader/>
            <main className="flex-1">
                <HeroSection/>
                <DemoSection/>
                <FakeDiscountExplainer/>
                <HowItWorksSection/>
                <EarlyTrackingSection/>
                <BeforeYouStartSection/>
                <FinalCtaSection/>
            </main>
            <LandingFooter/>
        </div>
    );
}
