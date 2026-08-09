export interface HepsiburadaListing{

    merchantName:string,
    price:{
        value:number
    }
}
export interface HepsiburadaResponseProductData{

    data:{
        listings:HepsiburadaListing[];  
    }   
}
export interface HepsiburadaProductData{

    merchantName:string;
    price:number;
}