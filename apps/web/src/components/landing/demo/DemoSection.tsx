import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoProductCard } from "./DemoProductCard";
import { getDemoProduct } from "./DemoData";

export async function DemoSection(){

    const demo=await getDemoProduct();

    // Yer tutucu veriyle "gerçek ürün" denmesin diye metin veriye göre seçilir.
    const intro=demo.isPlaceholder
        ? "Karma'nın kararını örnek bir fiyat geçmişiyle gör. Kaydırıcıyı geri çek, Karma'nın o gün ile ilgili yaptığı fiyat analizini incele."
        : "Karma'nın takip ettiği gerçek bir ürünün fiyat geçmişi. Kaydırıcıyı geri çek, Karma'nın o gün ne dediğini gör.";

    return(
        <section id="demo" aria-labelledby="demo-title" className="border-y border-zinc-800/60 bg-[#09090b]">
            <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">

                <div className="max-w-2xl">
                    <h2 id="demo-title" className="text-2xl font-bold tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-3xl">
                        Kayıt olmadan gerçek bir ürün üzerinde dene
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-zinc-400">
                        {intro}
                    </p>
                </div>

                <div className="mt-10">
                    <DemoProductCard demo={demo}/>
                </div>

                {/* İkna anı demonun sonu; sayfanın en altındaki çağrıyı beklemeden kayda yönlendirir. */}
                <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-zinc-800/60 pt-8">
                    <p className="text-base font-medium text-[#F4F4F4] sm:text-lg">Kendi ürünün için dene</p>
                    <Link
                        href="/signup"
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-zinc-950 transition-[color,background-color,transform] duration-150 ease-out hover:bg-emerald-400 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] sm:text-base"
                    >
                        Hesap oluştur
                        <ArrowRight className="size-4" aria-hidden="true"/>
                    </Link>
                </div>
            </div>
        </section>
    );
}
