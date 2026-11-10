"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryExamplePage() {
  const [sent, setSent] = useState(false);

  const handleTriggerError = () => {
    // Sentry SDK üzerinden doğrudan exception yakalayıp gönderelim
    Sentry.captureException(new Error("Karma Canlı Sentry Test Hatası - Tebrikler Sentry Çalışıyor!"));
    setSent(true);

    // Aynı zamanda unhandled exception olarak da tarayıcı akışına fırlatalım
    setTimeout(() => {
      throw new Error("Karma Konsol Test Hatası (Unhandled) - Sentry Otomatik Yakaladı!");
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-950 text-white">
      <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center shadow-2xl backdrop-blur-sm">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
          ⚡
        </div>
        <h1 className="text-xl font-bold text-zinc-100 mb-2">Sentry Canlı Doğrulama Testi</h1>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Bu butona tıkladığında Sentry hesabına gerçek zamanlı bir test hatası ve oturum verisi gönderilecektir.
        </p>

        <button
          onClick={handleTriggerError}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/20 cursor-pointer"
        >
          Sentry Test Hatası Fırlat! 💥
        </button>

        {sent && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            ✅ Test hatası Sentry&apos;ye başarıyla gönderildi! Sentry panelindeki <strong>Issues</strong> sekmesine birkaç saniye içinde düşecektir.
          </div>
        )}
      </div>
    </div>
  );
}
