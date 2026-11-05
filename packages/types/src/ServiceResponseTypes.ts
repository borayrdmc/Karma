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

export interface TrendyolResponseProductData{

    product:{
        name:string;
        images?: string[];
        inStock:boolean
        merchantListing:null | {
            winnerVariant:{
                price:{
                    sellingPrice:{
                        value:number;
                    }
                    originalPrice:{
                        value:number;
                    }
                }
                inStock:boolean;
            }
        }
    };
}