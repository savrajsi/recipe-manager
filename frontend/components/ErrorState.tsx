interface ErrorStateProps {
    error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className="bg-cookbook-50 min-h-screen">
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-display text-cookbook-700 mb-2">Oops! Something went wrong</h3>
                    <p className="text-cookbook-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-cookbook-600 hover:text-cookbook-800 underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    );
}
