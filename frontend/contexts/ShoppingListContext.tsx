'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ShoppingList, ShoppingListRequest } from '../types/recipe';

interface ShoppingListContextType {
    // Recipe selection for shopping list generation
    selectedRecipes: string[];
    toggleRecipeSelection: (recipeId: string) => void;
    selectAllRecipes: (recipeIds: string[]) => void;
    clearSelection: () => void;
    isRecipeSelected: (recipeId: string) => boolean;
    selectedCount: number;

    // Shopping list generation
    currentShoppingList: ShoppingList | null;
    isGenerating: boolean;
    generateShoppingList: (request: ShoppingListRequest) => Promise<void>;
    clearShoppingList: () => void;

    // Error handling
    error: string | null;
    clearError: () => void;

    // Loading state
    isLoaded: boolean;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

interface ShoppingListProviderProps {
    children: ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
    const [currentShoppingList, setCurrentShoppingList] = useState<ShoppingList | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved data from localStorage on mount
    useEffect(() => {
        try {
            const savedSelected = localStorage.getItem('shopping-list-selected-recipes');
            if (savedSelected) {
                setSelectedRecipes(JSON.parse(savedSelected));
            }

            const currentList = localStorage.getItem('shopping-list-current');
            if (currentList) {
                setCurrentShoppingList(JSON.parse(currentList));
            }
        } catch (error) {
            console.error('Error loading shopping list data from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem('shopping-list-selected-recipes');
            localStorage.removeItem('shopping-list-current');
        }
        setIsLoaded(true);
    }, []);

    // Save selected recipes to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shopping-list-selected-recipes', JSON.stringify(selectedRecipes));
        }
    }, [selectedRecipes, isLoaded]);

    // Save current shopping list to localStorage
    useEffect(() => {
        if (isLoaded) {
            if (currentShoppingList) {
                localStorage.setItem('shopping-list-current', JSON.stringify(currentShoppingList));
            } else {
                localStorage.removeItem('shopping-list-current');
            }
        }
    }, [currentShoppingList, isLoaded]);



    // Auto-generate shopping list when selected recipes change
    useEffect(() => {
        if (isLoaded && selectedRecipes.length > 0) {
            // Generate shopping list with original recipe amounts only
            generateShoppingList({
                recipeIds: selectedRecipes
            });
        } else if (selectedRecipes.length === 0) {
            // Clear shopping list when no recipes are selected
            setCurrentShoppingList(null);
        }
    }, [selectedRecipes, isLoaded]); // Note: generateShoppingList is stable, so we don't need it in deps

    // Utility functions
    const clearError = useCallback(() => setError(null), []);

    const toggleRecipeSelection = useCallback((recipeId: string) => {
        setSelectedRecipes(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
        clearError();
    }, [clearError]);

    const selectAllRecipes = useCallback((recipeIds: string[]) => {
        setSelectedRecipes(recipeIds);
        clearError();
    }, [clearError]);

    const clearSelection = useCallback(() => {
        setSelectedRecipes([]);
        clearError();
    }, [clearError]);

    const isRecipeSelected = useCallback((recipeId: string) => selectedRecipes.includes(recipeId), [selectedRecipes]);

    const generateShoppingList = useCallback(async (request: ShoppingListRequest) => {
        if (request.recipeIds.length === 0) {
            setError('Please select at least one recipe to generate a shopping list');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            console.log('🛒 Generating shopping list for recipes:', request.recipeIds);

            const response = await fetch(`${API_BASE_URL}/api/shopping-list/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const shoppingList: ShoppingList = await response.json();
            setCurrentShoppingList(shoppingList);

            console.log('✅ Shopping list generated successfully:', shoppingList);

        } catch (error) {
            console.error('Error generating shopping list:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate shopping list');
        } finally {
            setIsGenerating(false);
        }
    }, []); // generateShoppingList has no external dependencies

    const clearShoppingList = useCallback(() => {
        setCurrentShoppingList(null);
        setSelectedRecipes([]);
        clearError();
    }, [clearError]);

    const value: ShoppingListContextType = {
        // Recipe selection
        selectedRecipes,
        toggleRecipeSelection,
        selectAllRecipes,
        clearSelection,
        isRecipeSelected,
        selectedCount: selectedRecipes.length,

        // Shopping list generation
        currentShoppingList,
        isGenerating,
        generateShoppingList,
        clearShoppingList,

        // Error handling
        error,
        clearError,

        // Loading state
        isLoaded
    };

    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
}

export function useShoppingList(): ShoppingListContextType {
    const context = useContext(ShoppingListContext);
    if (context === undefined) {
        throw new Error('useShoppingList must be used within a ShoppingListProvider');
    }
    return context;
}
