export interface ProductInputType{
    productUrl:string;
    productPlatform:"trendyol" | "hepsiburada"
    productCode:string;
    productName:string;
    productImageUrl:string | null;
}
export interface ProductOutputType{
    productUrl:string;
    productId:string;
    productPlatform:"trendyol" | "hepsiburada"
    productCode:string;
    productName:string;
    productImageUrl:string | null
}