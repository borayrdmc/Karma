import { ServiceError } from "@repo/errors";
import { HepsiburadaResponseProductData } from "./HepsiburadaTypes";
import { resolveHepsiburadaProductVariant } from "./ResolveHepsiburadaProductVariant";

const HEPSIBURADA_API_BASE_URL = "https://www.hepsiburada.com/api/v1/product/listings";

export async function fetchHepsiburadaProductData(productCode:string) : Promise<HepsiburadaResponseProductData>{

    const variantCode=await resolveHepsiburadaProductVariant(productCode);

    const response = await fetch(`${HEPSIBURADA_API_BASE_URL}/${variantCode}`);
            
    const responseData: HepsiburadaResponseProductData = await response.json();
    
    if(!responseData.data){
        throw new ServiceError("Invalid product code.",400);
    }

    return responseData;
}
