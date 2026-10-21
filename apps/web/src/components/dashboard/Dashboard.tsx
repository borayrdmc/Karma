"use client"

import { TrackedProductItemType } from "@repo/types";
import { useState } from "react"
import { ProductCard } from "./product-card/ProductCard";
import { AddProductButton } from "./product-card/AddProductButton";
import { AddProductModal } from "./modals/AddProductModal";
import { DeleteProductModal } from "./modals/DeleteProductModal";

interface dashboardProps{
    trackedProductsList:TrackedProductItemType[];
    userName:string;
}

export function Dashboard({trackedProductsList,userName}:dashboardProps){

    const [clientTrackedProductsList,setClientTrackedProductsList]=useState(trackedProductsList);
    const [selectedProduct,setSelectedProduct]=useState<TrackedProductItemType|null>(null);
    const [isAddModalOpen, setIsAddModalOpen]=useState(false);
    const [productToBeDeleted,setProductToBeDeleted]=useState<TrackedProductItemType|null>(null);

    function handleProductAdded(newProduct:TrackedProductItemType){
        setClientTrackedProductsList((prevList)=>[newProduct,...prevList]);
    }

    function handleProductDeleted(productId:string){
        setClientTrackedProductsList((prevList)=>prevList.filter(item=>item.product.productId!==productId));
    }

    return(
        <>
            <div className="min-h-screen p-6">
                <h1 className="text-2xl font-bold mb-4">Hoş geldin, {userName}!</h1>
                <p className="mb-4 text-gray-600">Takip edilen ürün sayısı: {clientTrackedProductsList.length}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
                    {clientTrackedProductsList.map((item) => (
                        <ProductCard
                            key={item.product.productId}
                            productItem={item}
                            setModal={(selected)=>setSelectedProduct(selected)}
                            deleteProduct={()=>setProductToBeDeleted(item)}
                        />
                    ))}
                </div>

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
        </>
    );
}