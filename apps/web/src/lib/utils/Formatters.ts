export function formatTime(checkedAt:Date|string){

    const targetDate=new Date(checkedAt);

    const now=new Date();

    const diffInSeconds = Math.floor((now.getTime()-targetDate.getTime())/1000);

    if(isNaN(diffInSeconds) || diffInSeconds<0 || diffInSeconds<60) {
        return "Az önce";
    }

    const diffInMinutes=Math.floor(diffInSeconds/60);
    if(diffInMinutes<60){
        return `${diffInMinutes} dakika önce`;
    }

    const diffInHours=Math.floor(diffInMinutes/60);
    if(diffInHours<24){
        return `${diffInHours} saat önce`;
    }

    const diffInDays=Math.floor(diffInHours/24);
    if(diffInDays<30){
        return `${diffInDays} gün önce`;
    }
    return targetDate.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: targetDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

export function formatPriceValue(price:number|string){

    const numericPrice=Number(price);

    if(isNaN(numericPrice)){
        return "HATA";
    }

    const fractionDigits=Number.isInteger(numericPrice) ? 0 : 2;

    return(
        new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(numericPrice)
    );
}

export function formatPrice(price:number|string){

    const formattedValue=formatPriceValue(price);

    return formattedValue==="HATA" ? formattedValue : `${formattedValue} TL`;
}

// Mutlak tarih ve saat ("28 Ekim 2026, 14:00"). Sunucu ve istemci aynı çıktıyı üretsin diye saat dilimi sabit.
export function formatDateTime(checkedAt:Date|string, withTime:boolean=true){

    return new Date(checkedAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: withTime ? "2-digit" : undefined,
        minute: withTime ? "2-digit" : undefined,
        timeZone: "Europe/Istanbul",
    });
}
