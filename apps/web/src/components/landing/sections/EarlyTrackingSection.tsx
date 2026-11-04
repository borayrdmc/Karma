import { CalendarClock, History, Users, type LucideIcon } from "lucide-react";
import type { PriceStatus } from "@repo/types";
import { PriceStatusBadge } from "../demo/PriceStatusBadge";
import { EarlyTrackingSchema } from "./EarlyTrackingSchema";

// Üç eşit madde, "Nasıl çalışır" adımlarıyla aynı ikon dili; sıra bilgisi taşımadıkları için numara ve çizgi yok.
const POINTS:{icon:LucideIcon;title:string;text:string}[]=[
    {icon:CalendarClock,title:"İndirim günlerinden önce fiyatlar oynar",text:"Kara Cuma, Efsane Cuma ve 11.11 gibi büyük indirim günleri yaklaşırken bazı fiyatlar sessizce yükseltilir. Etiketteki indirim bu zamlı fiyat üzerinden hesaplanır."},
    {icon:History,title:"Karma'nın geçmişe ihtiyacı var",text:"Sahte indirimi yakalamak için Karma'nın zamdan önceki fiyatı görmüş olması gerekir. Takibe ne kadar erken başlarsan yorum o kadar isabetli olur."},
    {icon:Users,title:"Takip edilen ürün geçmişiyle gelir",text:"Ürünü başka bir kullanıcı zaten takip ediyorsa, birikmiş fiyat geçmişiyle birlikte listene eklenir. Karma bu kayıtları da kullanır; yorum için beklemen gerekmeyebilir."},
];

const OUTCOMES:{title:string;status:PriceStatus;text:string}[]=[
    {title:"Bugün eklersen",status:"fake_discount",text:"Karma zamdan önceki fiyatı da kaydeder. Kampanya günü etiketteki indirimi bu fiyatla karşılaştırır."},
    {title:"Kampanya günü eklersen",status:"insufficient_data",text:"Karma yalnızca indirim günündeki fiyatı görür. Karşılaştıracak geçmiş olmadığı için yorum yapamaz."},
];

// Karma'nın dürüst sınırı aynı zamanda erken kayıt gerekçesi: zammı ancak zamdan önceki fiyatı görmüşse yakalar.
// Şema, aynı fiyat hareketini iki farklı başlangıç anından gösterir; yeşil alan Karma'nın gördüğü geçmiştir.
// Masaüstünde görsel solda: önceki "Nasıl çalışır" bölümünde görsel sağda olduğu için zikzak sürer.
export function EarlyTrackingSection(){

    return(
        <section id="erken-takip" aria-labelledby="early-title" className="border-t border-zinc-800/60 bg-[#09090b]">
            <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">

                <div>
                    <h2 id="early-title" className="text-2xl font-bold tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-3xl">
                        Kampanyadan önce bir adım önde ol
                    </h2>
                    <ul className="mt-8 flex flex-col gap-6">
                        {POINTS.map(({icon:Icon,title,text})=>(
                            <li key={title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4">
                                <span className="flex size-10 items-center justify-center rounded-full border border-emerald-500/30 bg-[#09090b] text-emerald-400">
                                    <Icon className="size-4" aria-hidden="true"/>
                                </span>
                                <div className="pt-1.5">
                                    <h3 className="text-base font-semibold text-[#F4F4F4] sm:text-lg">{title}</h3>
                                    <p className="mt-1.5 max-w-[52ch] text-base leading-relaxed text-zinc-400">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-6 lg:order-first">
                    <EarlyTrackingSchema/>

                    <dl className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
                        {OUTCOMES.map(({title,status,text})=>(
                            <div key={title} className="flex flex-col gap-2 py-4">
                                <dt className="flex flex-wrap items-center justify-between gap-2 text-base font-semibold text-[#F4F4F4]">
                                    {title}
                                    <PriceStatusBadge status={status}/>
                                </dt>
                                <dd className="text-sm leading-relaxed text-zinc-400">{text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
