import z from "zod";

export const signUpFormValidationSchema=z.object({
    name:z.string().min(3,"İsim en az 2 karakter uzunluğunda olmalı."),
    email:z.email("Geçerli bir mail adresi girmelisiniz."),
    password:z.string().min(8,"Şifre en az 8 karakter uzunluğunda olmalı")
})