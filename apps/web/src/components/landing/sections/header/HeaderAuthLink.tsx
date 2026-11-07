"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/AuthClient";

const focusRing="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0d0e]";

// Sayfa statik kalsın diye oturum istemci tarafında okunur; yüklenirken misafir hali gösterilir.
export function HeaderAuthLink(){

    const {data:session}=authClient.useSession();

    if(session){
        return(
            <Link
                href="/dashboard"
                className={`inline-flex h-9 items-center rounded-xl bg-emerald-500 px-3.5 text-sm font-semibold text-zinc-950 transition-[color,background-color,transform] duration-150 ease-out hover:bg-emerald-400 active:scale-[0.97] motion-reduce:active:scale-100 ${focusRing}`}
            >
                Panele git
            </Link>
        );
    }

    return(
        <div className="flex items-center gap-1 sm:gap-2">
            <Link
                href="/signin"
                className={`inline-flex h-9 items-center rounded-xl px-2.5 text-sm font-medium text-zinc-300 transition-[color,background-color,transform] duration-150 ease-out hover:text-[#F4F4F4] active:scale-[0.97] motion-reduce:active:scale-100 ${focusRing}`}
            >
                Giriş yap
            </Link>
            <Link
                href="/signup"
                className={`inline-flex h-9 items-center rounded-xl bg-emerald-500 px-3.5 text-sm font-semibold text-zinc-950 transition-[color,background-color,transform] duration-150 ease-out hover:bg-emerald-400 active:scale-[0.97] motion-reduce:active:scale-100 ${focusRing}`}
            >
                Hesap oluştur
            </Link>
        </div>
    );
}
