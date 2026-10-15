import { SignUpForm } from "@/components/sign-up/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Hesap Oluştur</h1>
        <p className="mt-2 text-sm text-gray-600 text-center mb-6">
          Karma ile ürün fiyatlarını otomatik takip etmeye başla.
        </p>
        <SignUpForm />
      </div>
    </main>
  );
}