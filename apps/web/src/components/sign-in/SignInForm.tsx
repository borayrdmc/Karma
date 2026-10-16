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
                <label>E-Mail</label>
                <input
                    name="email"
                    type="email"
                    placeholder="ornek@mail.com"
                    className="rounded-md border-2 px-1 py-1"
                />
                {fieldErrors.email && <div className="text-sm text-red-500">{fieldErrors.email[0]}</div>}
            </div>

            <div className="flex flex-col gap-1">
                <label>Şifre</label>
                <input 
                    name="password"
                    type="password"
                    placeholder="********"
                    className="rounded-md border-2 px-1 py-1"
                />
                {fieldErrors.password && <div className="text-sm text-red-500">{fieldErrors.password[0]}</div>}
            </div>

            <div className="flex flex-col gap-1">
                <SignInButton isLoading={isLoading} />
                <div className="text-center">Hesabın yok mu? <span><Link href="/signup" className="cursor-pointer text-blue-700">Kayıt Ol!</Link></span></div>
            </div>

            {serverError && 
                <div className="rounded-md bg-red-50 p-2.5 text-sm text-red-600 border border-red-200">
                    {serverError}
                </div>
            }
            
        </form>
    )
}