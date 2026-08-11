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