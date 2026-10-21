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
            <DialogContent>
                <DialogHeader>
                        <DialogTitle>
                            Ürünü Takipten çıkar
                        </DialogTitle>
                </DialogHeader>

                    <div className="flex flex-col gap-4 mt-2">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{productName}</span> isimli ürünü takipten çıkarmak istediğinize emin misiniz?
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300 cursor-pointer"
                        >
                            {isLoading ? "Siliniyor..." : "Evet, Sil"}
                        </button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}