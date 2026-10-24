import { Trash } from 'lucide-react';

interface DeleteButtonProps{
    productId:string;
    deleteProduct:()=>void
}

export function DeleteProductButton({productId,deleteProduct}:DeleteButtonProps){

    return(
        <button
            type="button"
            aria-label="Ürünü takipten çıkar"
            title="Ürünü takipten çıkar"
            onClick={deleteProduct}
            className="inline-flex items-center shrink-0 justify-center rounded-lg h-8 w-8 bg-rose-600 hover:bg-rose-500 text-[#F4F4F4] transition-all cursor-pointer active:scale-[0.98] shadow-sm"
        >
            <Trash className='size-4'/>
        </button>
    )
}