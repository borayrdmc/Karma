import z from "zod";

export const forgotPasswordValidationSchema = z.object({
    email: z.email("Geçerli bir mail adresi girmelisiniz."),
});
