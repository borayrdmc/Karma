import z from "zod";

export const signInValidationSchema=z.object({
    email:z.email("Geçerli bir mail adresi girmelisiniz."),
    password:z.string().min(1, "Şifre boş bırakılamaz.")
})