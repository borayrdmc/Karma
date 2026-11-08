import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/sections/header/LandingHeader";
import { LandingFooter, CONTACT_EMAIL } from "@/components/landing/sections/LandingFooter";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata:Metadata={
    title:"Gizlilik Politikası ve Aydınlatma Metni",
    description:"Karma gizlilik politikası ve 6698 sayılı KVKK kapsamında kişisel verilerin korunması ve işlenmesi hakkında aydınlatma metni.",
};

export default function PrivacyPage(){
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
                            Gizlilik Politikası ve KVKK Aydınlatma Metni
                        </h1>
                        <p className="mt-2 text-xs text-zinc-400">
                            Son Güncelleme: Kasım 2026
                        </p>
                    </div>

                    <div className="space-y-8 text-sm sm:text-base leading-relaxed text-zinc-300 [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#F4F4F4] [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-pretty [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-zinc-400">
                        <p>
                            Karma olarak kişisel verilerinizin güvenliğine ve gizliliğine önem veriyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, veri sorumlusu sıfatıyla Karma&apos;yı ziyaret eden ve kullanan kullanıcılarımızı bilgilendirmek amacıyla hazırlanmıştır.
                        </p>

                        <section>
                            <h2>1. Veri Sorumlusu</h2>
                            <p>
                                Kişisel verileriniz, Karma projesinin bağımsız geliştiricisi Bora Yardımcı tarafından veri sorumlusu sıfatıyla işlenmektedir. İletişim: <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 hover:underline">{CONTACT_EMAIL}</a>.
                            </p>
                        </section>

                        <section>
                            <h2>2. İşlenen Kişisel Veriler</h2>
                            <p className="mb-2">Karma, yalnızca hizmetin çalışabilmesi için zorunlu olan asgari verileri işler:</p>
                            <ul>
                                <li><strong className="text-zinc-200">Kimlik ve İletişim Bilgileri:</strong> Kayıt olurken sağladığınız ad, soyad ve e-posta adresi.</li>
                                <li><strong className="text-zinc-200">Hesap Güvenliği Verileri:</strong> Şifreniz (tek yönlü kriptografik hash olarak saklanır, Karma dahil hiç kimse tarafından açık metin olarak görülemez).</li>
                                <li><strong className="text-zinc-200">Kullanım Verileri:</strong> Takip listenize eklediğiniz ürün URL&apos;leri ve ürünlere atadığınız isteğe bağlı özel isimler.</li>
                                <li><strong className="text-zinc-200">Teknik ve Güvenlik Günlükleri:</strong> Hesap güvenliği ve oturum doğrulaması amacıyla tutulan IP adresi ve tarayıcı (User-Agent) bilgisi.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
                            <p className="mb-2">Toplanan verileriniz şu amaçlarla sınırlı olarak işlenmektedir:</p>
                            <ul>
                                <li>Kullanıcı hesabınızın oluşturulması ve oturum açma süreçlerinin yönetilmesi.</li>
                                <li>Takip ettiğiniz ürünlerin fiyat geçmişinin kaydedilmesi ve panelinizde görüntülenmesi.</li>
                                <li>Şifre sıfırlama gibi hesap kurtarma işlemlerinin yürütülmesi.</li>
                                <li>Sistemin güvenliğinin sağlanması, yetkisiz erişimlerin ve bot/spam saldırılarının önlenmesi.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Çerezler (Cookies) Politikası</h2>
                            <p>
                                Karma&apos;da reklam, hedefleme veya üçüncü taraf izleme çerezleri <strong className="text-zinc-200">kullanılmaz</strong>. Yalnızca oturumunuzun açık kalmasını sağlayan teknik ve zorunlu oturum çerezleri (Better Auth session çerezi) kullanılır. Bu çerezler tarayıcınızı kapattığınızda veya çıkış yaptığınızda geçersiz hale gelir.
                            </p>
                        </section>

                        <section>
                            <h2>5. Verilerin Üçüncü Taraflarla Paylaşımı</h2>
                            <p>
                                Kişisel verileriniz hiçbir koşulda ticari amaçla satılmaz, kiralanmaz veya reklam ağlarıyla paylaşılmaz. Veriler, yalnızca hizmetin teknik altyapısını sağlayan güvenli veritabanı sunucularında barındırılır ve şifre sıfırlama gibi e-posta bildirimleri için kullanılan teknik e-posta altyapı sağlayıcısı haricinde üçüncü taraflara aktarılmaz.
                            </p>
                        </section>

                        <section>
                            <h2>6. KVKK Kapsamındaki Haklarınız</h2>
                            <p className="mb-2">KVKK&apos;nın 11. maddesi uyarınca kullanıcılarımız şu haklara sahiptir:</p>
                            <ul>
                                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                                <li>Verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                                <li>Verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                                <li>Eksik veya yanlış işlenmişse bunların düzeltilmesini isteme,</li>
                                <li>Hesabınızın ve kişisel verilerinizin silinmesini talep etme.</li>
                            </ul>
                            <p className="mt-3">
                                Bu haklarınıza ilişkin taleplerinizi <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 hover:underline">{CONTACT_EMAIL}</a> adresine e-posta göndererek iletebilirsiniz. Hesabınız silindiğinde, takip ettiğiniz ürün listesi ve tüm hesap kayıtlarınız veritabanından kalıcı olarak silinir.
                            </p>
                        </section>
                    </div>
                </article>
            </main>

            <LandingFooter/>
        </div>
    );
}
