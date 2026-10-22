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
            <DialogContent className="sm:max-w-md border-zinc-800/80 bg-[#16171a]/95 text-[#F4F4F4] shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] backdrop-blur-xl">

                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-[#F4F4F4]">
                        Ürün Ekleme Paneli
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-3">

                        <div className="flex flex-col gap-1">

                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="productUrl" className="text-xs font-medium text-zinc-300 ml-1">Ürün Linki <span className="text-rose-400 font-bold">*</span></label>
                                {errorMessage && <p className="text-xs font-medium text-rose-400 ml-1">{errorMessage}</p>}
                            </div>

                            <input
                                type="url"
                                name="productUrl"
                                required
                                placeholder="hepsiburada.com/... veya trendyol.com/..."
                                title="Ürün linki giriniz"
                                disabled={isLoading}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-[#F4F4F4] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 transition-all duration-150"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-300 ml-1">Ürün Özel İsmi</label>
                            <input
                                type="text"
                                name="customName"
                                placeholder="Örnek: Babama alacağım ceket"
                                title="Özel isim giriniz"
                                disabled={isLoading}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-[#F4F4F4] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 transition-all duration-150"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-zinc-500 italic ml-1">
                                <span className="text-rose-400 font-bold not-italic mr-0.5">*</span> ile işaretli alanların doldurulması zorunludur.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all duration-200 cursor-pointer active:scale-[0.99]"
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