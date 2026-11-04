export interface HepsiburadaListing{

    price:{
        value:number;
    };
}
export interface HepsiburadaResponseProductData{

    data:{
        listings:HepsiburadaListing[];  
    };
}