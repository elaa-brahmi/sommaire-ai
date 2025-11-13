"use server";
import {getDbConnection} from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
export async function DeleteSummary(summaryId:string){
    try{
        const user=await currentUser();
        const userId=user?.id;
        const sql=await getDbConnection();
        if(!userId){
            redirect('/sign-in');
            throw new Error("user not found");
        }
        if (!sql) {
            throw new Error('Failed to get database connection');
        }
        const res = await sql`DELETE FROM pdf_summaries WHERE id=${summaryId} AND user_id=${userId} RETURNING id`;
        //revalidate path
        if(res.length>0){
            revalidatePath(`/dashboard`);
            return{success:true};
        }
        return{success:false};
    }
    catch(error){

        console.log(error);
        return{success:false};

    }

}