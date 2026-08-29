import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const account=pgTable("account",{

    id:text("id").primaryKey(),
    userId:text("user_id").notNull().references(()=>user.id,{onDelete:"cascade"}),

    providerId:text("provider_id").notNull(), //Login method : password+email=credential , google or github
    accountId:text("account_id").notNull(), //ID for login, google ID for google login or email for credential login
    password:text("password"),

    //OAUTH
    accessToken: text("access_token"), //Google API access token
    refreshToken: text("refresh_token"), //Google API access refresh token
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),//Permission list for google, github etc.

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})