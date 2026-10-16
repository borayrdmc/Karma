export function extractHepsiburadaProductName(productUrl:string){

    const pathname=new URL(productUrl).pathname;

    const rawProductName=pathname
        .replace(/^\//, "")
        .replace(/-p[m]?-[A-Za-z0-9]+$/, "");

    if(!rawProductName){
        return "Hepsiburada Ürünü";
    }

    const productName=rawProductName.split("-").filter(Boolean).map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1)).join(" ");

    return productName;
}