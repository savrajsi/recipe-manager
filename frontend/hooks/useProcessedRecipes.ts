import { useMemo } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';
import { SortOption } from '@/lib/constants';
import { sortRecipes, filterByDietary } from '@/utils/recipeSorting';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProcessingFilters {
    selectedDietary: string[];
    sortBy: SortOption;
    showFavoritesOnly: boolean;
}

/**
 * Custom hook that processes recipes with client-side filtering and sorting
 * Uses memoization to prevent unnecessary recalculations
 */
export function useProcessedRecipes(
    recipes: RecipeWithNutrition[],
    filters: ProcessingFilters
): RecipeWithNutrition[] {
    const { favorites } = useFavorites();

    return useMemo(() => {
        // Start with all recipes
        let processed = [...recipes];

        // Apply dietary filtering (client-side)
        processed = filterByDietary(processed, filters.selectedDietary);

        // Apply favorites filtering (client-side)
        if (filters.showFavoritesOnly) {
            processed = processed.filter(recipe => favorites.includes(recipe.id));
        }

        // Apply sorting
        processed = sortRecipes(processed, filters.sortBy);

        return processed;
    }, [recipes, filters.selectedDietary, filters.sortBy, filters.showFavoritesOnly, favorites]);
}
