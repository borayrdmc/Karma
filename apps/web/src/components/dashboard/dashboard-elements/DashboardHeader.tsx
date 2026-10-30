"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingDown, TrendingUp, LogOut, AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/AuthClient";
import { cn } from "cn";

export interface DashboardHeaderProps{
    userName:string;
    totalCount:number;
    hepsiburadaCount:number;
    trendyolCount:number;
    discountCount:number;
    increaseCount:number;
    fakeDiscountCount:number;
    selectedFilter:"all"|"hepsiburada"|"trendyol";
    onSelectFilter:(filter:"all"|"hepsiburada"|"trendyol")=>void;
}

export function DashboardHeader({userName,totalCount,hepsiburadaCount,trendyolCount,discountCount,increaseCount,fakeDiscountCount,selectedFilter,onSelectFilter,}:DashboardHeaderProps){

    const router=useRouter();
    const [isLoggingOut,setIsLoggingOut]=useState(false);

    async function handleSignOut(){

        setIsLoggingOut(true);

        try{
            await authClient.signOut();
            router.push("/signin");
            router.refresh();
        }
        catch(error){
            //Sıgnin auth client error
        }
        finally{
            setIsLoggingOut(false);
        }
    }

    return (
        <header className="w-full flex flex-col border-b border-zinc-800/80 bg-[#0c0d0e]/60 backdrop-blur-xl">
            {/* 1. Satır: Kompakt Üst Bar (Navbar) */}
            <div className="flex h-14 w-full items-center justify-between px-6 border-b border-zinc-800/50">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]">
                        <TrendingDown className="size-3.5" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-[#F4F4F4]">
                            Fiyat Takip
                        </span>
                        <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-400">
                            Beta
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-800 text-xs font-semibold text-zinc-200">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="hidden text-xs font-medium text-zinc-300 sm:inline">
                            {userName}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-zinc-800" />

                    <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        title="Oturumu Kapat"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-800 hover:bg-zinc-900 hover:text-rose-400 cursor-pointer disabled:opacity-50"
                    >
                        <LogOut className="size-3.5" />
                        <span className="hidden sm:inline">
                            {isLoggingOut ? "Çıkılıyor..." : "Çıkış"}
                        </span>
                    </button>
                </div>
            </div>

            {/* 2. Satır: Filtre Hapları & Durum Çipleri (Aynı Hizada) */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5">
                {/* Sol: Filtre Hapları */}
                <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-1">
                    <button
                        type="button"
                        onClick={() => onSelectFilter("all")}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                            selectedFilter === "all"
                                ? "bg-zinc-800 text-[#F4F4F4] shadow-sm border border-zinc-700/60"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent"
                        )}
                    >
                        <span>Tümü</span>
                        <span className={cn(
                            "rounded px-1 text-[10px]",
                            selectedFilter === "all" ? "bg-zinc-700/80 text-zinc-200" : "text-zinc-500"
                        )}>
                            {totalCount}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onSelectFilter("hepsiburada")}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                            selectedFilter === "hepsiburada"
                                ? "bg-zinc-800 text-[#F4F4F4] shadow-sm border border-zinc-700/60"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent"
                        )}
                    >
                        <span>Hepsiburada</span>
                        <span className={cn(
                            "rounded px-1 text-[10px]",
                            selectedFilter === "hepsiburada" ? "bg-zinc-700/80 text-zinc-200" : "text-zinc-500"
                        )}>
                            {hepsiburadaCount}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onSelectFilter("trendyol")}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                            selectedFilter === "trendyol"
                                ? "bg-zinc-800 text-[#F4F4F4] shadow-sm border border-zinc-700/60"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent"
                        )}
                    >
                        <span>Trendyol</span>
                        <span className={cn(
                            "rounded px-1 text-[10px]",
                            selectedFilter === "trendyol" ? "bg-zinc-700/80 text-zinc-200" : "text-zinc-500"
                        )}>
                            {trendyolCount}
                        </span>
                    </button>
                </div>

                {/* Sağ: Fiyat Zekası Özet Rozetleri */}
                <div className="flex items-center gap-2">
                    {discountCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                            <TrendingDown className="size-3" />
                            <span>{discountCount} İndirim</span>
                        </span>
                    )}

                    {increaseCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-400">
                            <TrendingUp className="size-3" />
                            <span>{increaseCount} Zam</span>
                        </span>
                    )}

                    {fakeDiscountCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                            <AlertTriangle className="size-3" />
                            <span>{fakeDiscountCount} Şüpheli</span>
                        </span>
                    )}

                    <span className="text-xs text-zinc-500 font-medium">
                        Toplam {totalCount} Takip
                    </span>
                </div>
            </div>
        </header>
    );
}
