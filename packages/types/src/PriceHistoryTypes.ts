export interface PriceHistoryInputType{

    productId:string;
    price:string;
}

export interface PriceHistoryOutputType{

    productId:string;
    price:string;
    checkedAt:Date|string;
}