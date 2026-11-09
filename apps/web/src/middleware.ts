import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest){

    const sessionCookie=getSessionCookie(request);
    const {pathname}=request.nextUrl;

    const isProtectedPath=pathname.startsWith("/dashboard") || pathname.startsWith("/api/products");
    const isAuthPage=pathname.startsWith("/signin") || pathname.startsWith("/signup");

    if(isAuthPage && sessionCookie){
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if(isProtectedPath && !sessionCookie){

        if(pathname.startsWith("/api")){

            return NextResponse.json(
                {success:false,error:"Yetkisiz erişim."},
                {status:401}
            )
        }

        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/products/:path*", "/signin", "/signup"],
};