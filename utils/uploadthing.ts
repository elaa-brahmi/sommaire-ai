import {
   
    generateReactHelpers
  } from "@uploadthing/react";
  
import type { OurFileRouter } from "@/app/api/uploadthing/core";
export const {useUploadThing} = generateReactHelpers<OurFileRouter>();
//This file acts as a bridge between:
// 1. Your UploadThing configuration (in core.ts)
// 2. Your React components that need to handle file uploads
//The hook provides several useful features:
// .startUpload: Function to initiate file uploads
// .isUploading: Boolean state to track upload progress
// .permittedFileInfo: Information about allowed file types and sizes
// .Error handling for failed uploads
// .Progress tracking for ongoing uploads