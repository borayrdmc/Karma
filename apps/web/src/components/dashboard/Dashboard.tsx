"use client"

import { TrackedProductItemType } from "@repo/types";
import { useState } from "react"

interface dashboardProps{

    trackedProductsList:TrackedProductItemType[];
    userName:string;
}

export function Dashboard({trackedProductsList,userName}:dashboardProps){

    const [clientTrackedProductsList,setClientTrackedProductsList]=useState(trackedProductsList);
    const [selectedProduct,setSelectedProduct]=useState<TrackedProductItemType|null>(null);

    return(
        <div className="min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-4">Hoş geldin, {userName}!</h1>
            <p className="mb-4 text-gray-600">Takip edilen ürün sayısı: {clientTrackedProductsList.length}</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(clientTrackedProductsList,null,2)}
            </pre>
        </div>
    );
}