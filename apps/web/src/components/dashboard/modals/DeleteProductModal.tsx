import { TrackedProductItemType } from "@repo/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { useState } from "react";

interface DeleteProductModalProps{
    productToBeDeleted:TrackedProductItemType|null;
    onClose:()=>void;
    onDelete:(productId:string)=>void;
}

export function DeleteProductModal({productToBeDeleted,onClose,onDelete}:DeleteProductModalProps){

    const [isLoading,setIsLoading]=useState(false);
    const isOpen=!!productToBeDeleted;
    const productName=productToBeDeleted?.trackedProduct.customName || productToBeDeleted?.product.productName;
    
    async function handleDelete(){

        setIsLoading(true);

        try{
            const productId=productToBeDeleted?.product.productId;

            const response=await fetch(`/api/products`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({productId})
            })

            if(response.ok){

                if(productId){
                    onDelete(productId);
                    onClose();
                }
            }
            else{
                alert("Ürün silinirken hata oluştu.");
            }
        }
        catch(error){
            alert("Sunucu hatası.");
        }
        finally{
            setIsLoading(false);
        }
    }

    return(

        <Dialog open={isOpen} onOpenChange={(open)=> {if(!open && !isLoading){onClose()}}}>
            <DialogContent className="sm:max-w-md border-zinc-800/80 bg-[#16171a]/95 text-[#F4F4F4] shadow-[0_0_50px_-12px_rgba(244,63,94,0.12)] backdrop-blur-xl">
                <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-[#F4F4F4]">
                            Ürünü Takipten Çıkar
                        </DialogTitle>
                </DialogHeader>

                    <div className="flex flex-col gap-4 mt-2">
                    <p className="text-sm text-zinc-400">
                        <span className="font-semibold text-[#F4F4F4]">{productName}</span> isimli ürünü takipten çıkarmak istediğinize emin misiniz?
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-xl border border-zinc-700/80 bg-zinc-800 hover:bg-zinc-700/80 px-4 py-2.5 text-sm font-medium text-[#F4F4F4] shadow-sm disabled:opacity-50 transition-all duration-150 cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_-3px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_-3px_rgba(244,63,94,0.45)] disabled:opacity-50 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                        >
                            {isLoading ? "Siliniyor..." : "Evet, Sil"}
                        </button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}