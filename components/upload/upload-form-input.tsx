"use client"
import {Button} from '@/components/ui/button'
import { Input } from '../ui/input';
import { forwardRef } from 'react';

interface UploadFormProps{
    onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void;
    isLoading?: boolean;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormProps>(
    ({onSubmit, isLoading}, ref) => {
    return(
        <form className="flex flex-col " onSubmit={onSubmit} ref={ref}>
            <div className="flex justify-end gap-1.5">
        <Input type="file" id="file" name="file"
        accept="application/pdf"
        required
        className=""/>
        <Button disabled={isLoading}>{isLoading ? "Uploading..." : "Upload your PDF"}</Button></div>

        </form>
        )
    }
)

UploadFormInput.displayName = 'UploadFormInput';

export default UploadFormInput;