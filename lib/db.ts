// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getDbConnection() {
    if(!process.env.DATABASE_URL){
        throw new Error('neon database url is not defined');
        return;
    }
    return neon(process.env.DATABASE_URL);
}