import z from "zod";

export const untrackProductValidationSchema=z.object({
    productId: z.uuid()
})