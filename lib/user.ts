import {getDbConnection} from './db'
import {pricingPlans} from './constants'
import { User } from '@clerk/nextjs/server';
export async function getPriceId(email:string){
    const sql=await getDbConnection();
    if (!sql) {
        throw new Error('Failed to get database connection');
    }
    // Update user status to cancelled
    const query=await sql`
        select price_id from users 
        WHERE email = ${email} AND status='active'
    `;
    return query?.[0]?.price_id || null;
}



export async function hasReachedUploadLimit(user:User){
    const uploadCount=await getUserUploadCount(user.id);
    //get the email of user having userId
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
        return { hasReachedLimit: true, uploadLimit: 0 }; // Default to limit reached if no email
    }
    const priceId = await getPriceId(email);
    const isPro = pricingPlans.find((plan)=>plan.priceId===priceId)?.id==='pro'
    const uploadLimit:number = isPro ? 1000 : 5;
    return {hasReachedLimit: uploadCount >= uploadLimit, uploadLimit}; //boolean ,number
}
export async function getUserUploadCount(userId:string){
    try{
    const sql=await getDbConnection();
    if(!sql){
        throw new Error('Failed to get database connection');
    }
    const res=await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id=${userId}`;
    return res[0].count;
    }
    catch(err){
        console.error('error fetching upload count',err);
    }

}
export async function HasActiveSub(user:User){
    const sql=await getDbConnection();
    const email=user.emailAddresses[0].emailAddress;
    if(!sql){
        throw new Error('Failed to get database connection');
    }
    const res=await sql`SELECT price_id FROM users WHERE email=${email} 
    AND status='active' AND price_id IS NOT NULL`;
    return res && res.length>0;

}