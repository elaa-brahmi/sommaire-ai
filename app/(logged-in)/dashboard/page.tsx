import BgGradient from "@/components/common/BgGradient";
import {Button} from "@/components/ui/button";
import {ArrowRight, Plus} from "lucide-react";
import SummaryCard from "@/components/summaries/summary-card"
import Link from "next/link";
import {getSummaries} from '@/lib/summaries'
import { currentUser} from '@clerk/nextjs/server';
import {redirect} from 'next/navigation';
import { MotionDiv, MotionH1 } from '@/components/common/motion-wrapper'
import {itemVariants} from '@/utils/constants'
import { MotionP } from "@/components/common/motion-wrapper";
import { hasReachedUploadLimit } from "@/lib/user";

type Summary = {
    id: string;
    title: string | null;
    summary_text: string;
    created_at: string;
    status: string;
    original_file_url: string;
};

export default async function DashboardPage(){
    const user=await currentUser();
    const userId=user?.id;
    if(!userId) return redirect('/sign-in')
    const {hasReachedLimit,uploadLimit}= await hasReachedUploadLimit(user);

    const summaries = (await getSummaries(userId) || []) as Summary[];
    return (
    <main className="min-h-screen">
        <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200"/>
        <div className="container mx-auto flex flex-col gap-4">
            <div className="px-2 py-12 sm:py:24  ">
                <div className="flex gap-4 mb-8 justify-between ">
                    <div className="flex flex-col gap-4">
                        <MotionH1
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                            Your Summaries
                        </MotionH1>
                        <MotionP
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-gray-500">
                            Transform your PDFs into concise, actionable insights
                        </MotionP>
                    </div>
                    {!hasReachedLimit &&( <MotionDiv
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale:1.05 }}
                        className="self-start">
                        <Button variant={'link'}
                            className="bg-linear-to-r from-rose-500 to-rose-700
                            hover:from-rose-600
                            hover:to-rose-800 hover:scale-105 transition-all duration-300 
                            group hover:-no-underline">
                            <Link href="/upload" className="flex items-center text-white">
                                <Plus className="w-5 h-5 mr-2" />
                                New Summary
                            </Link>
                        </Button>
                    </MotionDiv>)}
                </div>
              {hasReachedLimit &&(  <MotionDiv
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale:1.05 }}
                    className="self-start mb-6">
                    <div className="bg-rose-50 border border-rose-200 rounded-lg
                        p-4 text-rose-800">
                        <p className="text-sm" >
                            You&apos;ve reached the limit of {uploadLimit} uploads on the basic plan{' '}
                            <Link href="/#pricing"
                                className="text-rose-800 underline font-medium underline-offset-4
                                inline-flex items-center">Click here to upgrade to Pro{' '}</Link>
                            <ArrowRight className="w-4 h-4 inline-block"/>{' '} for unlimited uploads
                        </p>
                    </div>
                </MotionDiv>)}
                {summaries.length === 0 ? (
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5a2.25 2.25 0 002.25-2.25v-3.75z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 11.25v6m0-6L9.75 14M12 11.25l2.25 2.75"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">No summaries yet</h1>
                        <p className="text-gray-500">
                            Upload your first PDF to get started with AI-powered summaries.
                        </p>
                        <Link
                        href="/upload"
                        
                        className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md font-medium transition">
                            Create Your First Summary
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
                        {summaries.map((summary: Summary) => (
                            <SummaryCard key={summary.id} summary={summary}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </main>
    );
}