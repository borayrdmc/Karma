import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user, session, account, verification } from "@repo/db";
import { sendResetPasswordEmail } from "./SendResetPasswordEmail";

export const auth=betterAuth({
    database:drizzleAdapter(db,{
        provider:"pg",
        schema:{ user, session, account, verification },
    }),
    emailAndPassword:{
        enabled:true,
        revokeSessionsOnPasswordReset:true,
        sendResetPassword:async({user,url})=>{
            await sendResetPasswordEmail({
                email:user.email,
                name:user.name,
                url,
            });
        },
    },
    session:{
        cookieCache:{
            enabled:true,
            maxAge:60*5,
        },
    },
    secret:process.env.BETTER_AUTH_SECRET,
    baseURL:process.env.BETTER_AUTH_URL,
});
