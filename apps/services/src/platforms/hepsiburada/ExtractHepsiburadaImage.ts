export function extractHepsiburadaImage(htmlData:string){

    const preloadImageMatch=htmlData.match(/<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]+href=["']([^"']+)["']/i);
    const fallbackImageMatch=htmlData.match(/https:\/\/productimages\.hepsiburada\.net\/s\/[^"'\s>]+/i);
    const productImageUrl=preloadImageMatch?.[1] ?? fallbackImageMatch?.[0] ?? null;

    return productImageUrl;
}