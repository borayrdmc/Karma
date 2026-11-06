import { ServiceError } from "@repo/errors";
import { ProductInputType } from "@repo/types";

const ALLOWED_PLATFORMS: Record<string, ProductInputType["productPlatform"]>={
    "trendyol.com": "trendyol",
    "www.trendyol.com": "trendyol",
    "hepsiburada.com": "hepsiburada",
    "www.hepsiburada.com": "hepsiburada",
}

export function extractPlatformFromUrl(productUrl:string): ProductInputType["productPlatform"]{

    let parsedUrl: URL;

    try{
        parsedUrl = new URL(productUrl);
    } 
    catch{
        throw new ServiceError("Geçerli bir ürün linki giriniz.", 400);
    }

    if(parsedUrl.protocol!=="https:" || parsedUrl.port !== ""){
        throw new ServiceError("Geçersiz protokol.", 400);
    }

    const platform=ALLOWED_PLATFORMS[parsedUrl.hostname.toLowerCase()];

    if(!platform){
        throw new ServiceError("Lütfen geçerli bir Hepsiburada veya Trendyol ürün linki giriniz.", 400);
    }

    return platform;
}