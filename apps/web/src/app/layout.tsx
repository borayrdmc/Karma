import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans=Plus_Jakarta_Sans({
    variable:"--font-jakarta-sans",
    subsets:["latin", "latin-ext"],
    display:"swap",
});

const baseUrl=process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export const metadata:Metadata={
    metadataBase:new URL(baseUrl),
    title:"Karma",
    description:"Trendyol ve Hepsiburada ürünleri tek bir platformdan, fiyat geçmişleriyle beraber takip et ve indirimin gerçek mi sahte mi olduğunu gör.",
};

export default function RootLayout({ children }:LayoutProps<"/">){
    return(
        <html
            lang="tr"
            className={`${jakartaSans.variable} dark h-full antialiased font-sans`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
