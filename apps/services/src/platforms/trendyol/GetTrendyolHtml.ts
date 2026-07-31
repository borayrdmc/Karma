import { fetchTrendyolHtmlViaFetch } from "./FetchTrendyolHtmlViaFetch";
import { fetchTrendyolHtmlViaPlaywright } from "./FetchTrendyolHtmlViaPlaywright";

export async function getTrendyolHtml(productUrl:string): Promise<string>{

    try{
        const trendyolRawHtml=await fetchTrendyolHtmlViaFetch(productUrl);

        return trendyolRawHtml;
    }
    catch(fetchError){

        console.log(`Fetch failed due to: ${fetchError}`);
        console.log("Trying playwright to fetch.");

        try{
            const trendyolRawHtml=await fetchTrendyolHtmlViaPlaywright(productUrl);
            return trendyolRawHtml;
        }
        catch(playwrightError){
            throw new AggregateError([fetchError, playwrightError],"Both fetching methods failed.");
        }
    }
}