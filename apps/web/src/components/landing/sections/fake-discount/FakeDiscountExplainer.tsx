import Image from "next/image";
import { FakeDiscountSchema } from "./FakeDiscountSchema";

// Önce ne olduğu ve Karma'nın senin için ne yaptığı, sonra şematik örnek ve gerçek takip verisinden ekran görüntüsü (kanıt).
// Masaüstünde görsel solda: ardından gelen "Nasıl çalışır" bölümünde görsel sağda olduğu için zikzak oluşur. Karma'nın ne yaptığını anlatan cümle
// kanıtın (ekran görüntüsünün) altında durur; iki sütun aynı yükseklikte biter. Paragraflar hareketsizdir: bölümün hareketi şemadadır.
export function FakeDiscountExplainer(){

    return(
        <section id="sahte-indirim" aria-labelledby="fake-title">
            <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch lg:gap-16">

                <div className="flex flex-col gap-8 lg:justify-between">
                    <div>
                        <h2 id="fake-title" className="text-2xl font-bold tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-3xl">
                            Bindirim: sahte indirim nasıl anlaşılır
                        </h2>
                        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">
                            Önce zam yapılır, ardından zamlı fiyat üzerinden indirime gidilir. Ürün indirime girmiş gibi gösterilse de zamdan önceki fiyatına göre hâlâ daha pahalıdır. Zammın indirim kılıfıyla senden saklanmasına bindirim denir.
                        </p>
                    </div>

                    <FakeDiscountSchema/>
                </div>

                <div className="flex flex-col gap-6 lg:order-first lg:justify-between">
                    <figure className="flex flex-col gap-3">
                        <div className="overflow-hidden rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)]">
                            <Image
                                src="/landing/detail-chart.webp"
                                alt="HP Victus fiyat geçmişi: 14 Ekim'de 45.466 TL, 29 Ekim 13:00'te 55.999 TL zirve, ardından 50.000 TL'ye düşüş."
                                width={1536}
                                height={1168}
                                sizes="(min-width: 1024px) 600px, 100vw"
                                className="h-auto w-full"
                            />
                        </div>
                        <figcaption className="text-sm text-zinc-400">
                            Gerçek takip verisi · Ekran görüntüsü, 2 Kasım 2026
                        </figcaption>
                    </figure>

                    <p className="max-w-[60ch] text-base leading-relaxed text-zinc-400">
                        Karma ürünlerin fiyat geçmişini senin yerine analiz eder, bindirimleri otomatik tespit eder ve panelinde sahte indirim uyarısıyla gösterir.
                    </p>
                </div>
            </div>
        </section>
    );
}
