import { PriceHistoryOutputType, PriceInsightResultType } from "@repo/types";

const TIME_WINDOW=30;
const FAKE_DISCOUNT_MAX_AGE_DAYS=7;
const MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT=1;

export function PriceInsight(productPriceHistory: PriceHistoryOutputType[]):PriceInsightResultType{

    const result=calculatePriceInsight(productPriceHistory);
    const percent=result.priceChangePercent ?? 0;

    if(result.status==="price_increase" || result.status==="real_discount"){
        return percent<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT ? {status:"no_change"} : result;
    }

    if(result.status==="fake_discount"){

        if(percent<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT){
            return {status:"no_change"};
        }

        if((result.recentDropPercent ?? 0)<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT){
            return {status:"price_increase",priceChangePercent:result.priceChangePercent,priceChangeAmount:result.priceChangeAmount};
        }
    }

    return result;
}

function calculatePriceInsight(productPriceHistory: PriceHistoryOutputType[]):PriceInsightResultType{

    const timeWindowStartDate=new Date(Date.now()-TIME_WINDOW*24*60*60*1000);

    if(productPriceHistory.length<2){
        return {status:"insufficient_data"}
    }

    const pricesInsideTimeWindow=productPriceHistory.filter((priceHistoryItem)=>{return new Date(priceHistoryItem.checkedAt)>=timeWindowStartDate});
    const pricesOutsideTimeWindow=productPriceHistory.filter((priceHistoryItem)=>{return new Date(priceHistoryItem.checkedAt)<timeWindowStartDate});

    if(pricesOutsideTimeWindow.length>0){
        const oldestRecord=pricesOutsideTimeWindow.at(-1);

        if(pricesInsideTimeWindow.length===0){
            return {status:"insufficient_data"}
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

        const peakRecord=pricesInsideTimeWindow[peakIndex];
        const peakAgeInDays=peakRecord ? (Date.now() - new Date(peakRecord.checkedAt).getTime()) / (1000 * 60 * 60 * 24) : 0;

        if(peakAgeInDays>FAKE_DISCOUNT_MAX_AGE_DAYS){
            const priceChangeAmount=peakPrice-latestPrice;
            return {status:"real_discount",priceChangePercent:discountPercentage,priceChangeAmount};
        }

        else{
            
            let basePriceBeforePeak=Number(pricesInsideTimeWindow[peakIndex-1]?.price);
            let baseRecord=pricesInsideTimeWindow[peakIndex-1];

            for(let i=peakIndex-1; i>=0; i--){
                const item=pricesInsideTimeWindow[i];
                const itemPrice=Number(item?.price);
                const itemAgeInDays=item ? (Date.now() - new Date(item.checkedAt).getTime()) / (1000 * 60 * 60 * 24) : 0;

                if(itemPrice<=basePriceBeforePeak){
                    basePriceBeforePeak=itemPrice;
                    baseRecord=item;
                }
                else{
                    break;
                }

                if(itemAgeInDays>FAKE_DISCOUNT_MAX_AGE_DAYS){
                    break;
                }
            }
            
            if(latestPrice<=basePriceBeforePeak){

                const realDiscountPercentage=((basePriceBeforePeak-latestPrice)/basePriceBeforePeak)*100;

                const priceChangeAmount=basePriceBeforePeak-latestPrice;

                return{status:"real_discount",priceChangePercent:realDiscountPercentage,priceChangeAmount};
            }

            else{

                const realIncreasePercentage=((latestPrice-basePriceBeforePeak)/basePriceBeforePeak)*100;

                const priceChangeAmount=latestPrice-basePriceBeforePeak;
               
                const recentDropAmount=peakPrice-latestPrice;

                return{
                    status:"fake_discount",
                    priceChangePercent:realIncreasePercentage,
                    priceChangeAmount,
                    recentDropPercent:discountPercentage,
                    recentDropAmount,
                    basePrice:basePriceBeforePeak,
                    baseDate:baseRecord?.checkedAt,
                    peakPrice,
                    peakDate:peakRecord?.checkedAt,
                };
            }
        }
    }
}