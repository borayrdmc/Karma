import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { TrackedProductItemType } from "@repo/types";

interface addProductModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onProductAdd:(newProduct:TrackedProductItemType)=>void;
}


export function AddProductModal({isOpen,onClose,onProductAdd}:addProductModalProps){

    function handleCloseModal(){
        setErrorMessage(null);
        onClose();
    }

    const [isLoading,setIsLoading]=useState(false);
    const [errorMessage,setErrorMessage]=useState<string|null>(null);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){
    
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null)

        try{
            const formData=new FormData(e.currentTarget);
            const productUrl=formData.get("productUrl") as string;

            const response=await fetch("/api/products",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({productUrl})
            })

            const result=await response.json();
            
            if(!response.ok){

                if(typeof result.error==="string"){
                    setErrorMessage(result.error);
                    return;
                }

                else if(result.error.fieldErrors.productUrl[0]){
                    setErrorMessage(result.error.fieldErrors.productUrl[0]);
                    return;
                }
                else{
                    setErrorMessage("Ürün eklenirken sorun oluştu. Lütfen tekrar deneyiniz.");
                    return;
                }
            }
            onProductAdd(result.data);
            onClose();
        }
        catch(error){
            setErrorMessage("Something went wrong.");
        }
        finally{
            setIsLoading(false);
        } 
    }

    return(
        
        <Dialog open={isOpen} onOpenChange={(open)=>{ if(!isLoading && !open){handleCloseModal();} }}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        Ürün Ekleme Paneli
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-3">

                        <div className="flex flex-col gap-1">

                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="productUrl" className="ml-1">Ürün Linki <span className="text-red-500">*</span></label>
                                {errorMessage && <p className="text-xs font-medium text-red-600 ml-1">{errorMessage}</p>}
                            </div>

                            <input
                                type="url"
                                name="productUrl"
                                required
                                placeholder="hepsiburada.com/... veya trendyol.com/..."
                                title="Ürün linki giriniz"
                                disabled={isLoading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="ml-1">Ürün Özel İsmi</label>
                            <input
                                type="text"
                                name="customName"
                                placeholder="Örnek: Babama alacağım ceket"
                                title="Özel isim giriniz"
                                disabled={isLoading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-gray-400 italic ml-1">
                                <span className="text-red-500 font-bold not-italic mr-0.5">*</span> ile işaretli alanların doldurulması zorunludur.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? "Ürün Ekleniyor..." : "Ürün Ekle"}
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}