import { deleteUntrackedProducts } from "./DeleteUntrackedProducts";
import { getAllTrackedProductIds } from "./GetAllTrackedProductIds";

export async function clearUntrackedProducts(){
    
    const trackedProductIdList=await getAllTrackedProductIds()
    const deletedProducts= await deleteUntrackedProducts(trackedProductIdList);

    return deletedProducts;
}