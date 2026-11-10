import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const testError = new Error("Karma Sunucu Tarafı Sentry Testi (Server-side)");
  Sentry.captureException(testError);

  // Sentry'ye gönderimin tamamlanması için kısa bir bekleme
  await Sentry.flush(2000);

  return NextResponse.json({
    success: true,
    message: "Sunucu tarafı test hatası Sentry'ye başarıyla iletildi!",
  });
}
