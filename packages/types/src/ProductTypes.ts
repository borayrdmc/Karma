export interface ProductInputType{
    productUrl:string;
    productPlatform:"trendyol" | "hepsiburada"
    productCode:string;
    productName:string;
}
export interface ProductOutputType{
    productUrl:string;
    productId:string;
    productPlatform:"trendyol" | "hepsiburada"
    productCode:string;
    productName?:string|null;
}