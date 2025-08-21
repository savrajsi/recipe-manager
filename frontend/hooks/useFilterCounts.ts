import { useMemo } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';
import { FILTER_OPTIONS, MEAL_TIME_OPTIONS } from '@/lib/constants';

interface FilterCounts {
    tags: Record<string, number>;
    dietary: Record<string, number>;
    difficulty: Record<string, number>;
}

/**
 * Dynamically counts available options for each filter based on current results
 * This enables progressive disclosure - showing users what's actually available
 */
export function useFilterCounts(
    currentRecipes: RecipeWithNutrition[],
    currentFilters: {
        selectedTags: string[];
        selectedDietary: string[];
        selectedDifficulty: string;
        selectedMealTime: string;
        searchQuery: string;
    }
): FilterCounts {
    return useMemo(() => {
        const counts: FilterCounts = {
            tags: {},
            dietary: {},
            difficulty: {}
        };

        // Count tag occurrences
        FILTER_OPTIONS.tags.forEach(tag => {
            counts.tags[tag] = currentRecipes.filter(recipe =>
                recipe.tags.some(recipeTag =>
                    recipeTag.toLowerCase().includes(tag.toLowerCase())
                )
            ).length;
        });

        // Count dietary options
        FILTER_OPTIONS.dietary.forEach(dietary => {
            counts.dietary[dietary] = currentRecipes.filter(recipe =>
                recipe.tags.some(tag =>
                    tag.toLowerCase().includes(dietary.toLowerCase())
                )
            ).length;
        });

        // Count difficulty options
        FILTER_OPTIONS.difficulty.forEach(difficulty => {
            counts.difficulty[difficulty] = currentRecipes.filter(recipe =>
                recipe.difficulty === difficulty
            ).length;
        });

        return counts;
    }, [currentRecipes, currentFilters.selectedTags, currentFilters.selectedDietary, currentFilters.selectedDifficulty, currentFilters.selectedMealTime, currentFilters.searchQuery]);
}



