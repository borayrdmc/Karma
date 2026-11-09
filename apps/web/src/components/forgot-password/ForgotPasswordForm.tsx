"use client"

import { authClient, forgotPasswordValidationSchema, getAuthError } from "@/lib";
import { useState, useRef } from "react";
import z from "zod";
import { ForgotPasswordButton } from "./ForgotPasswordButton";
import Link from "next/link";

interface ForgotPasswordFieldErrors{
  email?: string[];
}

export function ForgotPasswordForm(){

    const [isLoading,setIsLoading]=useState(false);
    const [isSent,setIsSent]=useState(false);
    const [fieldErrors,setFieldErrors]=useState<ForgotPasswordFieldErrors>({});
    const [serverError,setServerError]=useState("");

    const emailInputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){

        e.preventDefault();
        setFieldErrors({});
        setServerError("");

        const rawFormData=new FormData(e.currentTarget);
        const formDataObject=Object.fromEntries(rawFormData);

        const parsedFormData=forgotPasswordValidationSchema.safeParse(formDataObject);

        if(!parsedFormData.success){
            
            const errors=z.flattenError(parsedFormData.error).fieldErrors;
            setFieldErrors(errors);

            if(errors.email){
                emailInputRef.current?.focus();
            }
            return;
        }

        setIsLoading(true);
        const {email}=parsedFormData.data;

        try{
            const res=await authClient.requestPasswordReset({
                email,
                redirectTo:"/reset-password",
            });

            if(res.error){
                setServerError(getAuthError(res.error.code, "Sıfırlama bağlantısı gönderilirken hata oluştu. Tekrar deneyiniz."));
                emailInputRef.current?.focus();
            }
            else{
                setIsSent(true);
            }
        }
        catch{
            setServerError("Beklenmeyen hata.");
        }
        finally{
            setIsLoading(false);
        }
    }

    if(isSent){

        return(
            <div className="flex flex-col gap-4 w-full">
                <div className="rounded-xl bg-emerald-950/30 p-3.5 text-xs leading-relaxed text-emerald-300 border border-emerald-900/50">
                    Bu e-posta adresine kayıtlı bir hesap varsa şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu (ve gereksiz/spam klasörünüzü) kontrol edin.
                </div>

                <Link
                    href="/signin"
                    className="w-full text-center rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                    Giriş Sayfasına Dön
                </Link>
            </div>
        )
    }

    return(
        
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-medium text-zinc-300 ml-0.5">E-Posta</label>
                <input
                    ref={emailInputRef}
                    name="email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ornek@mail.com"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                />
                {fieldErrors.email && (
                    <div className="text-xs text-rose-400 mt-0.5 ml-0.5">
                        {fieldErrors.email[0]}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <ForgotPasswordButton isLoading={isLoading} />
                <div className="text-center text-xs text-zinc-400 mt-1">
                    Şifreni hatırladın mı?{" "}
                    <span>
                        <Link href="/signin" className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors ml-0.5">
                            Giriş Yap!
                        </Link>
                    </span>
                </div>
            </div>

            {serverError && (
                <div className="rounded-xl bg-rose-950/30 p-2.5 text-xs text-rose-300 border border-rose-900/50">
                    {serverError}
                </div>
            )}
        </form>
    )
}
