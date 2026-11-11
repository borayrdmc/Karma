import Image from "next/image";

// Hero görseli sade bir panel ekran görüntüsüdür. Sahte indirimin nasıl tespit edildiğini hemen altındaki demo anlatır;
// görsel üstüne yerleştirilen ek pencere hem hizalanması hem mobilde yönetilmesi zor olduğu için kaldırıldı.
// Hareketsizdir: ilk ekranda içerik beklemeden görünür.
export function HeroVisual(){

    return(
        <Image
            src="/landing/dashboard-hero-new.webp"
            alt="Karma paneli: altı ürünün güncel fiyatları ile indirim ve zam rozetleri."
            width={2880}
            height={1304}
            priority
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="h-auto w-full rounded-xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)] ring-1 ring-zinc-800/80"
        />
    );
}
