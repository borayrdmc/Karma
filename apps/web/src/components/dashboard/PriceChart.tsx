"use client";

import { useState } from "react";
import { PriceHistoryOutputType } from "@repo/types";
import { formatPrice } from "@/lib";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface PriceChartProps {
    priceHistory: PriceHistoryOutputType[];
}

interface ChartDataItem {
    index: number;
    date: string;
    fullDate: string;
    price: number;
}

// Sadece bir noktanın üzerine gelindiğinde açılan bilgi balonu
function CustomTooltip({ hoveredPoint }: { hoveredPoint: ChartDataItem | null }) {
    if (!hoveredPoint) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-xl">
            <p className="text-[11px] font-medium text-gray-400">{hoveredPoint.fullDate}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
                {formatPrice(hoveredPoint.price)}
            </p>
        </div>
    );
}

export function PriceChart({ priceHistory }: PriceChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // 1. Kenar Senaryo: 2'den az veri varsa bilgilendirme ekranı göster
    if (!priceHistory || priceHistory.length < 2) {
        return (
            <div className="w-full h-64 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <TrendingUp className="size-8 mb-2 text-gray-300 stroke-1" />
                <p className="text-sm font-medium text-gray-600">Henüz Yeterli Grafik Verisi Yok</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Fiyat değişim grafiğinin oluşabilmesi için en az 2 farklı zaman kontrolü gereklidir.
                </p>
            </div>
        );
    }

    // 2. Her noktaya benzersiz (unique) bir index veriyoruz
    const chartData: ChartDataItem[] = priceHistory.map((item, idx) => {
        const dateObj = new Date(item.checkedAt);
        return {
            index: idx,
            date: dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
            fullDate: dateObj.toLocaleString("tr-TR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
            }),
            price: Number(item.price),
        };
    });

    // 3. Y Ekseni Sınırları ve Öncelik Tabanlı Akıllı Fiyat Seçimi
    const allPrices = chartData.map((d) => d.price);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;

    const padding = priceRange === 0 ? Math.max(1, Math.round(minPrice * 0.05)) : Math.ceil(priceRange * 0.15);
    const minDomain = Math.max(0, minPrice - padding);
    const maxDomain = maxPrice + padding;

    // Her fiyatın grafikte kaç kez tekrar ettiğini hesapla
    const freqMap = new Map<number, number>();
    for (const p of allPrices) {
        freqMap.set(p, (freqMap.get(p) ?? 0) + 1);
    }

    const startPrice = chartData[0]!.price;
    const uniquePricesAsc = Array.from(new Set(allPrices)).sort((a, b) => a - b);

    // Y ekseninde iki fiyat yazısının üst üste binmemesi için minimum mesafe
    const minVisualGap = priceRange * 0.14;
    const selectedTicks: number[] = [];

    // Yardımcı fonksiyon: Yeni eklenecek fiyat mevcut seçilenlere çok yakın mı?
    const isTooCloseToSelected = (candidate: number, gap: number) =>
        selectedTicks.some((existing) => Math.abs(existing - candidate) < gap);

    // ADIM A: Başlangıç noktasının fiyatı ve birden fazla tekrar eden fiyatlar (Kesin Renderlenecekler)
    // Çok tekrar edenleri önce ekle, başlangıç fiyatını ise her halükarda garantiye al
    const repeatedPrices = uniquePricesAsc
        .filter((p) => (freqMap.get(p) ?? 0) > 1)
        .sort((a, b) => (freqMap.get(b) ?? 0) - (freqMap.get(a) ?? 0) || a - b);

    selectedTicks.push(startPrice);

    for (const p of repeatedPrices) {
        if (!selectedTicks.includes(p)) {
            // Eğer tekrar eden fiyat başlangıç fiyatıyla neredeyse aynı hizadaysa (yazılar üst üste binecekse)
            // tekrar eden fiyat daha kritik olduğu için başlangıç fiyatının yerini alabilir, değilse ikisi de eklenir
            if (!isTooCloseToSelected(p, priceRange * 0.08)) {
                selectedTicks.push(p);
            }
        }
    }

    // ADIM B: Geriye kalan (1 kez geçen) fiyatları küçükten büyüğe (en ucuzdan pahalıya) kontrol et
    // Böylece birbirine yakın (%5 / minVisualGap içindeki) tekil fiyatlardan otomatik olarak EN UCUZU seçilir
    for (const p of uniquePricesAsc) {
        if (!selectedTicks.includes(p)) {
            if (!isTooCloseToSelected(p, minVisualGap)) {
                selectedTicks.push(p);
            }
        }
    }

    const yAxisTicks = selectedTicks.sort((a, b) => a - b);

    const hoveredPoint = hoveredIndex !== null ? (chartData[hoveredIndex] ?? null) : null;

    return (
        <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {/* Degrade (Gradient) Mavi Gölge Tanımı */}
                    <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    {/* Arka Plandaki Yatay Kesik Çizgiler */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                    {/* X Ekseni */}
                    <XAxis
                        type="number"
                        dataKey="index"
                        domain={[0, chartData.length - 1]}
                        ticks={chartData.map((d) => d.index)}
                        tickFormatter={(idx) => chartData[idx]?.date ?? ""}
                        axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                        tickLine={{ stroke: "#cbd5e1" }}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        dy={6}
                    />

                    {/* Y Ekseni: width="auto" ile sol boşluk sıfırlandı, sağ ve sol margin eşitlendi */}
                    <YAxis
                        type="number"
                        dataKey="price"
                        orientation="left"
                        domain={[minDomain, maxDomain]}
                        ticks={yAxisTicks}
                        interval={0}
                        width="auto"
                        axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                        tickLine={{ stroke: "#cbd5e1" }}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        tickFormatter={(val) => `${Number(val).toLocaleString("tr-TR")} ₺`}
                    />

                    {/* Nokta Üzerine Gelindiğinde Çıkan X ve Y Kılavuz Çubukları */}
                    {hoveredPoint && (
                        <>
                            <ReferenceLine
                                segment={[
                                    { x: hoveredPoint.index, y: minDomain },
                                    { x: hoveredPoint.index, y: hoveredPoint.price },
                                ]}
                                stroke="#64748b"
                                strokeDasharray="4 4"
                                strokeWidth={1.5}
                                style={{ pointerEvents: "none" }}
                            />
                            <ReferenceLine
                                segment={[
                                    { x: 0, y: hoveredPoint.price },
                                    { x: hoveredPoint.index, y: hoveredPoint.price },
                                ]}
                                stroke="#64748b"
                                strokeDasharray="4 4"
                                strokeWidth={1.5}
                                style={{ pointerEvents: "none" }}
                            />
                        </>
                    )}

                    {/* isAnimationActive={false} ile sol üstten kayarak gelme animasyonu kapatıldı */}
                    <Tooltip
                        active={hoveredPoint !== null}
                        isAnimationActive={false}
                        cursor={false}
                        content={<CustomTooltip hoveredPoint={hoveredPoint} />}
                    />

                    {/* Keskin Lineer Grafik Çizgisi ve Etkileşimli Noktalar */}
                    <Area
                        type="linear"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="url(#priceGradient)"
                        isAnimationActive={false}
                        activeDot={false}
                        dot={(props: any) => {
                            const { cx, cy, index } = props;
                            if (cx == null || cy == null) return <g key={index} />;
                            const isHovered = hoveredIndex === index;

                            return (
                                <g key={index}>
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={isHovered ? 6 : 4}
                                        fill={isHovered ? "#1d4ed8" : "#2563eb"}
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        style={{ pointerEvents: "none" }}
                                    />
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={12}
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                </g>
                            );
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}