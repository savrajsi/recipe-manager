'use client';

import React, { useState, useEffect } from 'react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingListItem } from '@/types/recipe';

interface ShoppingListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShoppingListModal({ isOpen, onClose }: ShoppingListModalProps) {
    const {
        currentShoppingList,
        isGenerating,
        clearShoppingList,
        error,
        clearError
    } = useShoppingList();

    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // Prevent body scroll when modal is open and handle escape key
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; // Prevent layout shift

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleEscape);

            return () => {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                document.removeEventListener('keydown', handleEscape);
            };
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        // Cleanup function to restore scroll on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const toggleItemCheck = (itemId: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = async () => {
        if (!currentShoppingList) return;

        const text = generateShoppingListText();
        try {
            await navigator.clipboard.writeText(text);
            alert('Shopping list copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy shopping list');
        }
    };

    const generateShoppingListText = (): string => {
        if (!currentShoppingList) return '';

        let text = `Shopping List - ${new Date(currentShoppingList.createdAt).toLocaleDateString()}\n`;
        text += `Recipes: ${currentShoppingList.recipeNames.join(', ')}\n\n`;

        Object.entries(currentShoppingList.groupedByCategory).forEach(([category, items]) => {
            text += `${category.toUpperCase()}:\n`;
            items.forEach(item => {
                const amount = item.totalAmount % 1 === 0 ? item.totalAmount.toString() : item.totalAmount.toFixed(2);
                text += `- ${amount} ${item.unit} ${item.name}\n`;
            });
            text += '\n';
        });

        return text;
    };

    const categoryDisplayNames: Record<string, string> = {
        // Produce & Fresh
        produce: '🥬 Produce',
        vegetable: '🥕 Vegetables',
        fruit: '🍎 Fruits',
        herb: '🌿 Herbs',

        // Proteins
        meat: '🥩 Meat',
        protein: '🍗 Protein',
        seafood: '🐟 Seafood',

        // Dairy & Alternatives
        dairy: '🥛 Dairy',
        'dairy-alternative': '🥥 Dairy Alternatives',

        // Grains & Carbs
        grain: '🌾 Grains',
        cereal: '🥣 Cereals',
        pasta: '🍝 Pasta',
        baking: '🍞 Baking',

        // Legumes & Plant Proteins
        legume: '🫘 Legumes',

        // Seasonings & Flavor
        spice: '🌶️ Spices',
        condiment: '🧂 Condiments',
        sauce: '🍯 Sauces',
        oil: '🫒 Oils',
        sweetener: '🍯 Sweeteners',

        // Specialty
        seaweed: '🌊 Seaweed',

        // Fallback
        other: '📦 Other'
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
            style={{ margin: 0, padding: '1rem' }}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cookbook-200">
                    <h2 className="text-2xl font-display text-cookbook-900">Shopping List</h2>
                    <button
                        onClick={onClose}
                        className="text-cookbook-500 hover:text-cookbook-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400 m-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                                <button
                                    onClick={clearError}
                                    className="ml-auto text-red-400 hover:text-red-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto mb-4"></div>
                                <p className="text-cookbook-600">Generating your shopping list...</p>
                            </div>
                        </div>
                    )}

                    {currentShoppingList && !isGenerating && (
                        <div className="p-6">
                            {/* Shopping List Info */}
                            <div className="mb-6 p-4 bg-sage-50 rounded-lg">
                                <h3 className="font-medium text-cookbook-900 mb-2">Recipes included:</h3>
                                <div className="space-y-1">
                                    {currentShoppingList.recipeNames.map((recipeName, index) => {
                                        const recipeId = currentShoppingList.recipeIds[index];
                                        return (
                                            <div key={recipeId} className="text-sm text-cookbook-600">
                                                {recipeName}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Shopping List Items by Category */}
                            <div className="space-y-6 pb-6">
                                {Object.entries(currentShoppingList.groupedByCategory).map(([category, items]) => (
                                    <div key={category} className="border border-cookbook-200 rounded-lg overflow-hidden">
                                        <div className="bg-cookbook-50 px-4 py-3 border-b border-cookbook-200">
                                            <h4 className="font-medium text-cookbook-900">
                                                {categoryDisplayNames[category] || category}
                                            </h4>
                                        </div>
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                {items.map((item) => (
                                                    <div key={`${item.ingredientId}-${item.unit}`} className="flex items-start space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedItems.has(`${item.ingredientId}-${item.unit}`)}
                                                            onChange={() => toggleItemCheck(`${item.ingredientId}-${item.unit}`)}
                                                            className="mt-1 h-4 w-4 text-sage-600 focus:ring-sage-500 border-cookbook-300 rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <div className={`flex items-center justify-between ${checkedItems.has(`${item.ingredientId}-${item.unit}`) ? 'line-through text-cookbook-400' : 'text-cookbook-900'
                                                                }`}>
                                                                <span className="font-medium">
                                                                    {item.totalAmount % 1 === 0 ? item.totalAmount : item.totalAmount.toFixed(2)} {item.unit} {item.name}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-cookbook-500 mt-1">
                                                                Used in: {item.recipeNames.join(', ')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!currentShoppingList && !isGenerating && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="text-cookbook-400 mb-4">
                                    <img
                                        src="/shopping-cart.svg"
                                        alt="Shopping cart"
                                        className="w-16 h-16 mx-auto"
                                        style={{ filter: 'invert(69%) sepia(4%) saturate(629%) hue-rotate(170deg) brightness(96%) contrast(89%)' }}
                                    />
                                </div>
                                <h3 className="text-lg font-display text-cookbook-700 mb-2">No shopping list generated</h3>
                                <p className="text-cookbook-600">Select some recipes and generate a shopping list to get started</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {currentShoppingList && !isGenerating && (
                    <div className="flex items-center justify-between p-6 border-t border-cookbook-200 bg-cookbook-50 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleCopy}
                                className="flex items-center px-4 py-2 text-sm font-medium text-cookbook-700 bg-white border border-cookbook-300 rounded-md hover:bg-cookbook-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center px-4 py-2 text-sm font-medium text-cookbook-700 bg-white border border-cookbook-300 rounded-md hover:bg-cookbook-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={clearShoppingList}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
