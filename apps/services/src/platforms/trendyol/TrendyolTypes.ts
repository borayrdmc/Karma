export interface TrendyolResponseProductData{

    product:{
        name:string;
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

export interface TrendyolProductData{
    
    productTitle:string;
    sellingPrice:number;
    inStock:boolean;
}