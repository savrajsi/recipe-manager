'use client';

import { useState, useEffect } from 'react';

interface ServingSizeControlProps {
    originalServings: number;
    currentServings: number;
    onServingsChange: (servings: number) => void;
    loading?: boolean;
    error?: string | null;
    className?: string;
}

export function ServingSizeControl({
    originalServings,
    currentServings,
    onServingsChange,
    loading = false,
    error,
    className = ''
}: ServingSizeControlProps) {
    const [inputValue, setInputValue] = useState(currentServings.toString());

    // Sync input value when currentServings changes externally (e.g., from "Reset to original")
    useEffect(() => {
        setInputValue(currentServings.toString());
    }, [currentServings]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0) {
            onServingsChange(numValue);
        }
    };

    const handleIncrement = () => {
        const newServings = Math.min(currentServings + 1, 50);
        setInputValue(newServings.toString());
        onServingsChange(newServings);
    };

    const handleDecrement = () => {
        const newServings = Math.max(currentServings - 1, 1);
        setInputValue(newServings.toString());
        onServingsChange(newServings);
    };

    const isScaled = currentServings !== originalServings;

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-cookbook-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-normal text-cookbook-900">
                    Serving Size
                </h3>
                {isScaled && (
                    <span className="text-sm text-sage-600 bg-sage-50 px-2 py-1 rounded-full">
                        Scaled from {originalServings}
                    </span>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center border border-cookbook-300 rounded-lg overflow-hidden">
                    <button
                        onClick={handleDecrement}
                        disabled={currentServings <= 1 || loading}
                        className="px-3 py-2 text-cookbook-700 hover:bg-cookbook-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>

                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        disabled={loading}
                        className="w-16 px-3 py-2 text-center border-x border-cookbook-300 text-cookbook-900 focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50"
                    />

                    <button
                        onClick={handleIncrement}
                        disabled={currentServings >= 50 || loading}
                        className="px-3 py-2 text-cookbook-700 hover:bg-cookbook-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <span className="text-sm text-cookbook-600">
                    {currentServings === 1 ? 'serving' : 'servings'}
                </span>

                {loading && (
                    <div className="flex items-center text-sm text-cookbook-600">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cookbook-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scaling...
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                </div>
            )}

            <div className="mt-4 text-xs text-cookbook-500">
                Adjust the serving size to scale all ingredients and nutrition information accordingly.
            </div>
        </div>
    );
}
