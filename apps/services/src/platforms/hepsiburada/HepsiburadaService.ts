import { findCheapestListing } from "./FindCheapestListing";
import { HepsiburadaProductData, ProductData } from "./HepsiburadaTypes";

const HEPSIBURADA_API_BASE_URL = "https://www.hepsiburada.com/api/v1/product/listings";

interface HepsiburadaResponse{

    data:{
        listings:HepsiburadaProductData[];
    }
}

export async function hepsiburadaService(productCode:string) : Promise<ProductData>{

    const response = await fetch(`${HEPSIBURADA_API_BASE_URL}/${productCode}`);
    
    if(!response.ok){

        throw new Error(`API fetch failed: ${response.status}`);
    }

    const responseData: HepsiburadaResponse = await response.json();
    
    const productListings = responseData.data.listings;

    if(!productListings || productListings.length===0){

        throw new Error("No listings were found for given product.");
    }
    
    const cheapestListing = findCheapestListing({productListings});

    return {merchantName:cheapestListing.merchantName , price:cheapestListing.price.value}
}