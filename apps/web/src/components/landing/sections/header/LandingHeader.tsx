import Link from "next/link";
import { KarmaLogo } from "@/components/ui/KarmaLogo";
import { HeaderAuthLink } from "./HeaderAuthLink";

// Marka bloğu dashboard başlığıyla birebir aynı tutulur.
export function LandingHeader(){

    return(
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0c0d0e]/60 backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70">
                    <div className="flex size-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]">
                        <KarmaLogo className="size-4"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-[#F4F4F4]">
                            Karma
                        </span>
                        <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-zinc-400">
                            Beta
                        </span>
                    </div>
                </Link>

                <HeaderAuthLink/>
            </div>
        </header>
    );
}
