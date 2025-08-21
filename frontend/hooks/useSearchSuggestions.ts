import { useMemo } from 'react';
import { RecipeWithNutrition } from '@/types/recipe';

/**
 * Generates search suggestions based on recipe data and user input
 */
export function useSearchSuggestions(recipes: RecipeWithNutrition[], searchTerm: string) {
    return useMemo(() => {
        // Don't show suggestions for very short input
        if (!searchTerm || searchTerm.length < 2) return [];

        const suggestions = new Set<string>();
        const term = searchTerm.toLowerCase().trim();

        recipes.forEach(recipe => {
            // Recipe title suggestions
            if (recipe.title.toLowerCase().includes(term)) {
                suggestions.add(recipe.title);
            }

            // Tag suggestions
            recipe.tags.forEach(tag => {
                if (tag.toLowerCase().includes(term)) {
                    suggestions.add(tag);
                }
            });

            // Description suggestions (for key phrases)
            const description = recipe.description.toLowerCase();
            if (description.includes(term)) {
                // Extract the sentence containing the search term
                const sentences = recipe.description.split(/[.!?]+/);
                sentences.forEach(sentence => {
                    if (sentence.toLowerCase().includes(term) && sentence.trim().length > 0) {
                        // Use the recipe title as the suggestion for description matches
                        suggestions.add(recipe.title);
                    }
                });
            }
        });

        // Convert to array and sort intelligently
        return Array.from(suggestions)
            .slice(0, 8) // Limit to 8 suggestions for good UX
            .sort((a, b) => {
                // Prioritize exact matches at the start
                const aStarts = a.toLowerCase().startsWith(term);
                const bStarts = b.toLowerCase().startsWith(term);

                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;

                // Then sort alphabetically
                return a.localeCompare(b);
            });
    }, [recipes, searchTerm]);
}
