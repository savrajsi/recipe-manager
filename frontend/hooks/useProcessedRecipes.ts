import { useMemo } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';
import { SortOption } from '@/lib/constants';
import { sortRecipes, filterByDietary } from '@/utils/recipeSorting';

interface ProcessingFilters {
    selectedDietary: string[];
    sortBy: SortOption;
}

/**
 * Custom hook that processes recipes with client-side filtering and sorting
 * Uses memoization to prevent unnecessary recalculations
 */
export function useProcessedRecipes(
    recipes: RecipeWithNutrition[],
    filters: ProcessingFilters
): RecipeWithNutrition[] {
    return useMemo(() => {
        // Start with all recipes
        let processed = [...recipes];

        // Apply dietary filtering (client-side)
        processed = filterByDietary(processed, filters.selectedDietary);

        // Apply sorting
        processed = sortRecipes(processed, filters.sortBy);

        return processed;
    }, [recipes, filters.selectedDietary, filters.sortBy]);
}
