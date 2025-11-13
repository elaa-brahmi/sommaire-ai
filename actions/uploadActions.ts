"use server"
//any function that gets exported in this file are server actions
import {fetchAndExtractPdfText} from '@/lib/langchain'
import {generateSummaryFromGemini} from '@/lib/geminiAi'
import {auth} from '@clerk/nextjs/server';
import {getDbConnection} from '@/lib/db'
import {formatFileNameAsTitle} from '@/utils/format-utils'
import { revalidatePath } from 'next/cache';
export async function generatePdfSummary(uploadResponse: {
    serverData: {
        userId: string;
        file: string;
    };
}[]) {
    if (!uploadResponse || !uploadResponse[0]) {
        return {
            success: false,
            message: 'file upload failed',
            data: null,
        };
    }
    
  console.log("Upload Response:", JSON.stringify(uploadResponse, null, 2));

    const {
        serverData: {
            file: ufsUrl
        }
    } = uploadResponse[0];

    console.log("Extracted PDF URL:", ufsUrl);

    if(!ufsUrl){
        console.log("failed file upload ")
        return {
            success: false,
            message: 'file upload failed',
            data: null,
        };
        
    }
    try{
        const pdfText= await fetchAndExtractPdfText(ufsUrl);
        console.log("extracted text from pdf",pdfText);
        let summary;
        try{
            summary=await generateSummaryFromGemini(pdfText);
            console.log({summary});
            return{
                success: true,
                message: 'summary generated successfully',
                data: {
                    summary
                },

            }
        }
        catch(error){
            console.log("failed to generate summary with gemini",error);
           /*  if (error instanceof Error && error.message==='RATE_LIMIT_EXCEEDED'){
                try{
                
                }
                catch(geminiError){
                    console.log('gemini api failed after openAi',geminiError);
                    throw new Error('failed to generate summary with available ai providers');
                }

            } */
        }

    }
    catch(error){
        console.log( "error extracting text",error);
        return {
            success: false,
            message: 'file upload failed',
            data: null,
        };
    }


}
export async function savedPDFsummary({
    userId,
    fileUrl,
    summary,
    NewFormattedfileName,
    fileName
}:{
    userId?: string;
    fileUrl: string;
    summary: string;
    NewFormattedfileName: string;
    fileName: string;
}){
    //sql for inserting pdf summary
    try{
        const sql=await getDbConnection();
        if (!sql) {
            throw new Error('Failed to get database connection');
        }
        await sql`
            INSERT INTO pdf_summaries (user_id, original_file_url,
            summary_text, title, file_name)
            VALUES (
            ${userId},
            ${fileUrl},${summary},${NewFormattedfileName},${fileName}
            );`;
            
        return true;
    } catch(error) {
        console.error('Database error in savedPDFsummary:', error);
        throw error;
    }
}
export async function storePdfSummaryAction({
   fileUrl,summary,FormattedfileName,fileName

}:{
    userId?: string;
    fileUrl: string;
    summary: string;
    FormattedfileName: string;
    fileName: string;

}
){
    // user is logged in  and has a userId
    //save the pdf summary 
    let savedsummary:any;
    try{
        const { userId } = await auth();
        if(!userId){
            return {
                success: false,
                message: 'user not authenticated',
            };
        }
        const NewFormattedfileName = formatFileNameAsTitle(FormattedfileName);
        try {
            savedsummary= await savedPDFsummary({
                userId,
                fileUrl,
                summary,
                NewFormattedfileName,
                fileName
            });
            if(!savedsummary){
                return{
                    success:false,
                    message:'failed to save PDF summary,please try again ...',
                };
            }
            revalidatePath(`/summaries/${savedsummary.id}`);//tells Next.js to clear its cache for the specified path and fetch fresh data
            return {
                success: true,
                message: 'pdf summary saved',
                data: {
                    id:savedsummary.id,
                    title: FormattedfileName,
                    summary
                },
            };

        } catch (dbError) {
            console.error('Database error:', dbError);
            return {
                success: false,
                message: 'error saving pdf summary to database',
            };
        }
    } catch(error) {
        console.error('Authentication error:', error);
        return {
            success: false,
            message: 'error saving pdf summary',
        };
    }
    //revalidate our cache
}


