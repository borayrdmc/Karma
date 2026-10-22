import { SignInForm } from "@/components/sign-in/SignInForm";

export default function SignInPage(){
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0c0d0e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),transparent)] p-4 overflow-hidden">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#16171a]/90 p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)] backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-[#F4F4F4] text-center">Giriş Yap</h1>
        <p className="mt-2 text-sm text-zinc-400 text-center mb-6">
          Kaldığın yerden devam et.
        </p>
        <SignInForm />
      </div>
    </main>
  );
}