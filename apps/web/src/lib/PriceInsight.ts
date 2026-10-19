import { PriceHistoryOutputType, PriceInsightResultType } from "@repo/types";

const TIME_WINDOW=30;
const MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT=1;

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

        const rawIncreasePercentage=((latestPrice-basePrice)/basePrice)*100;

        if(rawIncreasePercentage<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT){
            return {status:"no_change"};
        } 
        else{
            const priceChangeAmount=latestPrice-basePrice;
            const increasePercentageRounded=Math.round(rawIncreasePercentage);

            return {status:"price_increase",priceChangePercent:increasePercentageRounded,priceChangeAmount};
        }
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

        const rawDiscountPercentage=((peakPrice-latestPrice)/peakPrice*100);

        if(peakIndex===0){

            if(rawDiscountPercentage<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT){
                return{status:"no_change"};
            }

            const priceChangeAmount=peakPrice-latestPrice;
            const discountPercentageRounded=Math.round(rawDiscountPercentage);

            return {status:"real_discount",priceChangePercent:discountPercentageRounded,priceChangeAmount};
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
            
            if(latestPrice<lowestPriceBeforePeak){

                const rawRealDiscountPercentage=((lowestPriceBeforePeak-latestPrice)/lowestPriceBeforePeak)*100;

                if(rawRealDiscountPercentage<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT){
                    return{status: "no_change"};
                }

                const priceChangeAmount=lowestPriceBeforePeak-latestPrice;
                const realDiscountPercentageRounded=Math.round(rawRealDiscountPercentage);

                return{status:"real_discount",priceChangePercent:realDiscountPercentageRounded,priceChangeAmount};
            }

            else{

                const rawFakeIncreasePercentage=((latestPrice-lowestPriceBeforePeak)/lowestPriceBeforePeak)*100;

                if(rawFakeIncreasePercentage<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT){
                    return {status:"no_change"};
                }

                const priceChangeAmount=latestPrice-lowestPriceBeforePeak;
                const fakeIncreasePercentageRounded=Math.round(rawFakeIncreasePercentage);
               
                const discountPercentageRounded=Math.round(rawDiscountPercentage);
                const recentDropAmount=peakPrice-latestPrice;

                return{status:"fake_discount",priceChangePercent:fakeIncreasePercentageRounded,priceChangeAmount,recentDropPercent:discountPercentageRounded,recentDropAmount};
            }
        }
    }
}