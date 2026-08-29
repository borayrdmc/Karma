import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user= pgTable("user",{

    id:text("id").primaryKey().notNull(),
    name:text("name").notNull(),
    email:text("email").notNull().unique(),
    emailVerified:boolean("email_verified").notNull().default(false),
    createdAt:timestamp("created_at").notNull().defaultNow(),
    updatedAt:timestamp("updated_at").notNull(),        
    }
)