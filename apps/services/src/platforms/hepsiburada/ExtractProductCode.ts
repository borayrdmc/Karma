export function extractProductCode(url:string){

    const match = url.match(/-p-([A-Za-z0-9]+)(?:[/?#].*)?$/); //2nd part is for search params

    if (!match){
        throw new Error(`Couldn't extract product code from given link`);
    }

    const productCode = match[1];
    console.log(productCode);

    return productCode; //Ignore first (all of the regex) match and 3rd match (search params)
}
