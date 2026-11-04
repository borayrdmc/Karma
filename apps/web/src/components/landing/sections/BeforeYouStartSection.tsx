import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT_EMAIL } from "./LandingFooter";

const QUESTIONS=[
    {
        question:"Karma hangi platformlarda çalışır?",
        answer:"Şu an Trendyol ve Hepsiburada ürünlerini takip eder. İleride Amazon ve N11 gibi başka e-ticaret siteleri de eklenecek.",
    },
    {
        question:"Fiyat geçmişi nasıl oluşturulur?",
        answer:"Karma ürünü düzenli aralıklarla kontrol eder ve fiyat her değiştiğinde yeni bir kayıt açar. Bu kayıtlar fiyat geçmişini oluşturur; geçmiş en fazla son bir aya kadar uzanır.",
    },
    {
        question:"Yeni eklediğim üründe neden analiz yok?",
        answer:"Karar verebilmek için en az iki farklı fiyat kaydı gerekir. Ürünün fiyatı değiştikçe grafik oluşmaya başlar ve Karma fiyat analizini ekler.",
    },
    {
        question:"Ürün indirime girdiğinde bildirim alacak mıyım?",
        answer:"İndirim bildirimleri geliştirme aşamasında. Şimdilik fiyat değişimlerini panelindeki grafikten takip edebilirsin.",
    },
];

export function BeforeYouStartSection(){

    return(
        <section id="baslamadan-once" aria-labelledby="before-title" className="border-t border-zinc-800/60">
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">

                <div>
                    <h2 id="before-title" className="text-2xl font-bold tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-3xl">
                        Başlamadan önce
                    </h2>
                    <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-zinc-400">
                        Kayıt olmadan önce merak edebileceğin şeyler.
                    </p>
                    <p className="mt-6 text-sm text-zinc-400">
                        Aklına takılan başka bir soru mu var?{" "}
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="rounded font-medium text-emerald-400 underline-offset-4 hover:text-emerald-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                        >
                            E-posta gönder
                        </a>
                    </p>
                </div>

                <Accordion type="single" collapsible className="border-t border-zinc-800/80">
                    {QUESTIONS.map(({question,answer})=>(
                        <AccordionItem key={question} value={question}>
                            <AccordionTrigger>{question}</AccordionTrigger>
                            <AccordionContent className="max-w-[60ch]">{answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
