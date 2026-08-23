import { fetchTrendyolHtmlViaFetch } from "./FetchTrendyolHtmlViaFetch";
import { fetchTrendyolHtmlViaPlaywright } from "./FetchTrendyolHtmlViaPlaywright";

export async function getTrendyolHtml(productUrl:string): Promise<string>{

    try{
        const trendyolRawHtml=await fetchTrendyolHtmlViaFetch(productUrl);

        return trendyolRawHtml;
    }
    catch(fetchError){
        
        try{
            const trendyolRawHtml=await fetchTrendyolHtmlViaPlaywright(productUrl);
            return trendyolRawHtml;
        }
        catch(playwrightError){
            throw playwrightError;
        }
    }
}