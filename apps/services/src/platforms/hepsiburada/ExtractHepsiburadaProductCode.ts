export function extractHepsiburadaProductCode(url:string){

    const match = url.match(/-p-([A-Za-z0-9]+)(?:[/?#].*)?$/); //2nd part is for search params

    if(!match || !match[1]){
        throw new Error(`Couldn't extract product code from given link`);
    }
    const productCode = match[1];

    return productCode; //Ignore first (all of the regex) match and 3rd match (search params)
}