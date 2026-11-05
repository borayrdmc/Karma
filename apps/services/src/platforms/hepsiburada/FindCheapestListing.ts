import { HepsiburadaListing, HepsiburadaResponseProductData } from "@repo/types";

export function findCheapestListing(responseData:HepsiburadaResponseProductData): HepsiburadaListing | null{

    const productListings=responseData.data?.listings;

    if(!productListings || productListings.length === 0){
        return null;
    }

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