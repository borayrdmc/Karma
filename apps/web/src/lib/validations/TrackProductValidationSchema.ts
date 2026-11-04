import z from "zod";

export const trackProductValidationSchema=z.object({
    productUrl: z.url({
        protocol: /^https$/,
        hostname: /^(www\.)?(trendyol|hepsiburada)\.com$/i,
        error: "Geçerli bir Trendyol veya Hepsiburada ürün linki giriniz."
    }),
    customName: z.string().trim().max(50, "Özel isim en fazla 50 karakter olabilir.").optional()
});
