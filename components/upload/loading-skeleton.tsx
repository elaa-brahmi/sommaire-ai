export default function LoadingSkeleton({ isLoading }: { isLoading?: boolean }) {
    return (
        <>
            {isLoading && (
                <div>
                    <h2 className="mt-5 text-center text-xl font-semibold text-pink-900 mb-4">
                       Processing
                    </h2>

                    <div className="mt-7 lg:w-120 sm:w-100 md:w-120 flex justify-center items-center mx-auto animate-pulse">
                        <div className="w-full max-w-xl p-6 rounded-2xl shadow-md bg-gradient-to-br from-white to-pink-100 relative animate-pulse">
                            <div className="h-10 w-3/4 mb-6 rounded-lg bg-shimmer bg-shimmer bg-no-repeat animate-shimmer "></div>

                            <div className="space-y-4">
                                <div className="bg-gray-200 h-16 w-full rounded-xl bg-shimmer bg-shimmer bg-no-repeat animate-shimmer "></div>
                                <div className="bg-gray-200 h-16 w-full rounded-xl bg-shimmer bg-shimmer bg-no-repeat animate-shimmer "></div>
                                <div className="bg-gray-200 h-16 w-full rounded-xl bg-shimmer bg-shimmer bg-no-repeat animate-shimmer "></div>
                                <div className="bg-gray-200 h-16 w-full rounded-xl bg-shimmer bg-shimmer bg-no-repeat animate-shimmer "></div>

                            </div>

                            <div className="flex justify-center items-center gap-2 mt-8">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                                <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                            </div>

                            <div className="absolute left-4 bottom-4 w-10 h-10 rounded-full bg-pink-200"></div>
                            <div className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-pink-500"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}