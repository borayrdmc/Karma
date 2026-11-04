import { SignUpForm } from "@/components/sign-up/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0c0d0e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),transparent)] p-4 overflow-hidden">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#16171a]/90 p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.12)] backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-[#F4F4F4] text-center">Hesap Oluştur</h1>
        <p className="mt-2 text-sm text-zinc-400 text-center mb-6">
          Karma ile ürün fiyatlarını otomatik takip etmeye başla.
        </p>
        <SignUpForm />
      </div>
    </main>
  );
}