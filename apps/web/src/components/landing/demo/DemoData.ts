import { PriceHistoryOutputType } from "@repo/types";
import { getPriceHistoryOfProduct, getProductInfoOfTrackedProducts } from "@repo/db";
import demoProductJson from "@/content/demo-product.json";

export interface DemoProduct{
    isPlaceholder:boolean;
    snapshotAt:string;
    inStock:boolean;
    product:{name:string;brand:string;platform:"trendyol"|"hepsiburada";imageUrl:string|null};
    priceHistory:PriceHistoryOutputType[];
}

// Demo ürünü seçilmemişse ya da okunamazsa gösterilen örnek veri; kartta "Yer tutucu veri" bandıyla işaretlenir.
const placeholderDemoProduct:DemoProduct={
    ...demoProductJson,
    product:{...demoProductJson.product,platform:demoProductJson.product.platform as DemoProduct["product"]["platform"],imageUrl:null},
    priceHistory:demoProductJson.priceHistory.map((record)=>({...record,productId:"demo"})),
};

// DEMO_SNAPSHOT_AT verilmişse (ISO tarih, örn. 2026-11-03T13:05:00Z) demo o ana sabitlenir: yalnızca o ana kadarki
// kayıtlar gösterilir ve karar o tarihe göre verilir. Böylece seçilen hikâye, yeni fiyatlar geldikçe ya da günler
// geçtikçe değişmez. Kart bilgi satırında tarih "… itibarıyla" diye yazdığı için sabitleme görünür kalır.
function getSnapshotDate(){
    const value=process.env.DEMO_SNAPSHOT_AT;
    if(!value){
        return null;
    }
    const date=new Date(value);
    if(Number.isNaN(date.getTime())){
        console.error("DEMO_SNAPSHOT_AT geçerli bir tarih değil, demo canlı veriyle gösteriliyor.");
        return null;
    }
    return date;
}

// Demo ürünü veritabanından okunur. Sayfa günde bir yeniden üretildiği için (page.tsx `revalidate`)
// ziyaretçiler veritabanına doğrudan istek atmaz.
// Ortam değişkenleri: DEMO_PRODUCT_ID (zorunlu), DEMO_PRODUCT_NAME ve DEMO_PRODUCT_BRAND (kısa görünen ad, isteğe bağlı),
// DEMO_SNAPSHOT_AT (isteğe bağlı sabitleme anı).
export async function getDemoProduct():Promise<DemoProduct>{

    const productId=process.env.DEMO_PRODUCT_ID;

    if(!productId){
        return placeholderDemoProduct;
    }

    try{
        const snapshot=getSnapshotDate();
        const [product]=await getProductInfoOfTrackedProducts([{productId,trackedAt:new Date()}]);
        const fullHistory=await getPriceHistoryOfProduct(productId);
        const priceHistory=snapshot ? fullHistory.filter((record)=>new Date(record.checkedAt)<=snapshot) : fullHistory;

        if(!product || priceHistory.length<2){
            return placeholderDemoProduct;
        }

        return{
            isPlaceholder:false,
            snapshotAt:(snapshot ?? new Date()).toISOString(),
            inStock:product.inStock,
            product:{
                name:process.env.DEMO_PRODUCT_NAME ?? product.productName ?? "Ürün",
                brand:process.env.DEMO_PRODUCT_BRAND ?? "",
                platform:product.productPlatform,
                imageUrl:product.productImageUrl,
            },
            priceHistory:priceHistory.map((record)=>({
                productId:record.productId,
                price:record.price,
                checkedAt:new Date(record.checkedAt).toISOString(),
            })),
        };
    }
    catch(error){
        console.error("Demo ürünü okunamadı, örnek veri gösteriliyor.",error);
        return placeholderDemoProduct;
    }
}
