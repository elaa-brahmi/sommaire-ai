import { currentUser } from "@clerk/nextjs/server";
import {getPriceId} from "@/lib/user"
import { pricingPlans } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { Crown } from "lucide-react";
import { cn } from '@/lib/utils';

export default async function PlanBadge(){
    const user=await currentUser();
    let priceid:string |null=null;
    if(!user) return null;
     priceid=await getPriceId(user?.emailAddresses[0]?.emailAddress);
    let defaultplan='buy a plan';
    const plan=pricingPlans.find((plan)=>plan.priceId===priceid);
    if(plan){
        defaultplan=plan.name;
    }
    return <Badge
            variant="outline"
            className={cn('ml-2 bg-linear-to-r from-amber-100 to-amber-200 border-amber-300 hidden lg:flex flex-row items-cenetr',
                !priceid && 'from-red-100 to-red-200 border-red-300'
            )}>
                <Crown className={cn('w-3 h-3 mr-1 text-amber-600',
                    !priceid && 'text-red-600'
                )}/>
                
                {defaultplan}</Badge>
   

}