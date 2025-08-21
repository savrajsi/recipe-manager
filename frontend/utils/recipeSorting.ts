import { RecipeWithNutrition } from '@/types/recipe';
import { SortOption } from '@/lib/constants';

/**
 * Sorts recipes based on the selected sort option
 */
export function sortRecipes(recipes: RecipeWithNutrition[], sortBy: SortOption): RecipeWithNutrition[] {
    return [...recipes].sort((a, b) => {
        switch (sortBy) {
            case 'prep-time':
                const aMinutes = parseInt(a.prepTime.split(' ')[0]);
                const bMinutes = parseInt(b.prepTime.split(' ')[0]);
                return aMinutes - bMinutes;

            case 'difficulty':
                const diffOrder = { easy: 1, medium: 2, hard: 3 };
                return diffOrder[a.difficulty] - diffOrder[b.difficulty];

            case 'calories':
                return a.caloriesPerServing - b.caloriesPerServing;

            case 'newest':
            default:
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
    });
}

/**
 * Filters recipes by dietary restrictions (AND logic - must match ALL selected dietary restrictions)
 */
export function filterByDietary(recipes: RecipeWithNutrition[], selectedDietary: string[]): RecipeWithNutrition[] {
    if (selectedDietary.length === 0) return recipes;

    return recipes.filter(recipe =>
        selectedDietary.every(dietary =>
            recipe.tags.some(tag => tag.toLowerCase().includes(dietary.toLowerCase()))
        )
    );
}

/**
 * Builds URL search parameters for API calls
 */
export function buildApiParams(filters: {
    debouncedSearchTerm: string;
    selectedTags: string[];
    selectedMealTime: string;
    selectedDifficulty: string;
}): URLSearchParams {
    const params = new URLSearchParams();

    if (filters.debouncedSearchTerm) {
        params.append('search', filters.debouncedSearchTerm);
    }

    // Keep regular tags separate from meal time
    if (filters.selectedTags.length > 0) {
        params.append('tags', filters.selectedTags.join(','));
    }

    // Treat meal time like difficulty - as a separate exact-match filter
    if (filters.selectedMealTime) {
        params.append('mealTime', filters.selectedMealTime);
    }

    if (filters.selectedDifficulty) {
        params.append('difficulty', filters.selectedDifficulty);
    }

    return params;
}
