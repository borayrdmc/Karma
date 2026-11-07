import { ImageOff } from "lucide-react";

// Ürün görseli yoksa ya da yüklenemezse kullanılan yer tutucu (landing demo kartı).
interface ProductImagePlaceholderProps{
    label?:string;
}

export function ProductImagePlaceholder({label="Görsel Yok"}:ProductImagePlaceholderProps){

    return(
        <>
            <ImageOff className="size-8 stroke-1" aria-hidden="true" />
            <span className="text-xs font-medium text-zinc-400">{label}</span>
        </>
    )
}
