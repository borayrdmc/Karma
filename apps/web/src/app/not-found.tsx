import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound(){
    
    return(

        <div className="min-h-screen bg-[#0c0d0e] text-[#F4F4F4] flex flex-col gap-5 items-center justify-center text-center">
            
            <div className="relative -mb-2">

                <div className="absolute size-48 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
                <img
                    src="/not-found.webp"
                    alt="404 Mascot"
                    className="relative w-auto h-40 z-10 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
            </div>

            <div className="flex flex-col gap-2">
                
                <h1 className="text-2xl font-bold tracking-tight">
                    Aradığın Sayfayı Bulamadık
                </h1>

                <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
                    Aradığın sayfa buralarda bir yerde yok gibi görünüyor. Sayfa taşınmış yada yazım yanlışı yapmış olabilirsin
                </p>
            </div>
            
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-5 py-2.5 text-sm transition-all duration-200 cursor-pointer"
            >
                <ArrowLeft className="size-4 stroke-3" />
                <span>Dashboard'a Dön</span>
            </Link>
        </div>
    );
}
