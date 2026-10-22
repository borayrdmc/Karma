"use client"

import { authClient } from "@/lib";
import { signInValidationSchema } from "@/lib/validations/SignInValidationSchema";
import { useState } from "react";
import z from "zod";
import { SignInButton } from "./SignInButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginFieldErrors{
  email?: string[];
  password?: string[];
}

export function SignInForm(){

    const [isLoading,setIsLoading]=useState(false);
    const [fieldErrors, setFieldErrors]=useState<LoginFieldErrors>({});
    const [serverError,setServerError]=useState("");
    const router = useRouter();

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){

        e.preventDefault();
        setFieldErrors({});
        setServerError("");
        
        const rawFormData=new FormData(e.currentTarget);
        const formDataObject=Object.fromEntries(rawFormData);

        const parsedFormData=signInValidationSchema.safeParse(formDataObject);

        if(!parsedFormData.success){
            const fieldErrors=z.flattenError(parsedFormData.error).fieldErrors;
            setFieldErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        const {email,password}=parsedFormData.data;
        
        try{
        
            const res=await authClient.signIn.email({email,password});

            if(res.error){
                setServerError(res.error.message || "Giriş yaparken hata oluştu. Tekrar deneyiniz.")
            } 
            else{
                console.log("Giriş Başarılı! Kullanıcı Verisi:", res.data);
                router.push("/dashboard");
            }
        } 
        catch{
            setServerError("Beklenmeyen hata.")
        } 
        finally{
            setIsLoading(false);
        }
    }


    return(
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        
            {
                //react toast error for serverside errors maybe?
            }
            
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-300 ml-0.5">E-Mail</label>
                <input
                    name="email"
                    type="email"
                    placeholder="ornek@mail.com"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                />
                {fieldErrors.email && <div className="text-xs text-rose-400 mt-0.5 ml-0.5">{fieldErrors.email[0]}</div>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-300 ml-0.5">Şifre</label>
                <input 
                    name="password"
                    type="password"
                    placeholder="********"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                />
                {fieldErrors.password && <div className="text-xs text-rose-400 mt-0.5 ml-0.5">{fieldErrors.password[0]}</div>}
            </div>

            <div className="flex flex-col gap-1">
                <SignInButton isLoading={isLoading} />
                <div className="text-center text-xs text-zinc-400 mt-1">Hesabın yok mu? <span><Link href="/signup" className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors ml-0.5">Kayıt Ol!</Link></span></div>
            </div>

            {serverError && 
                <div className="rounded-xl bg-rose-950/30 p-2.5 text-xs text-rose-300 border border-rose-900/50">
                    {serverError}
                </div>
            }
            
        </form>
    )
}