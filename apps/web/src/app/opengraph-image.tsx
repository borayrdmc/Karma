import { ImageResponse } from "next/og";

export const alt="Karma · İndirim gerçek mi, yoksa öncesinde zam mı yapıldı?";
export const size={
    width:1200,
    height:630,
};
export const contentType="image/png";

const GOOGLE_FONTS_CSS_URL="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700";
const LEGACY_SAFARI_UA="Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

type FontWeight=400|500|600|700;

async function loadPlusJakartaFonts(){
    try{
        const cssResponse=await fetch(GOOGLE_FONTS_CSS_URL,{
            headers:{"User-Agent":LEGACY_SAFARI_UA},
        });
        if(!cssResponse.ok) return undefined;
        const css=await cssResponse.text();

        const weights:FontWeight[]=[400,500,600,700];
        const fonts=await Promise.all(
            weights.map(async(weight)=>{
                const regex=new RegExp(`font-weight:\\s*${weight};[\\s\\S]*?src:\\s*url\\(([^)]+)\\)`);
                const match=css.match(regex);
                if(!match?.[1]) return null;
                const fontResponse=await fetch(match[1]);
                if(!fontResponse.ok) return null;
                const data=await fontResponse.arrayBuffer();
                return{
                    name:"Plus Jakarta Sans",
                    data,
                    style:"normal" as const,
                    weight,
                };
            })
        );

        const validFonts=fonts.filter((font):font is NonNullable<typeof font>=>font!==null);
        return validFonts.length>0 ? validFonts : undefined;
    }catch{
        return undefined;
    }
}

export default async function Image(){
    const fonts=await loadPlusJakartaFonts();

    return new ImageResponse(
        (
            <div
                style={{
                    width:"100%",
                    height:"100%",
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"space-between",
                    padding:"64px 68px",
                    backgroundColor:"#0c0d0e",
                    backgroundImage:"radial-gradient(ellipse 80% 65% at 50% -15%, rgba(16,185,129,0.22), transparent)",
                    color:"#F4F4F4",
                    fontFamily:"Plus Jakarta Sans",
                }}
            >
                <div style={{ display:"flex",alignItems:"center",gap:"20px" }}>
                    <div
                        style={{
                            display:"flex",
                            width:"74px",
                            height:"74px",
                            alignItems:"center",
                            justifyContent:"center",
                            borderRadius:"22px",
                            border:"2px solid rgba(16,185,129,0.35)",
                            backgroundColor:"rgba(16,185,129,0.10)",
                            boxShadow:"0 0 40px -6px rgba(16,185,129,0.35)",
                        }}
                    >
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                            <path d="M6.5 4.9v14.2" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M6.7 13L16.5 5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.2 4.65L16.5 5l-.35 3.3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.4 10L17.5 19" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14.2 18.65L17.5 19l.35-3.3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span style={{ fontSize:"34px",fontWeight:700,letterSpacing:"-0.025em" }}>
                        Karma
                    </span>
                    <span
                        style={{
                            display:"flex",
                            alignItems:"center",
                            borderRadius:"12px",
                            border:"2px solid #27272a",
                            backgroundColor:"#18181b",
                            padding:"4px 16px",
                            fontSize:"22px",
                            color:"#a1a1aa",
                            fontWeight:500,
                            letterSpacing:"0.02em",
                        }}
                    >
                        Beta
                    </span>
                </div>

                <div style={{ display:"flex",flexDirection:"column",gap:"24px",marginTop:"8px",marginBottom:"8px" }}>
                    <div
                        style={{
                            display:"flex",
                            flexDirection:"column",
                            fontSize:"64px",
                            fontWeight:700,
                            letterSpacing:"-0.025em",
                            lineHeight:1.15,
                        }}
                    >
                        <div style={{ display:"flex" }}>
                            <span>İndirim</span>
                            <span style={{ color:"#34d399",marginLeft:"15px" }}>gerçek mi</span>
                            <span style={{ marginLeft:"-2px" }}>, yoksa</span>
                        </div>
                        <div>öncesinde zam mı yapıldı?</div>
                    </div>
                    <div
                        style={{
                            display:"flex",
                            flexDirection:"column",
                            fontSize:"29px",
                            fontWeight:400,
                            color:"#a1a1aa",
                            lineHeight:1.55,
                        }}
                    >
                        <div>Ürün linkini yapıştır, fiyat geçmişini grafikle takip et</div>
                        <div>ve sahte indirimleri tek bakışta yakala.</div>
                    </div>
                </div>

                <div
                    style={{
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"space-between",
                        paddingTop:"26px",
                        borderTop:"2px solid rgba(39,39,42,0.85)",
                        fontSize:"26px",
                    }}
                >
                    <span style={{ color:"#d4d4d8",fontWeight:500 }}>
                        Hepsiburada ve Trendyol ürünlerini tek bir yerden takip et!
                    </span>
                    <div style={{ display:"flex",alignItems:"center",gap:"10px",color:"#34d399",fontWeight:600 }}>
                        <span>Hemen kayıt ol</span>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="m12 5 7 7-7 7" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts,
        }
    );
}
