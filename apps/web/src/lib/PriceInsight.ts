import { PriceHistoryOutputType, PriceInsightResultType } from "@repo/types";

const TIME_WINDOW=30;
const FAKE_DISCOUNT_MAX_AGE_DAYS=5;
const MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT=1;
const SHORT_HIKE_MAX_HOURS=24;

//now: kararın hangi ana göre verileceği. Varsayılan şu an; landing demosu geçmiş bir tarihi verebilir.
export function PriceInsight(productPriceHistory: PriceHistoryOutputType[], now:Date=new Date()):PriceInsightResultType{

    const result=calculatePriceInsight(productPriceHistory,now);
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
// %1den küçük değişimleri - gürültüyü görmezden gel
function isWithinThreshold(priceA:number, priceB:number){

    return Math.abs(priceA-priceB)/Math.min(priceA,priceB)*100<MINIMUM_PRICE_CHANGE_THRESHOLD_PERCENT;
}

function calculatePriceInsight(productPriceHistory: PriceHistoryOutputType[], now:Date):PriceInsightResultType{

    if(productPriceHistory.length<2){
        return {status:"insufficient_data"}
    }

    const lastRecordTime=new Date(productPriceHistory.at(-1)?.checkedAt ?? now).getTime(); //Query fiyat kaydının eklenme tarihine göre çalıştığı için bu fonksiyonda son kaydın tarihine göre işlem yapıyor
    const timeWindowStartDate=new Date(lastRecordTime-TIME_WINDOW*24*60*60*1000);

    //Son kayıt 30 günden eskiyse değişim yoktur
    if(now.getTime()-lastRecordTime>TIME_WINDOW*24*60*60*1000){
        return {status:"no_change"};
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
    const latestPrice=Number(latestPriceItem?.price);

    //Son kayıttan %1 farklılık yoksa item atlanır
    let previousPriceItem=pricesInsideTimeWindow.at(-2);

    for(let i=pricesInsideTimeWindow.length-2; i>=0; i--){
        previousPriceItem=pricesInsideTimeWindow[i];

        if(!isWithinThreshold(Number(previousPriceItem?.price),latestPrice)){
            break;
        }
    }

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
            else if(!isWithinThreshold(currentItemPrice,basePrice)){
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
            else if(!isWithinThreshold(currentItemPrice,peakPrice)){
                break;
            }
        }

        const discountPercentage=((peakPrice-latestPrice)/peakPrice*100);

        if(peakIndex===0){

            const priceChangeAmount=peakPrice-latestPrice;

            return {status:"real_discount",priceChangePercent:discountPercentage,priceChangeAmount};
        }

        const peakRecord=pricesInsideTimeWindow[peakIndex];
        
        //Hesaplamalar son fiyat kaydının tarihinden itibaren alınır - Fiyat değiştikçe yeni kayıt açılmasıyla aynı olsun diye
        const discountTime=new Date(latestPriceItem.checkedAt).getTime();
        const peakAgeInDays=peakRecord ? (discountTime - new Date(peakRecord.checkedAt).getTime()) / (1000 * 60 * 60 * 24) : 0;

        if(peakAgeInDays>FAKE_DISCOUNT_MAX_AGE_DAYS){
            const priceChangeAmount=peakPrice-latestPrice;
            return {status:"real_discount",priceChangePercent:discountPercentage,priceChangeAmount};
        }

        else{
            
            let basePriceBeforePeak=Number(pricesInsideTimeWindow[peakIndex-1]?.price);
            let baseRecord=pricesInsideTimeWindow[peakIndex-1];
            let baseIndex=peakIndex-1;

            for(let i=peakIndex-1; i>=0; i--){
                const item=pricesInsideTimeWindow[i];
                const itemPrice=Number(item?.price);
                const itemAgeInDays=item ? (discountTime - new Date(item.checkedAt).getTime()) / (1000 * 60 * 60 * 24) : 0;

                if(itemPrice<=basePriceBeforePeak){
                    basePriceBeforePeak=itemPrice;
                    baseRecord=item;
                    baseIndex=i;
                }
                else if(!isWithinThreshold(itemPrice,basePriceBeforePeak)){
                    break;
                }

                if(itemAgeInDays>FAKE_DISCOUNT_MAX_AGE_DAYS){
                    break;
                }
            }
            

            if(latestPrice<=basePriceBeforePeak){

                //Fiyat zam öncesi fiyatına geri alındıysa : Zam 24 saatten kısa sürdüyse -> Değişim yok / Aksi takdirde indirim
                const hikeStartRecord=pricesInsideTimeWindow[baseIndex+1];
                const hikeDurationInHours=hikeStartRecord ? (new Date(latestPriceItem.checkedAt).getTime() - new Date(hikeStartRecord.checkedAt).getTime()) / (1000 * 60 * 60) : 0;

                if(isWithinThreshold(latestPrice,basePriceBeforePeak) && hikeDurationInHours<SHORT_HIKE_MAX_HOURS){
                    return {status:"no_change"};
                }

                const priceChangeAmount=peakPrice-latestPrice;

                return{status:"real_discount",priceChangePercent:discountPercentage,priceChangeAmount};
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