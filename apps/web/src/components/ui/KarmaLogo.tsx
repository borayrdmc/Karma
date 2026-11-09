interface KarmaLogoProps{
    className?:string;
}

export function KarmaLogo({className="size-4"}:KarmaLogoProps){
    return(
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
            <path d="M6.5 4.9v14.2" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M6.7 13L16.5 5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.2 4.65L16.5 5l-.35 3.3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.4 10L17.5 19" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.2 18.65L17.5 19l.35-3.3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
