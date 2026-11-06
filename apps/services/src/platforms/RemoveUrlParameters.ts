import { ServiceError } from "@repo/errors";
import { ProductInputType } from "@repo/types";
import { extractPlatformFromUrl } from "./ExtractPlatformFromUrl";

type ProductPlatform=ProductInputType["productPlatform"];

const PLATFORM_ORIGINS: Record<ProductPlatform,string>={
    hepsiburada: "https://www.hepsiburada.com",
    trendyol: "https://www.trendyol.com",
}

const PRODUCT_CODE_PATTERNS: Record<ProductPlatform,RegExp>={
    hepsiburada: /-pm?-[A-Za-z0-9]+(?=\/|$)/g,
    trendyol: /-p-\d+(?=\/|$)/g,
}

export function removeUrlParameters(productUrl:string):{productPlatform:ProductPlatform; cleanUrl:string}{

    const productPlatform=extractPlatformFromUrl(productUrl);
    const {pathname}=new URL(productUrl);

    const codeMatch=[...pathname.matchAll(PRODUCT_CODE_PATTERNS[productPlatform])].at(-1);

    if(!codeMatch){
        throw new ServiceError("Verilen linkte ürün kodu bulunamadı.",400);
    }

    const productPath=pathname
        .slice(0,codeMatch.index+codeMatch[0].length)
        .replace(/[^A-Za-z0-9\-_%.~/]/g,"-");

    return {productPlatform,cleanUrl:`${PLATFORM_ORIGINS[productPlatform]}${productPath}`};
}
