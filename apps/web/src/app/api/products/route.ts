import { auth, trackProductValidationSchema, untrackProductValidationSchema } from "@/lib";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request:Request){

    const session=await auth.api.getSession({headers:await headers()});

    if(!session){
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }

    try{
        const requestJson=await request.json();

        const parsedRequest=trackProductValidationSchema.safeParse(requestJson);

        if(!parsedRequest.success){

            const parsedRequestError=z.flattenError(parsedRequest.error);

            return NextResponse.json({success:false,error:parsedRequestError},{status: 400});
        }

        const response=await fetch("http://localhost:3001/api/products",{

            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "x-internal-api-key":process.env.INTERNAL_API_KEY!,
                "x-user-id":session.user.id
            },
            body:JSON.stringify({productUrl:parsedRequest.data.productUrl})
        })

        const data=await response.json();

        return NextResponse.json(data,{status:response.status});
    }
    catch(routeError){
        
        if(routeError instanceof SyntaxError){
            return NextResponse.json({success:false,error:"Invalid JSON body format."},{status:400})
        }
        else{
            return NextResponse.json({success:false,error:"Route unable to answer. Please try again"},{status:500})
        }
    }
}

export async function DELETE(request:Request){

    const session=await auth.api.getSession({headers: await headers()})

    if(!session){
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }

    try{
        const requestJson=await request.json();
        const parsedRequest=untrackProductValidationSchema.safeParse(requestJson);

        if(!parsedRequest.success){

            const parsedRequestError=z.flattenError(parsedRequest.error);
            
            return NextResponse.json({success:false,error:parsedRequestError},{status: 400});
        }

        const response=await fetch(`http://localhost:3001/api/products/${parsedRequest.data.productId}`,{

            method:"DELETE",
            headers:{
                "x-internal-api-key":process.env.INTERNAL_API_KEY!,
                "x-user-id":session.user.id
            },
        });

        const data=await response.json();
        return NextResponse.json(data,{status:response.status});
    }
    catch(routeError){
        
        if(routeError instanceof SyntaxError){
            return NextResponse.json({success:false,error:"Invalid JSON body format."},{status:400})
        }
        else{
            return NextResponse.json({success:false,error:"Route unable to answer. Please try again"},{status:500})
        }
    }
}

export async function GET(request:Request){

    const session=await auth.api.getSession({headers:await headers()});

    if(!session){
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }
    
    const response = await fetch("http://localhost:3001/api/products",{

        method:"GET",
        headers:{
            "x-internal-api-key":process.env.INTERNAL_API_KEY!,
            "x-user-id":session.user.id
        }
    })

    const data=await response.json();
    return NextResponse.json(data,{status:response.status});
}