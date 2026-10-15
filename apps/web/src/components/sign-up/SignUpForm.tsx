"use client"

import { authClient, signUpFormValidationSchema } from "@/lib";
import { useState } from "react";
import z from "zod";
import { SignUpButton } from "./SignupButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignUpFieldErrors{
  name?: string[];
  email?: string[];
  password?: string[];
}

export function SignUpForm(){

    const [isLoading,setIsLoading]=useState(false);
    const [fieldErrors, setFieldErrors]=useState<SignUpFieldErrors>({});
    const [serverError,setServerError]=useState("");
    const router=useRouter()

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){

        e.preventDefault();

        const rawFormData=new FormData(e.currentTarget);
        const formDataObject=Object.fromEntries(rawFormData);

        const parsedFormData=signUpFormValidationSchema.safeParse(formDataObject);

        if(!parsedFormData.success){
            const fieldErrors=z.flattenError(parsedFormData.error).fieldErrors;
            setFieldErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        const {name,email,password}=parsedFormData.data;

        try{

            const res=await authClient.signUp.email({name,email,password});

            if(res.error){
                setServerError(res.error.message || "Kayıt olunurken hata oluştu. Tekrar deneyiniz.")
            } 
            else{
                console.log("Kayıt Başarılı! Kullanıcı Verisi:", res.data);
                router.push("/signin");
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
                <label>İsim</label>
                <input 
                    name="name"
                    type="text"
                    placeholder="İsim Soyisim"
                    className="rounded-md border-2 px-1 py-1"
                />
                {fieldErrors.name && <div className="text-sm text-red-500">{fieldErrors.name[0]}</div>}
            </div>
            
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
                <SignUpButton isLoading={isLoading} />
                <div className="text-center">Hesabın var mı? <span><Link href="/signin" className="cursor-pointer text-blue-700">Giriş Yap!</Link></span></div>
            </div>

            {serverError && 
                <div className="rounded-md bg-red-50 p-2.5 text-sm text-red-600 border border-red-200">
                    {serverError}
                </div>
            }
            
        </form>
    )
}