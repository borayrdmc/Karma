import { ServiceError } from "@repo/errors";

//Backup Plan
function extractHepsiburadaProductNameFromUrl(productUrl:string){

    const pathname=new URL(productUrl).pathname;

    const rawProductName=pathname
        .replace(/^\//, "")
        .replace(/-p[m]?-[A-Za-z0-9]+$/, "");

    if(!rawProductName){
        return "Hepsiburada Ürünü";
    }

    const productName=rawProductName.split("-").filter(Boolean).map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1)).join(" ");

    return productName;
}

export async function extractHepsiburadaCodeNameImage(productUrl:string): Promise<{productCode:string,productName:string,productImageUrl:string|null}>{

    const response=await fetch(productUrl,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            }
        })

    if(!response.ok){
        throw new ServiceError("Couldn't fetch Hepsiburada data",500);
    }

    const htmlData=await response.text();

    const productCodeMatch=htmlData.match(/<meta\s+name="page_value"\s+content="([^"]+)"/i);

    if(!productCodeMatch || !productCodeMatch[1]){
        throw new ServiceError("Couldn't get product code from page.",500);
    }
    const productCode=productCodeMatch[1];
    
    let productName;

    const utagDataMatch = htmlData.match(/const\s+utagData\s*=\s*(\{.+?\})\s*(?:;|\r?\n)/);

    if(!utagDataMatch || !utagDataMatch[1]){
        productName=extractHepsiburadaProductNameFromUrl(productUrl);
    }

    else{

        const utagData=JSON.parse(utagDataMatch[1]);

        productName=utagData.product_names?.[0] || utagData.product_name_array;

        if(typeof productName==="string" && productName.trim().length>0){
            productName=productName.trim();
        }
        else{
            productName=extractHepsiburadaProductNameFromUrl(productUrl);
        }
    }

    const preloadImageMatch=htmlData.match(/<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]+href=["']([^"']+)["']/i);
    const fallbackImageMatch=htmlData.match(/https:\/\/productimages\.hepsiburada\.net\/s\/[^"'\s>]+/i);
    const productImageUrl=preloadImageMatch?.[1] ?? fallbackImageMatch?.[0] ?? null;
    
    return {productCode,productName,productImageUrl}
}       