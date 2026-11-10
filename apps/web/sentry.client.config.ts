import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://0d60003e6d132194f2a29d7733d44b47@o4512407980277760.ingest.de.sentry.io/4512408009703504",
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || "karma-web@1.0.0",
  environment: process.env.NODE_ENV || "production",
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
