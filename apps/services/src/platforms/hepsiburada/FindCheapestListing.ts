import { ServiceError } from "@repo/errors";
import { HepsiburadaListing, HepsiburadaResponseProductData} from "./HepsiburadaTypes";

export function findCheapestListing(responseData:HepsiburadaResponseProductData): HepsiburadaListing{

    const productListings=responseData.data?.listings;

    if(!productListings || productListings.length === 0){
        throw new ServiceError("No listings were found.",404);
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