import {getDbConnection} from '@/lib/db'
export async function getSummaryById(id: string) {
    try{
    const sql = await getDbConnection();
    if(!sql){
        throw new Error('Failed to get database connection');
    }
    const [summary] = await sql`SELECT id,
        user_id,
        title,
        original_file_url,
        summary_text,  
        created_at,
        updated_at,
        status,
        file_name,
        LENGTH(summary_text)-LENGTH(REPLACE(summary_text,' ','')) +1 as word_count FROM pdf_summaries where id=${id}`;
  
    
    return summary;}
    catch (err) {
    console.error('Error fetching summary by id', err);
    return null;
    }
    }