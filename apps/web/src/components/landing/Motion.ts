import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

// Landing'in ortak hareket dili. CSS karşılıkları globals.css'te: --ease-out-strong ve --ease-in-out-strong.
// Giriş ve beliriş: EASE_OUT. Ekranda yer değiştiren ya da uzayan hareket: EASE_IN_OUT.
// Zaman ekseninde çizilen fiyat çizgileri: EASE_TIME (doğrusal). Eksen zamanı gösterdiği için zaman eşit akar
// ve noktalar, çizginin onlara vardığı ana basit oranla yerleştirilir.
CustomEase.create("karma-out","0.23,1,0.32,1");
CustomEase.create("karma-in-out","0.77,0,0.175,1");

export const EASE_OUT="karma-out";
export const EASE_IN_OUT="karma-in-out";
export const EASE_TIME="none";
