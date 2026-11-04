import { Plus } from "lucide-react";

interface EmptyStateProps{
    onAddProduct:()=>void;
}

export function EmptyState({onAddProduct}:EmptyStateProps){

    return(

        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">

            <div className="relative">

                <div className="absolute size-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"/>

                <img
                    src="/empty-state.webp"
                    alt="Empty State Mascot"
                    className="relative w-auto h-40 z-10 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
            </div>

            <div className="flex flex-col gap-2">

                <h2 className="text-2xl font-bold tracking-tight">
                    Henüz Ürün Takip Etmiyorsun
                </h2>

                <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
                    Fiyat takibi yapmak ve indirimlerden anında haberdar olmak için aşağıdaki buton ile ilk ürününü takibe al
                </p>
            </div>
           

            <button
                type="button"
                onClick={onAddProduct}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-4 py-2.5 text-sm cursor-pointer"
            >
                <Plus className="size-5 stroke-2" />
                <span>İlk Ürününü Ekle</span>
            </button>
        </div>
    );
}
