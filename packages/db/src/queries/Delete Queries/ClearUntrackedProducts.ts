import { deleteUntrackedProducts } from "./DeleteUntrackedProducts";
import { getAllTrackedProductIds } from "./GetAllTrackedProductIds";

export async function clearUntrackedProducts(){
    
    const trackedProductIdList=await getAllTrackedProductIds()
    await deleteUntrackedProducts(trackedProductIdList);
}