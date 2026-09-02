import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const session=pgTable("session",{

    id:text("session_id").primaryKey().notNull(),
    token:text("session_token").notNull().unique(),
    userId:text("session_user_id").notNull().references(()=>user.id, {onDelete:"cascade"}),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt:timestamp("session_created_at").notNull().defaultNow(),
    expiresAt:timestamp("session_expires_at").notNull(),
    updatedAt:timestamp("session_updated_at").notNull().defaultNow()
    }
)