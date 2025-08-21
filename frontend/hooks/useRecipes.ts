import { useState, useEffect, useMemo } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';
import { buildApiParams } from '@/utils/recipeSorting';

interface UseRecipesFilters {
    debouncedSearchTerm: string;
    selectedTags: string[];
    selectedMealTime: string;
    selectedDifficulty: string;
}

export function useRecipes(filters: UseRecipesFilters) {
    const [recipes, setRecipes] = useState<RecipeWithNutrition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoize the filter parameters to prevent unnecessary API calls
    // The parent component already handles array stability
    const stableFilters = useMemo(() => ({
        debouncedSearchTerm: filters.debouncedSearchTerm,
        selectedTags: filters.selectedTags,
        selectedMealTime: filters.selectedMealTime,
        selectedDifficulty: filters.selectedDifficulty
    }), [
        filters.debouncedSearchTerm,
        filters.selectedTags,
        filters.selectedMealTime,
        filters.selectedDifficulty
    ]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);

                // Build query parameters using utility function
                const params = buildApiParams(stableFilters);

                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/recipes${params.toString() ? '?' + params.toString() : ''}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                setRecipes(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load recipes');
                setRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [stableFilters]);

    return { recipes, loading, error };
}
