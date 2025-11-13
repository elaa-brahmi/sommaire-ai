import Link from 'next/link';
import { cn } from '@/lib/utils';
import {ArrowRight, CheckIcon} from 'lucide-react'
import { MotionDiv, MotionSection } from '../common/motion-wrapper';
import { containerVariants, itemVariants } from '@/utils/constants';

import {pricingPlans} from '@/lib/constants';

type PriceType = {
    name: string;
    price: number;
    description: string;
    items: string[];
    id: string;
    paymentLink: string;
    priceId?: string;
}
const listVariants={
    hidden:{opacity:0,x:-20},//come from left to right
    visible:{opacity:1,x:0},
    transition:{
        type:'spring',
        damping:20,
        stiffness:100
    },

};

const PricingCard=({name,price,description,items,id,paymentLink}:PriceType)=>{
    if (!paymentLink) {
        return null; // Don't render the card if there's no payment link
    }
    return(
        <MotionDiv
        variants={listVariants}
        whileHover={{ scale:1.02 }}
      
        key={id} className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300">
            <div className={cn(
             'relative flex flex-col h-full gap-5 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl',
             id === 'pro' && 'border-rose-500 gap-5 border-2'
            )}
            >
                <MotionDiv
                variants={listVariants} className="flex justify-between items-center gap-4">
                    <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
                    <p className="text-base-content/80 mt-2">{description}</p>
                </MotionDiv>
                <MotionDiv
                variants={listVariants} className='flex gap-2'>
                    <p className="text-5xl tracking-tight font-extrabold">{price}</p>
                    <div className="flex flex-col justify-end mb-[4px]">
                        <p className='text-xs capitalize font-semibold'>USD</p>
                        <p className="text-sx">/month</p>
                    </div>
                </MotionDiv>
                <MotionDiv
                variants={listVariants}
                className="space-y-2.5 leading-relaxed text-base flex-1">
                    <ul>
                    {items.map((item,idx)=>(
                    <li className="flex items-center gap-2 " key={idx}>
                        <CheckIcon size={18}/>
                        <span>{item}</span>
                    </li>
                    ))}
                    </ul>
                </MotionDiv>
                <div 
                className="space-y-2 flex justify-center w-full ">
                    <Link href={paymentLink}
                     className={cn(
                    'w-full rounded-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2'
                    ,id==='pro' 
                        ? 'border-rose-900'
                        : 'border-rose-100 from-rose-400 to-rose-500' )}>
                        Buy now <ArrowRight size={18}/>
                    </Link>
                </div>
            </div>

        </MotionDiv>

    )
}

export default function Pricing(){
    return(
        <MotionSection
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once:true,margin:'-100px' }} className="relative overflow-hidden" id="pricing">
             <div className="py-12 lg:py-24 max-w-5xl mx-auto sm:px-6
        lg:px-8 lg:pt-12">
            <MotionDiv
            variants={itemVariants}
            className="flex items-center justify-center w-full pb-12">
                <h2 className="uppercase font-bold text-xl mb-8 text-rose-500">Pricing</h2>
            </MotionDiv>
            <div className="relative flex justify-center flex-col
            lg:flex-row items-center lg:items-stretch gap-8">
                {pricingPlans.map((plan)=>(
                <PricingCard key={plan.id} {...plan}/>
                ))}
                
            </div>
        </div>
        </MotionSection>
    )
}