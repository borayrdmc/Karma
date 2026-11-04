import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HeroVisual } from "./HeroVisual";

// 2x2 ızgara: dört madde iki satıra eşit dağılır, sütunlar hizalı durur.
const HERO_FACTS=["Hepsiburada ve Trendyol ürünleri tek ekranda","Eklenti kurmadan, sadece linkle takip et","Fiyat geçmişini grafikle incele","Ürünlere istediğin ismi ver"];

const focusRing="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0d0e]";

export function HeroSection(){

    return(
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(16,185,129,0.14),transparent)]">
            <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">

                <div className="max-w-3xl">
                    <h1 className="text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-5xl lg:text-6xl">
                        İndirim <span className="whitespace-nowrap text-emerald-400">gerçek mi</span>, yoksa öncesinde zam mı yapıldı?
                    </h1>

                    <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-zinc-400 sm:text-lg">
                        Ürün linkini ver, Karma fiyatı düzenli aralıklarla kontrol etsin. Fiyat değiştiğinde kaydeder ve indirimin gerçek mi sahte mi olduğunu söyler.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <Link
                            href="/signup"
                            className={`inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-zinc-950 transition-[color,background-color,transform] duration-150 ease-out hover:bg-emerald-400 active:scale-[0.97] motion-reduce:active:scale-100 sm:text-base ${focusRing}`}
                        >
                            Ücretsiz hesap oluştur
                            <ArrowRight className="size-4" aria-hidden="true"/>
                        </Link>
                        <Link
                            href="/signin"
                            className={`inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-zinc-300 transition-[color,background-color,transform] duration-150 ease-out hover:text-[#F4F4F4] active:scale-[0.97] motion-reduce:active:scale-100 sm:text-base ${focusRing}`}
                        >
                            Giriş yap
                        </Link>
                    </div>

                    <ul className="mt-8 grid gap-x-8 gap-y-2 text-sm text-zinc-400 sm:w-fit sm:grid-cols-2">
                        {HERO_FACTS.map((fact)=>(
                            <li key={fact} className="inline-flex items-start gap-1.5">
                                <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true"/>
                                {fact}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Panel görüntüsü metin sütunundan daha geniş: ekran görüntüsündeki yazılar okunabilir boyuta yaklaşır. */}
            <div className="mx-auto mt-12 w-full max-w-7xl px-4 pb-16 sm:mt-16 sm:px-6 lg:pb-24">
                <HeroVisual/>
            </div>
        </section>
    );
}
