import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { TrackedProductItemType } from "@repo/types";

interface addProductModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onProductAdd:(newProduct:TrackedProductItemType)=>void;
}

interface AddProductFieldErrors{
    productUrl?:string;
    customName?:string;
}

export function AddProductModal({isOpen,onClose,onProductAdd}:addProductModalProps){

    function handleCloseModal(){
        setFieldErrors({});
        onClose();
    }

    const [isLoading,setIsLoading]=useState(false);
    const [fieldErrors,setFieldErrors]=useState<AddProductFieldErrors>({});
    const pendingFocusId=useRef<string|null>(null);

    useEffect(()=>{
        if(!isLoading && pendingFocusId.current){
            document.getElementById(pendingFocusId.current)?.focus();
            pendingFocusId.current=null;
        }
    },[isLoading]);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){

        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});

        try{
            const formData=new FormData(e.currentTarget);
            const productUrl=formData.get("productUrl") as string;
            const customName=formData.get("customName") as string;

            const response=await fetch("/api/products",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({productUrl,customName})
            })

            const result=await response.json();

            if(!response.ok){

                if(typeof result.error==="string"){
                    setFieldErrors({productUrl:result.error});
                    pendingFocusId.current="productUrl";
                    return;
                }

                const productUrlError=result.error?.fieldErrors?.productUrl?.[0];
                const customNameError=result.error?.fieldErrors?.customName?.[0];

                if(productUrlError || customNameError){
                    setFieldErrors({productUrl:productUrlError,customName:customNameError});
                    pendingFocusId.current=productUrlError ? "productUrl" : "customName";
                    return;
                }

                setFieldErrors({productUrl:"Ürün eklenirken sorun oluştu. Lütfen tekrar deneyiniz."});
                return;
            }
            onProductAdd(result.data);
            onClose();
        }
        catch(error){
            setFieldErrors({productUrl:"Bağlantı kurulamadı. Lütfen tekrar deneyiniz."});
        }
        finally{
            setIsLoading(false);
        }
    }

    return(

        <Dialog open={isOpen} onOpenChange={(open)=>{ if(!isLoading && !open){handleCloseModal();} }}>
            <DialogContent closeDisabled={isLoading} className="sm:max-w-md border-zinc-800/80 bg-[#16171a]/95 text-[#F4F4F4] shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] backdrop-blur-xl">

                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-[#F4F4F4]">
                        Ürün Ekleme
                    </DialogTitle>
                </DialogHeader>

                <form noValidate onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-2">

                        <div className="flex flex-col gap-1">

                            <label htmlFor="productUrl" className="text-xs font-medium text-zinc-300 ml-1">Ürün Linki <span className="text-rose-400 font-bold">*</span></label>

                            <input
                                type="url"
                                name="productUrl"
                                id="productUrl"
                                autoComplete="off"
                                placeholder="hepsiburada.com/... veya trendyol.com/..."
                                title="Ürün linki giriniz"
                                disabled={isLoading}
                                aria-invalid={Boolean(fieldErrors.productUrl)}
                                aria-describedby="productUrl-error"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 transition-all duration-150"
                            />

                            <p id="productUrl-error" role="alert" className="min-h-4 text-xs font-medium leading-4 text-rose-400 ml-1">
                                {fieldErrors.productUrl}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="customName" className="text-xs font-medium text-zinc-300 ml-1">Ürün Özel İsmi</label>
                            <input
                                type="text"
                                id="customName"
                                name="customName"
                                placeholder="Örnek: Babama alacağım ceket"
                                title="Özel isim giriniz"
                                disabled={isLoading}
                                maxLength={50}
                                aria-invalid={Boolean(fieldErrors.customName)}
                                aria-describedby="customName-error"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 transition-all duration-150"
                            />

                            <p id="customName-error" role="alert" className="min-h-4 text-xs font-medium leading-4 text-rose-400 ml-1">
                                {fieldErrors.customName}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-zinc-400 italic ml-1">
                                <span className="text-rose-400 font-bold not-italic mr-0.5">*</span> ile işaretli alanların doldurulması zorunludur.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                            >
                                {isLoading ? "Ürün Bilgileri Alınıyor..." : "Ürün Ekle"}
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
