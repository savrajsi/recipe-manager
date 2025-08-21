import { useState, useEffect } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';

interface UseAllRecipesReturn {
    allRecipes: RecipeWithNutrition[];
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook to fetch ALL recipes (unfiltered) for search suggestions
 * This is separate from useRecipes which applies filters
 */
export function useAllRecipes(): UseAllRecipesReturn {
    const [allRecipes, setAllRecipes] = useState<RecipeWithNutrition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllRecipes = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all recipes without any query parameters
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/recipes`);

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data: RecipeWithNutrition[] = await response.json();
                setAllRecipes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching all recipes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRecipes();
    }, []); // Empty dependency array - only fetch once on mount

    return {
        allRecipes,
        loading,
        error
    };
}

