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

export function formatPrice(price:number|string){

    const numericPrice=Number(price);

    if(isNaN(numericPrice)){
        return "HATA";
    }

    return(
        new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numericPrice) + " TL"
    );
}