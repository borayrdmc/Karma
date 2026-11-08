import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/sections/header/LandingHeader";
import { LandingFooter, CONTACT_EMAIL } from "@/components/landing/sections/LandingFooter";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata:Metadata={
    title:"Kullanım Koşulları",
    description:"Karma fiyat takip platformu kullanım koşulları, sorumluluk sınırları ve adil kullanım esasları.",
};

export default function TermsPage(){
    return(
        <div className="flex min-h-screen flex-col bg-[#0c0d0e] text-[#F4F4F4]">
            <LandingHeader/>

            <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
                <article className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 rounded"
                        >
                            <ArrowLeft className="size-3.5" aria-hidden="true"/>
                            Ana Sayfaya Dön
                        </Link>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#F4F4F4] text-balance">
                            Kullanım Koşulları
                        </h1>
                        <p className="mt-2 text-xs text-zinc-400">
                            Son Güncelleme: Kasım 2026
                        </p>
                    </div>

                    <div className="space-y-8 text-sm sm:text-base leading-relaxed text-zinc-300 [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#F4F4F4] [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-pretty [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-zinc-400">
                        <p>
                            Karma&apos;yı kullanarak veya bir hesap oluşturarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Lütfen hizmeti kullanmaya başlamadan önce bu şartları dikkatle okuyunuz.
                        </p>

                        <section>
                            <h2>1. Hizmetin Niteliği ve Beta Süreci</h2>
                            <p>
                                Karma; kullanıcıların Hepsiburada ve Trendyol üzerindeki ürünlerin fiyat geçmişini takip etmelerini ve indirim dinamiklerini analiz etmelerini sağlayan bağımsız bir web servisidir. Servis şu anda <strong className="text-zinc-200">Beta</strong> aşamasındadır; yeni özellikler eklenebilir, mevcut özellikler geliştirilebilir veya teknik gereklilikler doğrultusunda geçici bakım kesintileri yaşanabilir.
                            </p>
                        </section>

                        <section>
                            <h2>2. Fiyat Bilgileri ve Sorumluluk Sınırı</h2>
                            <p className="mb-2">
                                Karma tarafından sunulan fiyat geçmişi grafikleri, indirim analizleri (gerçek/sahte indirim tespitleri) ve bildirimler yalnızca <strong className="text-zinc-200">bilgilendirme amaçlıdır</strong>:
                            </p>
                            <ul>
                                <li>Sunulan hiçbir veri finansal, ticari veya nihai bir satın alma tavsiyesi niteliği taşımaz.</li>
                                <li>E-ticaret platformlarındaki fiyatlar, kuponlar, sepette uygulanan indirimler ve stok durumları anlık olarak değişebilir. Satın alma anındaki nihai fiyat ve koşullar daima ilgili e-ticaret sitesinin kendi sayfasında geçerlidir.</li>
                                <li>Karma, e-ticaret sitelerinin teknik aksaklıkları veya üçüncü taraf platform kaynaklı veri gecikmelerinden kaynaklanabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamaz.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. Bağımsızlık ve Marka Hakları</h2>
                            <p>
                                Karma; Trendyol, Hepsiburada veya platformda takip edilen diğer şirketlerin resmi bir iştiraki, ortağı, bayisi ya da temsilcisi <strong className="text-zinc-200">değildir</strong>. Sitede yer alan tüm marka, logo ve ticari unvanlar ilgili hak sahiplerinin mülkiyetindedir ve yalnızca tüketicinin ürünü tanıması amacıyla referans olarak kullanılmaktadır.
                            </p>
                        </section>

                        <section>
                            <h2>4. Adil Kullanım ve Hesap Güvenliği</h2>
                            <p className="mb-2">Karma&apos;nın sağlıklı çalışabilmesi ve tüm kullanıcılara eşit hizmet sunulabilmesi için aşağıdaki kurallar geçerlidir:</p>
                            <ul>
                                <li>Sistem kaynaklarını korumak adına kullanıcı başına takip edilebilir ürün sayısı <strong className="text-zinc-200">maksimum 24 ürün</strong> ile sınırlandırılmıştır.</li>
                                <li>Karma altyapısına yönelik otomatik bot istekleri, tersine mühendislik girişimleri, DoS/DDoS saldırıları veya servisin işleyişini bozmaya yönelik kötüye kullanımlar yasaktır.</li>
                                <li>Kullanıcılar, hesap parolalarının gizliliğini korumaktan bizzat sorumludur.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Hizmetin Değiştirilmesi ve Sonlandırılması</h2>
                            <p>
                                Karma, adil kullanım kurallarını ihlal eden veya sisteme zarar veren hesapları önceden bildirimde bulunmaksızın askıya alma veya sonlandırma hakkını saklı tutar. Kullanıcılar da diledikleri zaman hesaplarını ve takip listelerini silerek hizmet kullanımına son verebilirler.
                            </p>
                        </section>

                        <section>
                            <h2>6. İletişim</h2>
                            <p>
                                Kullanım koşullarıyla ilgili her türlü soru, geri bildirim veya öneriniz için <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 hover:underline">{CONTACT_EMAIL}</a> adresinden doğrudan iletişime geçebilirsiniz.
                            </p>
                        </section>
                    </div>
                </article>
            </main>

            <LandingFooter/>
        </div>
    );
}
