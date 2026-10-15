import { SignInForm } from "@/components/sign-in/SignInForm";

export default function SignInPage(){
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Giriş Yap</h1>
        <p className="mt-2 text-sm text-gray-600 text-center mb-6">
          Kaldığın yerden devam et.
        </p>
        <SignInForm />
      </div>
    </main>
  );
}