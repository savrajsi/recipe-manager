'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';

interface RecipesContextType {
    // All recipes data
    allRecipes: RecipeWithNutrition[];
    loading: boolean;
    error: string | null;

    // Utility functions
    refreshRecipes: () => Promise<void>;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

interface RecipesProviderProps {
    children: ReactNode;
}

export function RecipesProvider({ children }: RecipesProviderProps) {
    const [allRecipes, setAllRecipes] = useState<RecipeWithNutrition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllRecipes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all recipes without any query parameters
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/recipes`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAllRecipes(data);
        } catch (err) {
            console.error('Error fetching all recipes:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching recipes');
            setAllRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchAllRecipes();
    }, []);

    const refreshRecipes = async () => {
        await fetchAllRecipes();
    };

    const value: RecipesContextType = {
        allRecipes,
        loading,
        error,
        refreshRecipes
    };

    return (
        <RecipesContext.Provider value={value}>
            {children}
        </RecipesContext.Provider>
    );
}

export function useRecipes(): RecipesContextType {
    const context = useContext(RecipesContext);
    if (context === undefined) {
        throw new Error('useRecipes must be used within a RecipesProvider');
    }
    return context;
}
