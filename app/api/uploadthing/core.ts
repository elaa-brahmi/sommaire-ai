import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    pdfUploader: f({pdf:{maxFileSize: "32MB",}})
      .middleware(async ({ req }) => {//When a user uploads a PDF, the middleware function first checks if they're authenticated
        // get user information
        const user=await currentUser();
        if(!user){
            throw new UploadThingError('unauthorized');
        }
        return{userId:user.id};
        
      }).onUploadComplete(async ({metadata,file})=>{
            console.log('upload completed for use id',metadata.userId);
            console.log('file url',file.ufsUrl);
            return {userId:metadata.userId, file:file.ufsUrl,fileName:file.name};
            //Returns the user ID and file URL for further processing
      }),
    }satisfies FileRouter;
    export type OurFileRouter = typeof ourFileRouter;