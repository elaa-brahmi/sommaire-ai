import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function UpgradeRequired(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4">
        <div className="text-center space-y-6">
          <div className="text-pink-600 font-semibold flex items-center justify-center gap-2 text-sm">
          <Sparkles className="h-6 w-6 mr-2 text-rose-800 
                            animate-pulse" />
            PREMIUM FEATURE
          </div>
  
          <h1 className="text-2xl font-bold text-gray-800">Subscription Required</h1>
  
          <div className="border border-pink-300 bg-white rounded-md p-4 text-gray-600 text-sm md:text-base">
            You need to upgrade to the <span className="font-medium">Basic Plan</span> or the <span className="font-medium">Pro Plan</span> to access this feature 💖
          </div>
  
          <Link
          href='/#pricing'
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition">
            View Pricing Plans
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )

}