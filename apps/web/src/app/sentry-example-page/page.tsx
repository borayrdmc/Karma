"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryExamplePage() {
  const [clientStatus, setClientStatus] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [loadingServer, setLoadingServer] = useState(false);

  const handleTriggerClientError = () => {
    try {
      Sentry.captureException(new Error("Karma İstemci Tarafı Sentry Testi (Client-side)"));
      setClientStatus("✅ İstemci hatası gönderildi! (Sentry Issues sekmesine bakın)");
    } catch (err) {
      setClientStatus("❌ Hata yakalanamadı: " + String(err));
    }

    setTimeout(() => {
      throw new Error("Karma Unhandled Client Error - Sentry Otomatik Yakaladı!");
    }, 50);
  };

  const handleTriggerServerError = async () => {
    setLoadingServer(true);
    setServerStatus(null);
    try {
      const res = await fetch("/api/sentry-test");
      const data = await res.json();
      if (data.success) {
        setServerStatus("✅ Sunucu hatası başarıyla üretildi ve Sentry'ye gönderildi!");
      } else {
        setServerStatus("❌ Sunucu hatası başarısız oldu.");
      }
    } catch (err) {
      setServerStatus("❌ İstek atılırken hata oluştu: " + String(err));
    } finally {
      setLoadingServer(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-950 text-white">
      <div className="max-w-lg w-full p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center shadow-2xl backdrop-blur-sm">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
          ⚡
        </div>
        <h1 className="text-xl font-bold text-zinc-100 mb-2">Sentry Canlı Doğrulama Paneli</h1>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Sentry entegrasyonunu doğrulamak için hem istemci (tarayıcı) hem de sunucu (Next.js Node) tarafından izole test hatası gönderebilirsin.
        </p>

        <div className="space-y-4">
          <div>
            <button
              onClick={handleTriggerServerError}
              disabled={loadingServer}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              {loadingServer ? "Gönderiliyor..." : "1. Sunucu (Server) Hatası Fırlat 🚀 (Garantili)"}
            </button>
            <p className="text-xs text-zinc-500 mt-1">
              Reklam engelleyici veya tarayıcı eklentilerinden kesinlikle etkilenmez.
            </p>
            {serverStatus && (
              <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {serverStatus}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800/80">
            <button
              onClick={handleTriggerClientError}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/20 cursor-pointer"
            >
              2. İstemci (Browser) Hatası Fırlat 💥
            </button>
            <p className="text-xs text-zinc-500 mt-1">
              Tarayıcındaki Adblock/uBlock açıksa doğrudan gönderimi engelleyebilir.
            </p>
            {clientStatus && (
              <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {clientStatus}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs text-left">
          💡 <strong>İpucu:</strong> Test butonuna bastıktan sonra Sentry Issues sayfasını <code>F5</code> ile yenileyebilirsin.
        </div>
      </div>
    </div>
  );
}
