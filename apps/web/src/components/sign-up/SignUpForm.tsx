"use client"

import { authClient, signUpFormValidationSchema } from "@/lib";
import { useState, useRef } from "react";
import z from "zod";
import { SignUpButton } from "./SignupButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { getAuthError } from "@/lib/auth/GetAuthError";

interface SignUpFieldErrors{
  name?: string[];
  email?: string[];
  password?: string[];
}

export function SignUpForm(){

    const [isLoading,setIsLoading]=useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors]=useState<SignUpFieldErrors>({});
    const [serverError,setServerError]=useState("");
    const router=useRouter();

    const nameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){

        e.preventDefault();
        setFieldErrors({});
        setServerError("");

        const rawFormData=new FormData(e.currentTarget);
        const formDataObject=Object.fromEntries(rawFormData);

        const parsedFormData=signUpFormValidationSchema.safeParse(formDataObject);

        if(!parsedFormData.success){
            const fieldErrors=z.flattenError(parsedFormData.error).fieldErrors;
            setFieldErrors(fieldErrors);

            if(fieldErrors.name){
                nameInputRef.current?.focus();
            } 
            else if(fieldErrors.email){
                emailInputRef.current?.focus();
            } 
            else if(fieldErrors.password){
                passwordInputRef.current?.focus();
            }
            return;
        }

        setIsLoading(true);
        const {name,email,password}=parsedFormData.data;

        try{

            const res=await authClient.signUp.email({name,email,password});

            if(res.error){
                setServerError(getAuthError(res.error.code, "Kayıt olunurken hata oluştu. Tekrar deneyiniz."));
            } 
            else{
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

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-xs font-medium text-zinc-300 ml-1">İsim</label>
                <input 
                    ref={nameInputRef}
                    name="name"
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="İsim Soyisim"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                />
                {fieldErrors.name && <div className="text-xs text-rose-400 mt-0.5 ml-0.5">{fieldErrors.name[0]}</div>}
            </div>
            
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-medium text-zinc-300 ml-1">E-Posta</label>
                <input
                    ref={emailInputRef}
                    name="email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ornek@mail.com"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                />
                {fieldErrors.email && <div className="text-xs text-rose-400 mt-0.5 ml-0.5">{fieldErrors.email[0]}</div>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs font-medium text-zinc-300 ml-1">Şifre</label>
                <div className="relative">
                    <input 
                        ref={passwordInputRef}
                        name="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="********"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-3.5 pr-10 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer transition-colors p-1"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                {fieldErrors.password && <div className="text-xs text-rose-400 mt-0.5 ml-0.5">{fieldErrors.password[0]}</div>}
            </div>

            <div className="flex flex-col gap-1">
                <SignUpButton isLoading={isLoading} />
                <div className="text-center text-xs text-zinc-400 mt-1">Hesabın var mı? <span><Link href="/signin" className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors ml-0.5">Giriş Yap!</Link></span></div>
            </div>

            {serverError && 
                <div className="rounded-xl bg-rose-950/30 p-2.5 text-xs text-rose-300 border border-rose-900/50">
                    {serverError}
                </div>
            }
            
        </form>
    )
}