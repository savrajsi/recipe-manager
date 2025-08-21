'use client';

import React, { useState } from 'react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingListModal } from './ShoppingListModal';

interface ShoppingListButtonProps {
    className?: string;
}

function ClearSelectionButton() {
    const { clearSelection } = useShoppingList();

    return (
        <button
            onClick={clearSelection}
            className="text-cookbook-500 hover:text-cookbook-700 transition-colors"
            title="Clear selection"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
}

export function ShoppingListButton({ className = '' }: ShoppingListButtonProps) {
    const {
        selectedRecipes,
        selectedCount,
        generateShoppingList,
        currentShoppingList,
        isGenerating,
        error
    } = useShoppingList();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // With immediate generation, we can use a simple state check
    const hasActiveState = selectedCount > 0 || currentShoppingList;

    const handleOpenShoppingList = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`flex items-center space-x-2 ${className}`}>
                {/* Shopping List Button */}
                <button
                    onClick={handleOpenShoppingList}
                    disabled={isGenerating}
                    className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${hasActiveState
                        ? 'bg-sage-600 text-white hover:bg-sage-700 shadow-sm'
                        : 'bg-cookbook-100 text-cookbook-600 hover:bg-cookbook-200'
                        } ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
                    title={
                        currentShoppingList
                            ? 'View shopping list'
                            : selectedCount > 0
                                ? `View shopping list for ${selectedCount} recipe${selectedCount === 1 ? '' : 's'}`
                                : 'Select recipes to create shopping list'
                    }
                >
                    {isGenerating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                        <img
                            src="/shopping-cart.svg"
                            alt="Shopping cart"
                            className="w-4 h-4 mr-2"
                            style={{
                                filter: hasActiveState
                                    ? 'brightness(0) invert(1)' // White for colored buttons
                                    : 'brightness(0) invert(0.4)', // Dark gray for light buttons
                                transition: 'filter 200ms ease-in-out'
                            }}
                        />
                    )}

                    {isGenerating ? (
                        'Updating...'
                    ) : hasActiveState ? (
                        `Shopping List ${selectedCount > 0 ? `(${selectedCount})` : ''}`
                    ) : (
                        'Shopping List'
                    )}


                </button>

                {/* Clear Selection Button */}
                {selectedCount > 0 && (
                    <ClearSelectionButton />
                )}
            </div>

            {/* Shopping List Modal */}
            <ShoppingListModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}
