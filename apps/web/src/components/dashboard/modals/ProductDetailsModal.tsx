import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatTime } from "@/lib";
import { TrackedProductItemType } from "@repo/types";
import { Copy, Check, X, ExternalLink, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { PriceChart } from "../product-card/PriceChart";

interface ProductDetailsModalProps {
    productData: TrackedProductItemType | null;
    onClose: () => void;
}

export function ProductDetailsModal({productData,onClose}:ProductDetailsModalProps){
    const [copyStatus,setCopyStatus]=useState<"idle"|"copied"|"failed">("idle");
    const isOpen = !!productData;

    const priceAndDateList=productData?.productPriceHistory.map((item)=>({price: Number(item.price),date: item.checkedAt,})) ?? [];

    const hasMultipleRecords=priceAndDateList.length>1;
    const peakRecord=hasMultipleRecords ? priceAndDateList.reduce((peak, curr) => (curr.price > peak.price ? curr : peak)) : null;
    const baseRecord=hasMultipleRecords ? priceAndDateList.reduce((base, curr) => (curr.price < base.price ? curr : base)) : null;
    
    const currentRecord=priceAndDateList.at(-1);

    const customName=productData?.trackedProduct.customName;
    const originalName=productData?.product.productName;
    const platform=productData?.product.productPlatform;
    const productCode=productData?.product.productCode;
    const productUrl=productData?.product.productUrl;
    const inStock=productData?.product.inStock ?? true;

    async function handleCopy(){
        if(!productUrl){
            return;
        }

        try{
            await navigator.clipboard.writeText(productUrl);
            setCopyStatus("copied");
        }
        catch{
            setCopyStatus("failed");
        }

        setTimeout(() => setCopyStatus("idle"), 2000);
    }

    return(
        
        <Dialog open={isOpen} onOpenChange={(open)=>{if(!open){onClose();}}}>
            <DialogContent className="sm:max-w-3xl border-zinc-800/80 bg-[#16171a]/95 text-[#F4F4F4] shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] backdrop-blur-xl p-4 sm:p-6 data-open:zoom-in-100">
                <div className="flex max-h-[calc(100dvh-4rem)] flex-col gap-5 overflow-y-auto sm:max-h-[calc(100dvh-5rem)]">
                    <div className="flex flex-col gap-1 pr-10">
                        {customName ? (
                            <>
                                <DialogTitle className="text-xl leading-7 font-bold tracking-tight text-[#F4F4F4]">
                                    {customName}
                                </DialogTitle>
                                <p className="text-xs text-zinc-400 line-clamp-1" title={originalName ?? ""}>
                                    {originalName}
                                </p>
                            </>
                        ) : (
                            <DialogTitle className="text-xl leading-7 font-bold tracking-tight text-[#F4F4F4] line-clamp-2" title={originalName ?? ""}>
                                {originalName}
                            </DialogTitle>
                        )}
                        <DialogDescription className="sr-only">
                            Ürünün güncel fiyatı, en düşük ve en yüksek fiyatı ve fiyat değişim grafiği.
                        </DialogDescription>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-zinc-300 sm:min-h-9 sm:rounded-lg sm:border sm:border-zinc-800 sm:bg-zinc-900/80 sm:px-3">
                            <span className="capitalize">{platform}</span>
                            {productCode && (
                                <>
                                    <span className="text-zinc-600">•</span>
                                    <span className="truncate text-zinc-400 font-mono">{productCode}</span>
                                </>
                            )}
                        </span>

                        <div className="flex gap-2 sm:contents">
                        {productUrl && (
                            <a
                                href={productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 min-h-11 px-3 text-xs font-medium sm:min-h-9 sm:flex-none text-zinc-300 hover:bg-zinc-800 hover:text-[#F4F4F4] transition-colors cursor-pointer"
                            >
                                <span>Siteye Git</span>
                                <ExternalLink className="size-3.5 text-zinc-400" />
                            </a>
                        )}

                        {productUrl && (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 min-h-11 px-3 text-xs font-medium sm:min-h-9 sm:flex-none text-zinc-300 hover:bg-zinc-800 hover:text-[#F4F4F4] transition-colors cursor-pointer"
                            >
                                {copyStatus==="copied" ? (
                                    <>
                                        <Check className="size-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Kopyalandı!</span>
                                    </>
                                ) : copyStatus==="failed" ? (
                                    <>
                                        <X className="size-3.5 text-rose-400" />
                                        <span className="text-rose-400">Kopyalanamadı</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-3.5 text-zinc-400" />
                                        <span>Linki Kopyala</span>
                                    </>
                                )}
                            </button>
                        )}
                        </div>

                        <span role="status" className="sr-only">
                            {copyStatus==="copied" ? "Ürün linki kopyalandı." : copyStatus==="failed" ? "Ürün linki kopyalanamadı." : ""}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">

                        <div className="col-span-2 sm:col-span-1 flex flex-col gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5">
                            <div className="flex items-center justify-between gap-1 text-xs font-medium text-zinc-400 tracking-normal sm:tracking-wider">
                                <span>GÜNCEL FİYAT</span>
                                <Clock className="size-3.5 text-zinc-400" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xl font-bold text-[#F4F4F4]">
                                    {!inStock ? "Stokta Yok" : (currentRecord ? formatPrice(currentRecord.price) : "—")}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {currentRecord ? formatTime(currentRecord.date) : "Veri Yok"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5">
                            <div className="flex items-center justify-between gap-1 text-xs font-medium text-zinc-400 tracking-normal sm:tracking-wider">
                                <span>EN DÜŞÜK<span className="hidden sm:inline"> (DİP)</span></span>
                                <TrendingDown className="size-3.5 text-emerald-400" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xl font-bold text-[#F4F4F4]">
                                    {baseRecord ? formatPrice(baseRecord.price) : "—"}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {baseRecord ? formatTime(baseRecord.date) : "Veri Yok"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5">
                            <div className="flex items-center justify-between gap-1 text-xs font-medium text-zinc-400 tracking-normal sm:tracking-wider">
                                <span>EN YÜKSEK<span className="hidden sm:inline"> (ZİRVE)</span></span>
                                <TrendingUp className="size-3.5 text-rose-400" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xl font-bold text-[#F4F4F4]">
                                    {peakRecord ? formatPrice(peakRecord.price) : "—"}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {peakRecord ? formatTime(peakRecord.date) : "Veri Yok"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 border-t border-zinc-800/80 pt-4">
                        <p className="text-xs font-semibold text-zinc-400 tracking-wider">
                            FİYAT DEĞİŞİM GRAFİĞİ
                        </p>
                        <PriceChart priceHistory={productData?.productPriceHistory ?? []} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
