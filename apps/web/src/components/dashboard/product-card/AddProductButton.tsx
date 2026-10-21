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
            className="fixed bottom-8 right-8 z-40 h-12 w-12 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
            <Plus className="size-7" />
        </button>
    );
}