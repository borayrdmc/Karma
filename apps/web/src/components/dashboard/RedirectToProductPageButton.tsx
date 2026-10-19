import { ShoppingCart } from 'lucide-react';

interface RedirectButtonProps{
    productUrl:string;
    productPlatform:string;
}

export function RedirectToProductPageButton({productUrl,productPlatform}:RedirectButtonProps){

    const productPlatformUppercase=productPlatform[0].toUpperCase() + productPlatform.slice(1);
    
    return(
        <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-orange-50 px-2.5 h-8 text-xs font-semibold text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors"
        >   
            Siteye Git <ShoppingCart className='size-3'/> - {productPlatformUppercase}
        </a>
    )



}