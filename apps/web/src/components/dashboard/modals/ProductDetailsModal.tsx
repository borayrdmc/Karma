import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatTime } from "@/lib";
import { TrackedProductItemType } from "@repo/types";
import { Copy, Check, ExternalLink, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { PriceChart } from "../PriceChart";

interface ProductDetailsModalProps {
    productData: TrackedProductItemType | null;
    onClose: () => void;
}

export function ProductDetailsModal({productData,onClose}:ProductDetailsModalProps){
    const [isCopied,setIsCopied]=useState(false);
    const isOpen = !!productData;

    const priceAndDateList=productData?.productPriceHistory.map((item)=>({price: Number(item.price),date: item.checkedAt,})) ?? [];

    const peakRecord=priceAndDateList.reduce((min, curr) => (curr.price > min.price ? curr : min), priceAndDateList[0]);
    const baseRecord=priceAndDateList.reduce((max, curr) => (curr.price < max.price ? curr : max),priceAndDateList[0]);
    const currentRecord=priceAndDateList.at(-1);

    const customName=productData?.trackedProduct.customName;
    const originalName=productData?.product.productName;
    const platform=productData?.product.productPlatform;
    const productCode=productData?.product.productCode;
    const productUrl=productData?.product.productUrl;

    function handleCopy(){
        if(productUrl){
            navigator.clipboard.writeText(productUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    }

    return(
        
        <Dialog open={isOpen} onOpenChange={(open)=>{if(!open){onClose();}}}>
            <DialogContent className="sm:max-w-3xl border-zinc-800/80 bg-[#16171a]/95 text-[#F4F4F4] shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] backdrop-blur-xl p-6 data-open:zoom-in-100">
                <DialogHeader>
                    <DialogTitle className="sr-only">Ürün Bilgileri</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 pr-8">
                        {customName ? (
                            <>
                                <h2 className="text-xl font-bold tracking-tight text-[#F4F4F4]">
                                    {customName}
                                </h2>
                                <p className="text-xs text-zinc-400 line-clamp-1" title={originalName ?? ""}>
                                    {originalName}
                                </p>
                            </>
                        ) : (
                            <h2 className="text-xl font-bold tracking-tight text-[#F4F4F4] line-clamp-2" title={originalName ?? ""}>
                                {originalName}
                            </h2>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300">
                            <span className="capitalize">{platform}</span>
                            {productCode && (
                                <>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-zinc-400 font-mono">{productCode}</span>
                                </>
                            )}
                        </span>

                        {productUrl && (
                            <a
                                href={productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-[#F4F4F4] transition-colors cursor-pointer"
                            >
                                <span>Siteye Git</span>
                                <ExternalLink className="size-3 text-zinc-400" />
                            </a>
                        )}

                        {productUrl && (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-[#F4F4F4] transition-colors cursor-pointer"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="size-3 text-emerald-400" />
                                        <span className="text-emerald-400">Kopyalandı!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-3 text-zinc-400" />
                                        <span>Linki Kopyala</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5">
                            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                <span>Güncel Fiyat</span>
                                <Clock className="size-3.5 text-zinc-400" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xl font-bold text-[#F4F4F4]">
                                    {currentRecord ? formatPrice(currentRecord.price) : "—"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {currentRecord ? formatTime(currentRecord.date) : "Veri Yok"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5">
                            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                <span>En Düşük (Dip)</span>
                                <TrendingDown className="size-3.5 text-emerald-400" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xl font-bold text-[#F4F4F4]">
                                    {baseRecord ? formatPrice(baseRecord.price) : "—"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {baseRecord ? formatTime(baseRecord.date) : "Veri Yok"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5">
                            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                <span>En Yüksek (Zirve)</span>
                                <TrendingUp className="size-3.5 text-rose-400" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xl font-bold text-[#F4F4F4]">
                                    {peakRecord ? formatPrice(peakRecord.price) : "—"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {peakRecord ? formatTime(peakRecord.date) : "Veri Yok"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 border-t border-zinc-800/80 pt-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Fiyat Değişim Grafiği
                        </p>
                        <PriceChart priceHistory={productData?.productPriceHistory ?? []} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
