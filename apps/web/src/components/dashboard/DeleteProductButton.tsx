import { Trash } from 'lucide-react';

interface DeleteButtonProps{

    productId:string;
    deleteProduct:(productId:string)=>void
}

export function DeleteProductButton({productId,deleteProduct}:DeleteButtonProps){

    return(
        <button
            type="button"
            aria-label="Ürünü takipten çıkar"
            title="Ürünü takipten çıkar"
            onClick={()=>deleteProduct(productId)}
            className="inline-flex items-center shrink-0 justify-center rounded-md h-8 w-8 text-white bg-red-500 cursor-pointer"
        >
            <Trash className='size-4'/>
        </button>
    )
}