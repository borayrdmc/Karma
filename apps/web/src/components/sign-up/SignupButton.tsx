interface SignUpButtonProps{
    isLoading:boolean;
}

export function SignUpButton({isLoading}:SignUpButtonProps){

    return(
        
        <button
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all duration-200 cursor-pointer active:scale-[0.99]" 
        >
            {isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol!"}
        </button>
    )
}