import { PriceHistoryOutputType, PriceInsightResultType } from "@repo/types";

const TIME_WINDOW=30;

export function PriceInsight(productPriceHistory: PriceHistoryOutputType[]):PriceInsightResultType{

    const timeWindowStartDate=new Date(Date.now()-TIME_WINDOW*24*60*60*1000);

    if(productPriceHistory.length<2){
        return {status:"insufficient_data"}
    }

    const pricesInsideTimeWindow=productPriceHistory.filter((priceHistoryItem)=>{return new Date(priceHistoryItem.checkedAt)>=timeWindowStartDate});
    const pricesOutsideTimeWindow=productPriceHistory.filter((priceHistoryItem)=>{return new Date(priceHistoryItem.checkedAt)<timeWindowStartDate});

    if(pricesOutsideTimeWindow.length>0){
        const oldestRecord=pricesOutsideTimeWindow.at(-1);

        if(pricesInsideTimeWindow.length===0){
            return {status:"no_change"}
        }

        if(oldestRecord){
            pricesInsideTimeWindow.unshift(oldestRecord);
        }
    }

    const latestPriceItem=pricesInsideTimeWindow.at(-1);
    const previousPriceItem=pricesInsideTimeWindow.at(-2);

    const latestPrice=Number(latestPriceItem?.price);
    const previousPrice=Number(previousPriceItem?.price);

    if(!latestPriceItem || !previousPriceItem){
        return {status:"insufficient_data"};
    }

    else if(latestPrice===previousPrice){
        return {status:"no_change"}
    }

    else if(latestPrice>previousPrice){
        
        let basePrice=latestPrice;

        for(let i=pricesInsideTimeWindow.length-2; i>= 0; i--){

            const currentItemPrice=Number(pricesInsideTimeWindow[i]?.price);

            if(currentItemPrice<=basePrice){
                basePrice=currentItemPrice;
            } 
            else{
                break;
            }
        }

        const increasePercentage=((latestPrice-basePrice)/basePrice)*100;
 
        const priceChangeAmount=latestPrice-basePrice;

        return {status:"price_increase",priceChangePercent:increasePercentage,priceChangeAmount};
    }

    else{
        
        let peakIndex=pricesInsideTimeWindow.length-1;
        let peakPrice=latestPrice;

        for(let i=pricesInsideTimeWindow.length-2; i>=0; i--){

            const currentItemPrice=Number(pricesInsideTimeWindow[i]?.price);

            if(currentItemPrice>=peakPrice){
                peakPrice=currentItemPrice;
                peakIndex=i;
            } 
            else{
                break;
            }
        }

        const discountPercentage=((peakPrice-latestPrice)/peakPrice*100);

        if(peakIndex===0){

            const priceChangeAmount=peakPrice-latestPrice;

            return {status:"real_discount",priceChangePercent:discountPercentage,priceChangeAmount};
        }

        else{
            
            let lowestPriceBeforePeak=Infinity;
            const beforePeakPriceHistory=pricesInsideTimeWindow.slice(0,peakIndex);

            for(const beforePeakPriceItem of beforePeakPriceHistory){

                const currentItemPrice=Number(beforePeakPriceItem.price);

                if(currentItemPrice<lowestPriceBeforePeak){
                    lowestPriceBeforePeak=currentItemPrice;
                }
            }
            
            if(latestPrice<=lowestPriceBeforePeak){

                const realDiscountPercentage=((lowestPriceBeforePeak-latestPrice)/lowestPriceBeforePeak)*100;

                const priceChangeAmount=lowestPriceBeforePeak-latestPrice;

                return{status:"real_discount",priceChangePercent:realDiscountPercentage,priceChangeAmount};
            }

            else{

                const realIncreasePercentage=((latestPrice-lowestPriceBeforePeak)/lowestPriceBeforePeak)*100;

                const priceChangeAmount=latestPrice-lowestPriceBeforePeak;
               
                const recentDropAmount=peakPrice-latestPrice;

                return{status:"fake_discount",priceChangePercent:realIncreasePercentage,priceChangeAmount,recentDropPercent:discountPercentage,recentDropAmount};
            }
        }
    }
}