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