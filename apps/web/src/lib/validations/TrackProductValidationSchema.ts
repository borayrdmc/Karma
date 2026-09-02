import z from "zod";

export const trackProductValidationSchema=z.object({
    productUrl: z.url()
});