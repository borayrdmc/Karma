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
        throw new ServiceError("Invalid product URL.", 400);
    }

    if(parsedUrl.protocol!=="https:" || parsedUrl.port !== ""){
        throw new ServiceError("Unsupported URL protocol or port.", 400);
    }

    const platform=ALLOWED_PLATFORMS[parsedUrl.hostname.toLowerCase()];

    if(!platform){
        throw new ServiceError("Unsupported product platform.", 400);
    }

    return platform;
}