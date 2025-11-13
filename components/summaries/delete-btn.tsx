"use client"
import { Trash2Icon } from 'lucide-react'
import {Button} from '../ui/button'
import {Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter} from '@/components/ui/dialog'
import { useState } from 'react'
import {DeleteSummary} from '@/actions/summary-actions'
import { toast } from "sonner"
export default function DeleteButton({summaryId}:{summaryId:string}){
    const [open,setOpen]=useState(false);
    const handleDelete = async () => {
        const res=await DeleteSummary(summaryId);
        if(!res){
            toast.error('failed to delete summary');
           
        }
        //redirect to dashboard
        setOpen(false);
        
        };
    return(
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button
        variant={'ghost'}
        size="icon"
        className="text-gray-400 bg-gray-50 border border-gray-200 
        hover:text-rose-600 hover:bg-rose-50">
            <Trash2Icon className="w-4 h-4"/>
        </Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
        <DialogTitle>Delete Summary</DialogTitle>
        <DialogDescription>
        Are you sure you want to delete this summary?
        This action cannot be
        undone.
        </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <Button
        onClick={()=>setOpen(false)}
        variant={'ghost'}
        className="px-2 bg-gray-50 border
        hover:text-gray-600
        border-gray-100
        hover:bg-rose-50">
    
        Cancel
        </Button>
        <Button
        variant={'destructive'}
        className=" bg-gray-900
        hover:text-gray-600"
        onClick={handleDelete}>
    
        delete
        </Button>
        </DialogFooter>
        </DialogContent>
        </Dialog>
        
       

    )
    
}