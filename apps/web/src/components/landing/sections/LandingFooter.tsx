import { ExternalLink, Mail } from "lucide-react";

export const CONTACT_EMAIL="bborayrdmc@gmail.com";
export const GITHUB_URL="https://github.com/borayrdmc";

const linkClass="inline-flex min-h-11 items-center gap-1.5 rounded text-zinc-300 transition-colors hover:text-[#F4F4F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70";

export function LandingFooter(){

    return(
        <footer className="border-t border-zinc-800/60">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-col gap-1">
                    <p>© 2026 Karma · Bora Yardımcı</p>
                    <p>Karma, Trendyol veya Hepsiburada ile bağlantılı değildir.</p>
                </div>

                <nav aria-label="İletişim" className="flex flex-wrap items-center gap-x-6">
                    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                        <Mail className="size-4" aria-hidden="true"/>
                        Mail adresim
                    </a>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        GitHub sayfam
                        <ExternalLink className="size-3.5" aria-hidden="true"/>
                    </a>
                </nav>
            </div>
        </footer>
    );
}
