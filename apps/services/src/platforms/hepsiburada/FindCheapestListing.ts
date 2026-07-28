import { HepsiburadaProductData } from "./HepsiburadaTypes";

interface Listings{

    productListings:HepsiburadaProductData[];
}

export function findCheapestListing({productListings}:Listings){

    const cheapestListing = productListings.reduce(

        (cheapestListing,currentListing)=>{

            if(currentListing.price.value < cheapestListing.price.value){
                return currentListing;
            }
            else{
                return cheapestListing;
            }
        }
    );
    
    return cheapestListing;
}