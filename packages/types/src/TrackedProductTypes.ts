export interface TrackedProductInputType{

    userId:string;
    productId:string;
}
export interface TrackedProductOutputType{

    productId:string;
    customName?:string|null;
    trackedAt:Date|string;
}