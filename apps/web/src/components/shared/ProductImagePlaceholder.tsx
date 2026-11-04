// Ürün görseli yoksa ya da yüklenemezse kullanılan yer tutucu (landing demo kartı).
interface ProductImagePlaceholderProps{
    label?:string;
}

export function ProductImagePlaceholder({label="Görsel Yok"}:ProductImagePlaceholderProps){

    return(
        <>
            <svg
                className="size-8 stroke-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
            </svg>
            <span className="text-xs font-medium text-zinc-400">{label}</span>
        </>
    )
}
