export function LoadingState() {
    return (
        <div className="bg-cookbook-50 min-h-screen">
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cookbook-600 mx-auto mb-4"></div>
                    <p className="text-cookbook-600 font-serif">Loading delicious recipes...</p>
                </div>
            </div>
        </div>
    );
}
