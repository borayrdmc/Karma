interface RedirectButtonProps{
    productUrl:string;
    productPlatform:string;
}

export function RedirectToProductPageButton({productUrl,productPlatform}:RedirectButtonProps){

    const productPlatformUppercase=productPlatform[0].toUpperCase() + productPlatform.slice(1);
    
    return(
        <a
            aria-label="Ürün sayfasına git"
            title="Ürün sayfasına git"
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-lg bg-[#f75d00] hover:bg-[#ff7214] px-1.5 h-8 text-xs font-semibold text-[#0c0d0e] transition-all cursor-pointer shadow-sm"
        >
            Siteye Git - {productPlatformUppercase}
        </a>
    )
}