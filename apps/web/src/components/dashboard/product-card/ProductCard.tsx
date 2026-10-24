import { TrackedProductItemType } from "@repo/types";
import { DeleteProductButton } from "./DeleteProductButton";
import { RedirectToProductPageButton } from "./RedirectToProductPageButton";
import { formatPrice, formatTime, PriceInsight } from "@/lib";
import { PriceSection } from "./PriceSection";

interface ProductCardProps{

    productItem:TrackedProductItemType;
    setModal:(productItem:TrackedProductItemType)=>void;
    deleteProduct:()=>void;
}

export function ProductCard({productItem,setModal,deleteProduct}:ProductCardProps){

    const {product,trackedProduct,productPriceHistory}=productItem
    const productName=(trackedProduct.customName) ? trackedProduct.customName : product.productName;

    const latestPriceRecord=productPriceHistory.at(-1);
    const formattedCurrentPrice=latestPriceRecord ? formatPrice(latestPriceRecord.price) : "Fiyat Hatası";
    const formattedLastChangeTime=latestPriceRecord ? formatTime(latestPriceRecord.checkedAt) : "Zaman Hatası";

    const definatelyPerfectAccurateInsight=PriceInsight(productPriceHistory);

    return( 

        <div className="w-full min-w-0 group flex flex-col gap-2.5 rounded-2xl border border-zinc-800/80 bg-[#16171a] p-2.5 transition-all duration-200 hover:border-emerald-500/40 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.35)]">

            <div className="flex flex-col gap-2.5 cursor-pointer" onClick={()=>setModal(productItem)}>

                <div className="relative aspect-4/5 w-full rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center justify-center gap-1 text-zinc-600 group-hover:bg-zinc-900 transition-colors">
                    <svg
                        className="size-8 stroke-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                    <span className="text-xs font-medium text-zinc-500">Görsel Yakında</span>
                </div>
                
                <h3 className="text-sm font-semibold text-[#F4F4F4] line-clamp-2 min-h-10 transition-colors">
                    {productName}
                </h3>
                
                <PriceSection priceInsightResult={definatelyPerfectAccurateInsight} formattedPrice={formattedCurrentPrice} formattedLastChangeTime={formattedLastChangeTime} priceHistoryLength={productPriceHistory.length}/>

            </div>

            <div className="flex flex-row items-center justify-between gap-1.5 mt-auto">
                <RedirectToProductPageButton productUrl={productItem.product.productUrl} productPlatform={productItem.product.productPlatform}/>                
                <DeleteProductButton productId={productItem.product.productId} deleteProduct={deleteProduct}/>
            </div>
        </div>
    )
}