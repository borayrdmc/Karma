import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatTime } from "@/lib";
import { TrackedProductItemType } from "@repo/types"
import { Copy } from 'lucide-react';
import { PriceChart } from "../PriceChart";

interface ProductDetailsModalProps{
    productData:TrackedProductItemType|null;
    onClose:()=>void;
}

export function ProductDetailsModal({productData,onClose}:ProductDetailsModalProps){

    const isOpen=!!productData; 

    const priceAndDateList=productData?.productPriceHistory.map(item=>({price:Number(item.price),date:item.checkedAt})) ?? [];

    const peakRecord = priceAndDateList.reduce((min, curr) => curr.price > min.price ? curr : min, priceAndDateList[0]);
    const baseRecord = priceAndDateList.reduce((max, curr) => curr.price < max.price ? curr : max, priceAndDateList[0]);    
    const currentRecord = priceAndDateList.at(-1);

    return(
        <Dialog open={isOpen} onOpenChange={(open)=>{if(!open){onClose()}}}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        Ürün Bilgileri
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">

                    <div className="flex flex-col gap-1">
                        <p>Ürün İsmi: {productData?.product.productName}</p>
                        <p>Özel İsim: {productData?.trackedProduct.customName || "-" }</p>

                    </div>

                    <div className="flex flex-col gap-1">
                        <p>
                            Ürün Linki: {productData?.product.productUrl}
                            <Copy className="size-4 inline cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={()=>{
                                    if(productData?.product.productUrl){
                                        navigator.clipboard.writeText(productData.product.productUrl);
                                        //Add react toast message maybe?
                                    }
                                }}/>
                        </p>
                        <p>Ürün Platformu: {productData?.product.productPlatform}</p>
                        <p>Ürün Platform Kodu: {productData?.product.productCode}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        {currentRecord ? (
                            <p>Güncel Fiyat: {formatPrice(currentRecord.price)} - {formatTime(currentRecord.date)}</p>) : (
                            <p>Güncel Fiyat: Fiyat Verisine Ulaşılamadı</p>    
                        )}
                        {peakRecord ? (
                            <p>En Yüksek Fiyat: {formatPrice(peakRecord.price)} - {formatTime(peakRecord.date)}</p>) : (
                            <p>En Yüksek Fiyat: Yeterli Veri Yok</p>
                        )}
                        {baseRecord ? (
                            <p>En Düşük Fiyat: {formatPrice(baseRecord.price)} - {formatTime(baseRecord.date)}</p>) : (
                            <p>En Düşük Fiyat: Yeterli Veri Yok</p>
                        )}
                    </div>
                    
                    {/* Grafik Alanı */}
                    <div className="mt-4 border-t border-gray-100 pt-3">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Fiyat Değişim Grafiği</p>
                        <PriceChart priceHistory={productData?.productPriceHistory ?? []} />
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}