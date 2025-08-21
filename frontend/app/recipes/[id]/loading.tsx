export default function Loading() {
    return (
        <div className="bg-cookbook-50 min-h-screen">
            {/* Navigation Header Skeleton */}
            <div className="bg-white border-b border-cookbook-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="h-6 w-32 bg-cookbook-200 rounded animate-pulse"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Recipe Header Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 overflow-hidden mb-8">
                    <div className="aspect-[16/9] bg-cookbook-200 animate-pulse"></div>

                    <div className="p-8">
                        <div className="h-10 bg-cookbook-200 rounded animate-pulse mb-4"></div>
                        <div className="h-6 bg-cookbook-200 rounded animate-pulse mb-6 w-3/4"></div>

                        {/* Meta Info Skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="text-center">
                                    <div className="h-8 bg-cookbook-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 bg-cookbook-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>

                        {/* Tags Skeleton */}
                        <div className="flex flex-wrap gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-6 w-16 bg-cookbook-200 rounded-full animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Ingredients Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6">
                        <div className="h-8 bg-cookbook-200 rounded animate-pulse mb-6 w-32"></div>
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-cookbook-200 rounded-full animate-pulse"></div>
                                    <div className="h-4 bg-cookbook-200 rounded animate-pulse flex-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6">
                        <div className="h-8 bg-cookbook-200 rounded animate-pulse mb-6 w-32"></div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-cookbook-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-cookbook-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 bg-cookbook-200 rounded animate-pulse w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Nutrition Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6 mt-8">
                    <div className="h-8 bg-cookbook-200 rounded animate-pulse mb-6 w-48"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="h-8 bg-cookbook-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-cookbook-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
