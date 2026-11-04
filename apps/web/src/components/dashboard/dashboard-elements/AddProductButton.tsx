import { Plus } from "lucide-react";

interface AddProductButtonProps{
    onClick:()=>void;
}

export function AddProductButton({onClick}:AddProductButtonProps){
    
    return(
        <button
            type="button"
            onClick={onClick}
            aria-label="Yeni ürün ekle"
            title="Yeni ürün ekle"
            className="fixed bottom-5 right-5 z-40 h-12 w-12 inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_25px_-3px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_-3px_rgba(16,185,129,0.5)] transition-all duration-200 cursor-pointer"
        >
            <Plus className="size-7" />
        </button>
    );
}