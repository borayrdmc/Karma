import { TrackedProductItemType } from "@repo/types";
import { ServiceError } from "../../../../packages/errors/src";

interface FetchProductsResponse {
    success:boolean;
    data?:TrackedProductItemType[];
    error?:string;
}

export async function fetchTrackedProducts(userId:string):Promise<TrackedProductItemType[]>{

    const response=await fetch("http://localhost:3001/api/products",{

        method:"GET",
        headers:{
            "x-user-id":userId,
            "x-internal-api-key":process.env.INTERNAL_API_KEY!,
        },
        cache:"no-store"
    })

    const result:FetchProductsResponse=await response.json();

    if(!response.ok|| !result.success|| !result.data){
        throw new ServiceError(result.error||"Ürünler yüklenirken bir hata oluştu.",500);
    }

    return result.data;
}