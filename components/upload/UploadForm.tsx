"use client"
import UploadFormInput from '@/components/upload/upload-form-input';
import { useUploadThing } from '@/utils/uploadthing';
import { toast } from 'sonner';
import { z } from 'zod';
import {generatePdfSummary, storePdfSummaryAction} from '@/actions/uploadActions'
import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import LoadingSkeleton from '@/components/upload/loading-skeleton'
const schema=z.object({
    file:z.instanceof(File,{message:'invalid file'}).
    refine((file)=>file.size<=20*1024*1024,
        'file size must be less than 20MB'
    )
    .refine((file)=>file.type.startsWith('application/pdf'),
    'file must be a pdf'
),
}); //file object
//create a file uploader 
export default function UploadForm() {
    const formRef=useRef<HTMLFormElement>(null);
    const [isLoading,setIsLoading]= useState(false);
    const router = useRouter();
    const {startUpload}=useUploadThing('pdfUploader',{
        onClientUploadComplete:()=>{
            toast.success('File uploaded successfully!');
        },
        onUploadError:() => {
            toast.error('Failed to upload file. Please try again.');
        },
        onUploadBegin:(fileName)=>{
            console.log('upload has begun for', fileName);
        },
    });
    const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault();
            console.log("submitted");
            setIsLoading(true);
            const formData=new FormData(e.currentTarget);
            const file=formData.get('file') as File;
            //validation the fields
            const validatedFields=schema.safeParse({file});
            //schema validation with zod
            if(!validatedFields.success){
                toast.error(
                    validatedFields.error.flatten().fieldErrors.file?.[0] ?? 
                    'Invalid file'
                );
                setIsLoading(false);
                return;
            }
            toast.info('Uploading PDF...');     
            //upload file to the uploadThing
            const resp=await startUpload([file]);
        
            if(!resp){
                toast.error('Please try with another file');
                setIsLoading(false);
                return;
            }
            console.log("response file upload",resp);
            //parse the pdf using lang chain+generate summary with gemini
            const result=await generatePdfSummary(resp);
            console.log("generated summary: ",result);
            const {data=null,message=null}=result || {};
            if(data){
            
                let storeResult:any;
                toast.info('Processing PDF - Hang tight! Our AI is reading through your document!');
            
            if(data.summary){
                //store pdf summary to neon db
                storeResult=await storePdfSummaryAction({
                    fileUrl: resp[0].ufsUrl,
                    summary: data.summary,
                    FormattedfileName: resp[0].name,
                    fileName: file.name,
                });
                toast.success('summary generated');
                formRef.current?.reset();
                // Use router.push instead of redirect
                router.push('/dashboard');
            }
        }
    }
    catch(error){
        console.log("error occured",error);
        formRef.current?.reset();
        setIsLoading(false);

    }
    finally{
        setIsLoading(false);
    }

    };
    return(
        <>
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
          <UploadFormInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            ref={formRef}
            />

        </div>
        <LoadingSkeleton
         isLoading={isLoading}/>
        </>
    )
}