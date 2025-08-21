import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="bg-cookbook-50 min-h-screen flex items-center justify-center">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="mb-8">
                    <svg
                        className="w-24 h-24 mx-auto text-cookbook-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64m9.348 0A7.962 7.962 0 0012 15c2.34 0 4.29-1.009 5.674-2.64M6.758 11C7.124 8.648 9.272 7 12 7s4.876 1.648 5.242 4M12 3v2m0 16v2"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-display font-normal text-cookbook-900 mb-4">
                    Recipe Not Found
                </h1>

                <p className="text-cookbook-600 mb-8 font-serif">
                    Sorry, we couldn't find the recipe you're looking for. It might have been removed or the link might be incorrect.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Recipes
                </Link>
            </div>
        </div>
    );
}
