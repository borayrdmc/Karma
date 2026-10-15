interface SignUpButtonProps{
    isLoading:boolean;
}

export function SignUpButton({isLoading}:SignUpButtonProps){

    return(
        
        <button
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer" 
        >
            {isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol!"}
        </button>
    )
}