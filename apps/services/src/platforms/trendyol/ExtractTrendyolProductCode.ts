export function extractTrendyolProductCode(productUrl:string){

    const match = productUrl.match(/-p-(\d+)/);
    
	if(!match || !match[1]){
        throw new Error(`Couldn't extract product code from given link`);
    }
    const productCode = match[1];

    return productCode; //Ignore first (all of the regex) match and 3rd match (search params)
}