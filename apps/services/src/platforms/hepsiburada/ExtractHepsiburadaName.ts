export function extractHepsiburadaName(htmlData:string){

    const utagDataMatch = htmlData.match(/const\s+utagData\s*=\s*(\{.+?\})\s*(?:;|\r?\n)/);

    if(!utagDataMatch || !utagDataMatch[1]){
        return "Hepsiburada Ürünü"
    }

    else{

        const utagData=JSON.parse(utagDataMatch[1]);

        const productName=utagData.product_names?.[0] || utagData.product_name_array;

        if(!productName){
            return "Hepsiburada Ürünü"
        }
        
        return productName;
    }
}