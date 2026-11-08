"use client"

import { authClient, resetPasswordValidationSchema, getAuthError } from "@/lib";
import { useState, useRef, useEffect } from "react";
import z from "zod";
import { ResetPasswordButton } from "./ResetPasswordButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFieldErrors{
  password?: string[];
  confirmPassword?: string[];
}

interface ResetPasswordFormProps{
  token?: string;
  error?: string;
}

export function ResetPasswordForm({token,error}:ResetPasswordFormProps){

    const [isLoading,setIsLoading]=useState(false);
    const [isSuccess,setIsSuccess]=useState(false);
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const [fieldErrors,setFieldErrors]=useState<ResetPasswordFieldErrors>({});
    const [serverError,setServerError]=useState("");

    const router=useRouter();

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(!isSuccess){
            return;
        }
        const timer=setTimeout(()=>{
            router.push("/signin");
        },1800);
        return ()=>clearTimeout(timer);
    },[isSuccess,router]);

    if(!token || error){

        return(
            
            <div className="flex flex-col gap-4 w-full">
                <div className="rounded-xl bg-rose-950/30 p-3.5 text-xs leading-relaxed text-rose-300 border border-rose-900/50">
                    Sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama bağlantısı isteyin.
                </div>

                <div className="flex flex-col gap-1">
                    <Link
                        href="/forgot-password"
                        className="w-full text-center rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                    >
                        Yeni Bağlantı İste
                    </Link>
                    <div className="text-center text-xs text-zinc-400 mt-1">
                        <span>
                            <Link href="/signin" className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
                                Giriş sayfasına dön
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){
        e.preventDefault();
        setFieldErrors({});
        setServerError("");

        const rawFormData=new FormData(e.currentTarget);
        const formDataObject=Object.fromEntries(rawFormData);

        const parsedFormData=resetPasswordValidationSchema.safeParse(formDataObject);

        if(!parsedFormData.success){
            const errors=z.flattenError(parsedFormData.error).fieldErrors;
            setFieldErrors(errors);

            if(errors.password){
                passwordInputRef.current?.focus();
            }
            else if(errors.confirmPassword){
                confirmPasswordInputRef.current?.focus();
            }
            return;
        }

        setIsLoading(true);
        const {password}=parsedFormData.data;

        try{
            const res=await authClient.resetPassword({
                newPassword:password,
                token,
            });

            if(res.error){
                setServerError(getAuthError(res.error.code, "Şifre güncellenirken hata oluştu. Tekrar deneyiniz."));
                passwordInputRef.current?.focus();
            }
            else{
                setIsSuccess(true);
            }
        }
        catch{
            setServerError("Beklenmeyen hata.");
        }
        finally{
            setIsLoading(false);
        }
    }

    if(isSuccess){
        return(
            <div className="flex flex-col gap-4 w-full">
                <div className="rounded-xl bg-emerald-950/30 p-3.5 text-xs leading-relaxed text-emerald-300 border border-emerald-900/50">
                    Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...
                </div>

                <Link
                    href="/signin"
                    className="w-full text-center rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                    Hemen Giriş Yap
                </Link>
            </div>
        )
    }

    return(
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs font-medium text-zinc-300 ml-0.5">Yeni Şifre</label>
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
                        onClick={()=>setShowPassword((prev)=>!prev)}
                        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer transition-colors p-1"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                {fieldErrors.password && (
                    <div className="text-xs text-rose-400 mt-0.5 ml-0.5">
                        {fieldErrors.password[0]}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-zinc-300 ml-0.5">Yeni Şifre (Tekrar)</label>
                <div className="relative">
                    <input
                        ref={confirmPasswordInputRef}
                        name="confirmPassword"
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="********"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-3.5 pr-10 py-2 text-sm text-[#F4F4F4] placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-150"
                    />
                    <button
                        type="button"
                        onClick={()=>setShowConfirmPassword((prev)=>!prev)}
                        aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer transition-colors p-1"
                    >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                {fieldErrors.confirmPassword && (
                    <div className="text-xs text-rose-400 mt-0.5 ml-0.5">
                        {fieldErrors.confirmPassword[0]}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <ResetPasswordButton isLoading={isLoading} />
                <div className="text-center text-xs text-zinc-400 mt-1">
                    <span>
                        <Link href="/signin" className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
                            Giriş sayfasına dön
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
