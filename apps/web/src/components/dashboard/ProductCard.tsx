import { TrackedProductItemType } from "@repo/types";
import { DeleteProductButton } from "./DeleteProductButton";
import { RedirectToProductPageButton } from "./RedirectToProductPageButton";
import { formatPrice, formatTime, PriceInsight } from "@/lib";
import { PriceSection } from "./PriceSection";

interface ProductCardProps{

    productItem:TrackedProductItemType;
    setModal:(productItem:TrackedProductItemType)=>void;
    deleteProduct:(trackedProductId:string)=>void;
}
export function ProductCard({productItem,setModal,deleteProduct}:ProductCardProps){

    const {product,trackedProduct,productPriceHistory}=productItem
    const productName=(trackedProduct.customName) ? trackedProduct.customName : product.productName;

    const latestPriceRecord=productPriceHistory.at(-1);
    const formattedCurrentPrice=latestPriceRecord ? formatPrice(latestPriceRecord.price) : "Fiyat Hatası";
    const formattedLastChangeTime=latestPriceRecord ? formatTime(latestPriceRecord.checkedAt) : "Zaman Hatası";

    const definatelyPerfectAccurateInsight=PriceInsight(productPriceHistory);

    return( 

        <div className="w-full min-w-0 group flex flex-col gap-3">

            <div className="flex flex-col gap-3 cursor-pointer" onClick={()=>setModal(productItem)}>

                <div className="relative aspect-4/3 w-full rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-300 group-hover:bg-gray-100/70 transition-colors">
                    <svg
                        className="w-10 h-10 mb-1 stroke-1"
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
                    <span className="text-[11px] font-medium text-gray-400">Görsel Yakında</span>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-10 group-hover:text-black transition-colors">
                    {productName}
                </h3>
                
                <PriceSection priceInsightResult={definatelyPerfectAccurateInsight} formattedPrice={formattedCurrentPrice} formattedLastChangeTime={formattedLastChangeTime}/>

            </div>

            <div className="flex flex-row items-center justify-between gap-2 mt-auto">
                <RedirectToProductPageButton productUrl={productItem.product.productUrl} productPlatform={productItem.product.productPlatform}/>                
                <DeleteProductButton productId={productItem.product.productId} deleteProduct={()=>deleteProduct(productItem.product.productId)}/>
            </div>
        </div>
    )
}