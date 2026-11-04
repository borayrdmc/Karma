import Image from "next/image";
import { ChartLine, Clock, Link as LinkIcon, TriangleAlert, type LucideIcon } from "lucide-react";
import { StepLineDraw } from "./StepLineDraw";

const STEPS:{icon:LucideIcon;title:string;text:string}[]=[
    {icon:LinkIcon,title:"Ürün linkini yapıştır",text:"Hepsiburada veya Trendyol ürününün linkini ekle, istersen ürüne kendine özel bir isim ver. Vermezsen ürünün kendi adı kullanılır."},
    {icon:Clock,title:"Takibi Karma'ya bırak",text:"Karma fiyatı senin yerine düzenli aralıklarla kontrol eder. Fiyat her değiştiğinde yeni bir kayıt açar ve grafiğe ekler."},
    {icon:TriangleAlert,title:"Sahte indirimleri yakala",text:"Karma, önce zam yapılıp ardından “indirim” diye sunulan teklifleri fiyat geçmişine bakarak tespit eder. Gerçek indirimi sahte olandan kolayca ayırt edersin."},
    {icon:ChartLine,title:"Veriye göre karar ver",text:"Bir sonraki alışverişinde reklamlara ve indirim etiketlerine değil fiyat geçmişine bakarak bilinçli alışveriş yap."},
];

// Adımlar kutu yerine tek bir dikey çizgi üzerinde sıralanır; sıra bilgi taşıdığı için numaralıdır. Görünüme girince
// bağlantı çizgileri sırayla çizilir (StepLineDraw); metinler hareketsizdir.
// Masaüstünde adım listesi görselle aynı yükseklikte: her adım kalan yüksekliği eşit paylaşır.
export function HowItWorksSection(){

    return(
        <section id="nasil-calisir" aria-labelledby="how-title" className="border-t border-zinc-800/60">
            <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">

                <h2 id="how-title" className="text-2xl font-bold tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-3xl">
                    Nasıl çalışır
                </h2>

                <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-16">

                    <StepLineDraw className="flex">
                        <ol className="flex flex-1 flex-col">
                            {STEPS.map(({icon:Icon,title,text},index)=>(
                                <li key={title} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0 lg:flex-1 lg:pb-0">
                                    {index<STEPS.length-1 && (
                                        <span data-step-line className="absolute left-5 top-10 bottom-0 w-px -translate-x-1/2 bg-linear-to-b from-emerald-500/40 to-zinc-800" aria-hidden="true"/>
                                    )}
                                    <span className="relative flex size-10 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0c0d0e] text-emerald-400">
                                        <Icon className="size-4" aria-hidden="true"/>
                                    </span>
                                    <div className="pt-1.5 lg:pb-6">
                                        <h3 className="flex items-baseline gap-2 text-base font-semibold text-[#F4F4F4] sm:text-lg">
                                            <span className="tabular-nums text-emerald-400" aria-hidden="true">{index+1}.</span>
                                            {title}
                                        </h3>
                                        <p className="mt-1.5 max-w-[48ch] text-base leading-relaxed text-zinc-400">
                                            {text}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </StepLineDraw>

                    {/* Sahne, adım listesiyle aynı yükseklikte uzar; görsel ortada durur. Görselin kendi kenarlığı olduğu için
                        doğrudan sarılmaz, aradaki boşluk köşelerde çift çizgi oluşmasını önler. */}
                    <div className="flex items-center justify-center rounded-2xl border border-zinc-800/60 bg-[#09090b] p-5 sm:p-8">
                        <div className="w-full overflow-hidden rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)]">
                        <Image
                            src="/landing/add-product.webp"
                            alt="Karma ürün ekleme penceresi: ürün linki ve isteğe bağlı özel isim alanları, Ürün Ekle düğmesi."
                            width={896}
                            height={646}
                            sizes="(min-width: 1024px) 600px, 100vw"
                            className="h-auto w-full"
                        />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
