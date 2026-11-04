import { PriceStatus } from "@repo/types";
import { CircleDashed, Minus, MoveDown, MoveUp, TriangleAlert, type LucideIcon } from "lucide-react";

const STATUS_STYLES:Record<PriceStatus,{label:string;icon:LucideIcon;className:string}>={
    real_discount:{label:"Gerçek indirim",icon:MoveDown,className:"border-emerald-500/25 bg-emerald-500/10 text-emerald-400"},
    fake_discount:{label:"Sahte indirim şüphesi",icon:TriangleAlert,className:"border-amber-500/30 bg-amber-500/10 text-amber-400"},
    price_increase:{label:"Zam",icon:MoveUp,className:"border-rose-500/25 bg-rose-500/10 text-rose-400"},
    no_change:{label:"Değişim yok",icon:Minus,className:"border-zinc-700 bg-zinc-800/60 text-zinc-300"},
    insufficient_data:{label:"Yetersiz veri",icon:CircleDashed,className:"border-dashed border-zinc-600 bg-transparent text-zinc-300"},
};

// Landing'deki durum etiketi: rengin yanında her zaman simge ve yazı taşır, anlam yalnızca renge bırakılmaz.
export function PriceStatusBadge({status}:{status:PriceStatus}){

    const {label,icon:Icon,className}=STATUS_STYLES[status];

    return(
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold leading-none ${className}`}>
            <Icon className="size-3.5" aria-hidden="true"/>
            {label}
        </span>
    );
}
