import z from "zod";

export const resetPasswordValidationSchema=z
    .object({
        password:z.string().min(8,"Şifre en az 8 karakter uzunluğunda olmalı."),
        confirmPassword:z.string().min(1,"Şifre tekrarı boş bırakılamaz."),
    })
    .refine((data)=>data.password===data.confirmPassword,{
        message:"Şifreler eşleşmiyor.",
        path:["confirmPassword"],
    });
