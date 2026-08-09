import { HepsiburadaListing, HepsiburadaResponseProductData} from "./HepsiburadaTypes";

export function findCheapestAlternative(responseData:HepsiburadaResponseProductData): HepsiburadaListing{

    const productListings=responseData.data?.listings;

    if(!productListings || productListings.length === 0){
        throw new Error("No listings were found for given product.");
    }

    const cheapestListing = productListings.reduce(

        (cheapestListing,currentListing)=>{ 

            if(currentListing.price.value <= cheapestListing.price.value){
                return currentListing;
            }
            else{
                return cheapestListing;
            }
        }
    );
    
    return cheapestListing;
}