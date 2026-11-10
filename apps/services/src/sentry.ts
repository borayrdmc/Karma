import * as Sentry from "@sentry/node";

export function initSentry(): void {
  Sentry.init({
    dsn:
      process.env.SENTRY_DSN ||
      "https://0d60003e6d132194f2a29d7733d44b47@o4512407980277760.ingest.de.sentry.io/4512408009703504",
    release: process.env.SENTRY_RELEASE || "karma-services@1.0.0",
    environment: process.env.NODE_ENV || "production",
    tracesSampleRate: 0.1,
  });
}

export { Sentry };
