"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

interface DashboardErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({reset}:DashboardErrorProps) {
    const router=useRouter();
    const [isPending,startTransition]=useTransition();

    function handleRetry(){
        startTransition(()=>{
            router.refresh();
            reset();
        });
    }

    return(
        <div className="min-h-screen bg-[#0c0d0e] text-[#F4F4F4] flex flex-col items-center justify-center text-center gap-5">
            <div className="relative -mb-2">
                <div className="absolute size-48 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
                <img
                    src="/error-state.webp"
                    alt="Error Mascot"
                    className="relative w-auto h-40 z-10 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Bağlantıda Bir Sorun Oluştu
                </h1>

                <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
                    Sunucuyla bağlantı kurarken bir sorun oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsiniz.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={handleRetry}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-5 py-2.5 text-sm shadow-[0_0_25px_-3px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                    <RotateCcw className={`size-4 stroke-[2.5] ${isPending ? "animate-spin" : ""}`} />
                    <span>{isPending ? "Yenileniyor..." : "Tekrar Dene"}</span>
                </button>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium px-4 py-2.5 text-sm transition-all duration-150 cursor-pointer"
                >
                    <Home className="size-4 text-zinc-400" />
                    <span>Ana Sayfa</span>
                </Link>
            </div>
        </div>
    );
}
