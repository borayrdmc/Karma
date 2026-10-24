"use client"

import { TrackedProductItemType } from "@repo/types";
import { useState, useMemo } from "react";
import { PriceInsight } from "@/lib";
import { ProductCard } from "./product-card/ProductCard";
import { AddProductButton } from "./AddProductButton";
import { AddProductModal } from "./modals/AddProductModal";
import { DeleteProductModal } from "./modals/DeleteProductModal";
import { ProductDetailsModal } from "./modals/ProductDetailsModal";
import { DashboardHeader } from "./DashboardHeader";

interface dashboardProps{
    trackedProductsList:TrackedProductItemType[];
    userName:string;
}

export function Dashboard({trackedProductsList,userName}:dashboardProps){

    const [clientTrackedProductsList,setClientTrackedProductsList]=useState(trackedProductsList);
    const [selectedProduct,setSelectedProduct]=useState<TrackedProductItemType|null>(null);
    const [isAddModalOpen, setIsAddModalOpen]=useState(false);
    const [productToBeDeleted,setProductToBeDeleted]=useState<TrackedProductItemType|null>(null);
    const [selectedFilter, setSelectedFilter]=useState<"all" | "hepsiburada" | "trendyol">("all");

    function handleProductAdded(newProduct:TrackedProductItemType){
        setClientTrackedProductsList((prevList)=>[newProduct,...prevList]);
    }

    function handleProductDeleted(productId:string){
        setClientTrackedProductsList((prevList)=>prevList.filter(item=>item.product.productId!==productId));
    }

    const {hepsiburadaCount,trendyolCount,discountCount,increaseCount,fakeDiscountCount}=useMemo(()=>{
        
        let hepsiburadaCount=0;
        let trendyolCount=0;
        let discountCount=0;
        let increaseCount=0;
        let fakeDiscountCount=0;

        for(const item of clientTrackedProductsList){

            if(item.product.productPlatform==="hepsiburada"){hepsiburadaCount++;}
            if(item.product.productPlatform==="trendyol"){trendyolCount++;}

            const status=PriceInsight(item.productPriceHistory).status;

            if(status==="real_discount"){discountCount++;}
            if(status==="price_increase"){increaseCount++;}
            if(status==="fake_discount"){fakeDiscountCount++;}
        }

        return {hepsiburadaCount,trendyolCount,discountCount,increaseCount,fakeDiscountCount};

    },[clientTrackedProductsList]);

    const displayedProducts=useMemo(()=>{

        if(selectedFilter==="all"){
            return clientTrackedProductsList;
        }

        return clientTrackedProductsList.filter(item=>item.product.productPlatform===selectedFilter);

    },[clientTrackedProductsList,selectedFilter]);

    return(
        <>
            <div className="min-h-screen bg-[#0c0d0e] text-[#F4F4F4] flex flex-col">
                <DashboardHeader
                    userName={userName}
                    totalCount={clientTrackedProductsList.length}
                    hepsiburadaCount={hepsiburadaCount}
                    trendyolCount={trendyolCount}
                    discountCount={discountCount}
                    increaseCount={increaseCount}
                    fakeDiscountCount={fakeDiscountCount}
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                />

                <main className="flex-1 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        {displayedProducts.map((item) => (
                            <ProductCard
                                key={item.product.productId}
                                productItem={item}
                                setModal={(selected)=>setSelectedProduct(selected)}
                                deleteProduct={()=>setProductToBeDeleted(item)}
                            />
                        ))}
                    </div>

                    {displayedProducts.length === 0 && (
                        <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-900/30 text-center text-xs text-zinc-500">
                            Bu filtreye uygun takip edilen ürün bulunamadı.
                        </div>
                    )}
                </main>

                <AddProductButton onClick={() => setIsAddModalOpen(true)} />
            </div>

            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onProductAdd={handleProductAdded}
            />
            <DeleteProductModal 
                productToBeDeleted={productToBeDeleted}
                onClose={() => setProductToBeDeleted(null)}
                onDelete={handleProductDeleted}
            />
            <ProductDetailsModal
                productData={selectedProduct}
                onClose={()=>setSelectedProduct(null)}
            />
        </>
    );
}