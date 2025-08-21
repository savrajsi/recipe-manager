import { RecipeWithNutrition } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
    recipes: RecipeWithNutrition[];
    onClearFilters: () => void;
}

export function RecipeGrid({ recipes, onClearFilters }: RecipeGridProps) {
    if (recipes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-cookbook-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-display text-cookbook-700 mb-2">No recipes found</h3>
                <p className="text-cookbook-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                    onClick={onClearFilters}
                    className="text-cookbook-600 hover:text-cookbook-800 underline"
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    showShoppingListSelection={true}
                />
            ))}
        </div>
    );
}
