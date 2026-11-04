"use client";

import { useEffect, useRef, useState } from "react";
import { PriceHistoryOutputType } from "@repo/types";
import { formatDateTime, formatPriceValue } from "@/lib";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, ReferenceLine } from "recharts";

interface DemoPriceChartProps{
    priceHistory:PriceHistoryOutputType[];
    selectedIndex:number;
    hideFuture?:boolean;
    onSelect:(index:number)=>void;
}

const CHART_MARGIN={top:12,right:12,left:0,bottom:4};
// Y ekseni etiketi 11px Geist; karakter başına ~7px, artı çentik (6px), boşluk ve pay. Genişlik sabit verilir ki
// çizim alanının kenarları bilinsin ve kaydırıcı aynı hizaya oturabilsin.
const AXIS_CHAR_WIDTH=7;
const AXIS_EXTRA_WIDTH=16;

const formatAxisLabel=(value:number)=>`${formatPriceValue(Math.round(value))} ₺`;

// Eksen değerleri yuvarlak sayılara otursun diye alan, fiyat aralığına göre seçilen adıma yuvarlanır.
// En fazla 5 eşit aralıklı etiket verecek en küçük adım seçilir.
function getPriceAxis(priceHistory:PriceHistoryOutputType[]){
    const prices=priceHistory.map((record)=>Number(record.price));
    const minPrice=Math.min(...prices);
    const maxPrice=Math.max(...prices);
    const padding=Math.max(1,Math.ceil((maxPrice-minPrice)*0.15));

    const rounding=(step:number)=>[Math.max(0,Math.floor((minPrice-padding)/step)*step),Math.ceil((maxPrice+padding)/step)*step] as const;
    const tickStep=[50,100,200,250,500,1000,2500,5000,10000].find((step)=>{
        const [low,high]=rounding(step);
        return (high-low)/step<=4;
    }) ?? 10000;
    const [domainMin,domainMax]=rounding(tickStep);
    const ticks=Array.from({length:Math.round((domainMax-domainMin)/tickStep)+1},(_,i)=>domainMin+i*tickStep);
    const longestLabel=Math.max(...ticks.map((tick)=>formatAxisLabel(tick).length));

    return {domainMin,domainMax,ticks,width:Math.ceil(longestLabel*AXIS_CHAR_WIDTH)+AXIS_EXTRA_WIDTH};
}

// Çizim alanının (ilk ve son kaydın) kapsayıcı kenarlarına uzaklığı; kaydırıcı bu hizaya göre yerleşir.
export function getPlotInset(priceHistory:PriceHistoryOutputType[]){
    return {left:CHART_MARGIN.left+getPriceAxis(priceHistory).width,right:CHART_MARGIN.right};
}

// Y ekseni etiketi düz <text> olarak çizilir: Recharts'ın kendi etiketi dar alanda "85.000 / ₺" diye iki satıra bölünüyordu.
function YAxisTick({x,y,payload}:{x?:number;y?:number;payload?:{value:number}}){
    return(
        <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill="#a1a1aa">
            {payload ? formatAxisLabel(payload.value) : ""}
        </text>
    );
}

// Bir X ekseni etiketinin ("24 Ekim") okunması için gereken yatay alan: en uzun etiket ~42px, arada en az 4px.
const X_LABEL_SPACE=46;

// Dashboard'daki PriceChart ile aynı görsel dil; farkı: seçili kayıt vurgulanır, sonraki kayıtlar soluklaşır.
// X ekseninde dashboard'daki gibi her kaydın altında tarihi yazar; aynı günün kayıtları aynı tarihi tekrarlar,
// ziyaretçi tarihi panele bakmadan okur. Bütün etiketler sığmıyorsa (dar ekran) her günün yalnızca ilk kaydı
// etiketlenir; onlar da sığmazsa Recharts aradakileri atlar (minTickGap).
// --demo-reveal değişkeni çizgiyi ve alanı sağdan kırpar (giriş animasyonunda soldan sağa çizim);
// hideFuture açıkken henüz çizilmemiş noktalar gizlenir.
export function DemoPriceChart({priceHistory,selectedIndex,hideFuture=false,onSelect}:DemoPriceChartProps){

    const container=useRef<HTMLDivElement>(null);
    const [chartWidth,setChartWidth]=useState(0);

    useEffect(()=>{
        const element=container.current;
        if(!element){
            return;
        }
        setChartWidth(element.getBoundingClientRect().width);
        const observer=new ResizeObserver(([entry])=>setChartWidth(entry?.contentRect.width ?? 0));
        observer.observe(element);
        return ()=>observer.disconnect();
    },[]);

    const chartData=priceHistory.map((record,index)=>({
        index,
        price:Number(record.price),
        day:formatDateTime(record.checkedAt,false).replace(/ \d{4}$/,""),
    }));
    const isRepeatDay=(index:number)=>index>0 && chartData[index]!.day===chartData[index-1]!.day;

    const {domainMin,domainMax,ticks:yTicks,width:yAxisWidth}=getPriceAxis(priceHistory);

    const plotWidth=chartWidth-yAxisWidth-CHART_MARGIN.left-CHART_MARGIN.right;
    const fitsEveryRecord=plotWidth>=chartData.length*X_LABEL_SPACE;
    const xTicks=chartData.filter((item)=>fitsEveryRecord || !isRepeatDay(item.index)).map((item)=>item.index);
    const xLabel=(index:number)=>chartData[index]?.day ?? "";

    return(
        <div ref={container} data-demo-chart className="h-52 w-full sm:h-64 [&_.recharts-area-area]:[clip-path:inset(0_var(--demo-reveal,0%)_0_0)] [&_.recharts-area-curve]:[clip-path:inset(0_var(--demo-reveal,0%)_0_0)]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={CHART_MARGIN}>
                    <defs>
                        <linearGradient id="demoPriceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <XAxis
                        type="number"
                        dataKey="index"
                        domain={[0,chartData.length-1]}
                        ticks={xTicks}
                        interval="preserveStartEnd"
                        minTickGap={6}
                        tickFormatter={xLabel}
                        axisLine={{stroke:"#27272a",strokeWidth:1.5}}
                        tickLine={{stroke:"#27272a"}}
                        tick={{fontSize:11,fill:"#a1a1aa"}}
                        dy={6}
                    />
                    <YAxis
                        type="number"
                        domain={[domainMin,domainMax]}
                        ticks={yTicks}
                        interval={0}
                        width={yAxisWidth}
                        axisLine={{stroke:"#27272a",strokeWidth:1.5}}
                        tickLine={{stroke:"#27272a"}}
                        tick={<YAxisTick/>}
                    />

                    <ReferenceLine x={selectedIndex} stroke="#3f3f46" strokeDasharray="4 4" strokeWidth={1.5}/>

                    <Area
                        type="linear"
                        dataKey="price"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#demoPriceGradient)"
                        isAnimationActive={false}
                        activeDot={false}
                        dot={(props:{cx?:number;cy?:number;index?:number})=>{
                            const {cx,cy,index=0}=props;
                            if(cx==null || cy==null){
                                return <g key={index}/>;
                            }
                            const isSelected=index===selectedIndex;
                            const isFuture=index>selectedIndex;
                            if(isFuture && hideFuture){
                                return <g key={index}/>;
                            }

                            return(
                                <g key={index}>
                                    {isSelected && <circle cx={cx} cy={cy} r={10} fill="none" stroke="#34d399" strokeOpacity={0.5} strokeWidth={2}/>}
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={isSelected ? 5.5 : 4}
                                        fill={isSelected ? "#34d399" : "#10b981"}
                                        fillOpacity={isFuture ? 0.35 : 1}
                                        stroke="#16171a"
                                        strokeWidth={2}
                                        style={{pointerEvents:"none"}}
                                    />
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={14}
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onClick={()=>onSelect(index)}
                                    >
                                        <title>{`${formatDateTime(priceHistory[index]!.checkedAt)} · ${formatPriceValue(chartData[index]!.price)} TL`}</title>
                                    </circle>
                                </g>
                            );
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
