interface EmptyFilterProps{
    selectedFilter:string;
    onClickFunction:()=>void;
}

export function EmptyFilter({selectedFilter,onClickFunction}:EmptyFilterProps){
    return(
        <div className="flex flex-col items-center justify-center gap-3 text-center my-auto">
            <p className="text-sm font-medium text-zinc-400">
                Seçili filtreye ({selectedFilter}) ait ürün bulunamadı.
            </p>
            
            <button
                type="button"   
                onClick={onClickFunction}
                className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
            >
                Tüm Ürünleri Göster
            </button>
        </div>
    );
}
