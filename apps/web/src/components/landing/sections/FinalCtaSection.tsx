import Link from "next/link";
import { ArrowRight } from "lucide-react";

const focusRing="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#16171a]";

export function FinalCtaSection(){

    return(
        <section aria-labelledby="final-cta-title">
            <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6 sm:pb-28 sm:pt-6">
                <div className="flex flex-col gap-8 rounded-2xl border border-zinc-800/80 bg-[#16171a] bg-[radial-gradient(ellipse_60%_80%_at_0%_0%,rgba(16,185,129,0.12),transparent)] p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">

                    <h2 id="final-cta-title" className="max-w-xl text-2xl font-bold tracking-[-0.02em] text-balance text-[#F4F4F4] sm:text-3xl">
                        Bir sonraki kampanyada etikete değil, veriye bak.
                    </h2>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                        <Link
                            href="/signup"
                            className={`inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-zinc-950 transition-[color,background-color,transform] duration-150 ease-out hover:bg-emerald-400 active:scale-[0.97] motion-reduce:active:scale-100 sm:text-base ${focusRing}`}
                        >
                            Hesap oluştur
                            <ArrowRight className="size-4" aria-hidden="true"/>
                        </Link>
                        <p className="text-sm text-zinc-400">
                            Zaten hesabın var mı?{" "}
                            <Link href="/signin" className={`rounded font-medium text-emerald-400 underline-offset-4 hover:text-emerald-300 hover:underline ${focusRing}`}>
                                Giriş yap
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
