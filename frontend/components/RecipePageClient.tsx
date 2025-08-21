'use client';

import Link from 'next/link';
import { DetailedRecipe } from '@/types/recipe';
import FavoriteButton from './FavoriteButton';
import { ServingSizeControl } from './ServingSizeControl';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useRecipeScaling } from '@/hooks/useRecipeScaling';

interface RecipePageClientProps {
    recipe: DetailedRecipe;
}

export function RecipePageClient({ recipe }: RecipePageClientProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const {
        currentServings,
        scaledRecipe,
        loading: scalingLoading,
        error: scalingError,
        updateServings,
        resetToOriginal,
        isScaled
    } = useRecipeScaling(recipe);

    // Use scaled recipe if available, otherwise use original
    const displayRecipe = scaledRecipe || recipe;
    const totalTime = parseInt(displayRecipe.prepTime) + parseInt(displayRecipe.cookTime);

    // Calculate per-serving nutrition values (rounded to whole numbers)
    const perServingNutrition = {
        calories: Math.round(displayRecipe.totalNutrition.calories / displayRecipe.servings),
        protein: Math.round(displayRecipe.totalNutrition.protein / displayRecipe.servings),
        carbs: Math.round(displayRecipe.totalNutrition.carbs / displayRecipe.servings),
        fat: Math.round(displayRecipe.totalNutrition.fat / displayRecipe.servings)
    };

    return (
        <div className="bg-cookbook-50 min-h-screen">
            {/* Navigation Header */}
            <div className="bg-white border-b border-cookbook-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-cookbook-600 hover:text-cookbook-800 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Recipes
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Recipe Header */}
                <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 overflow-hidden mb-8">
                    <div className="aspect-[16/9] relative">
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-4xl font-display font-normal text-cookbook-900">
                                {displayRecipe.title}
                            </h1>
                            <FavoriteButton
                                recipeId={recipe.id}
                                isFavorite={isFavorite(recipe.id)}
                                onToggle={toggleFavorite}
                                size="lg"
                                className="ml-4 p-2 hover:bg-cookbook-100 rounded-full transition-colors"
                            />
                        </div>

                        <p className="text-lg text-cookbook-600 mb-6 font-serif leading-relaxed">
                            {displayRecipe.description}
                        </p>

                        {/* Recipe Meta Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{displayRecipe.servings}</div>
                                <div className="text-sm text-cookbook-600">Servings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{displayRecipe.prepTime}</div>
                                <div className="text-sm text-cookbook-600">Prep Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{displayRecipe.cookTime}</div>
                                <div className="text-sm text-cookbook-600">Cook Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{totalTime} min</div>
                                <div className="text-sm text-cookbook-600">Total Time</div>
                            </div>
                        </div>

                        {/* Difficulty & Nutrition */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <span className="capitalize px-4 py-2 bg-cookbook-100 text-cookbook-700 rounded-full text-sm font-medium">
                                    {displayRecipe.difficulty}
                                </span>
                                <div className="text-sm font-medium text-cookbook-700">
                                    {displayRecipe.caloriesPerServing} calories per serving
                                </div>
                            </div>
                        </div>

                        {/* Tags and Serving Size Control */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                {displayRecipe.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-sage-100 text-sage-700 text-sm rounded-full font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Compact Serving Size Control */}
                            <div className="flex items-center space-x-3">
                                {isScaled && (
                                    <span className="text-xs text-sage-600 bg-sage-50 px-2 py-1 rounded-full">
                                        Scaled from {recipe.servings}
                                    </span>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-cookbook-600 font-medium">Servings:</span>
                                    <div className="flex items-center border border-cookbook-300 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateServings(Math.max(currentServings - 1, 1))}
                                            disabled={currentServings <= 1 || scalingLoading}
                                            className="px-2 py-1 text-cookbook-700 hover:bg-cookbook-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={currentServings}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value > 0) {
                                                    updateServings(value);
                                                }
                                            }}
                                            disabled={scalingLoading}
                                            className="w-12 px-2 py-1 text-center text-sm border-x border-cookbook-300 text-cookbook-900 focus:outline-none focus:ring-1 focus:ring-sage-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />

                                        <button
                                            onClick={() => updateServings(Math.min(currentServings + 1, 50))}
                                            disabled={currentServings >= 50 || scalingLoading}
                                            className="px-2 py-1 text-cookbook-700 hover:bg-cookbook-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {scalingLoading && (
                                        <svg className="animate-spin h-4 w-4 text-cookbook-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                </div>
                                {isScaled && (
                                    <button
                                        onClick={resetToOriginal}
                                        className="text-xs text-sage-600 hover:text-sage-800 underline transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Error message if any */}
                        {scalingError && (
                            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {scalingError}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-display font-normal text-cookbook-900">
                                Ingredients
                            </h2>
                            {isScaled && (
                                <button
                                    onClick={resetToOriginal}
                                    className="text-sm text-sage-600 hover:text-sage-800 underline transition-colors"
                                >
                                    Reset to original
                                </button>
                            )}
                        </div>

                        <ul className="space-y-3">
                            {displayRecipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-cookbook-100 rounded-full flex items-center justify-center mt-0.5">
                                        <div className="w-2 h-2 bg-cookbook-600 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-medium text-cookbook-900">
                                            {ingredient.amount} {ingredient.unit}
                                        </span>
                                        <span className="text-cookbook-700 ml-2">
                                            {ingredient.ingredient.name}
                                        </span>
                                        {ingredient.ingredient.commonAllergens.length > 0 && (
                                            <div className="text-xs text-amber-600 mt-1">
                                                Contains: {ingredient.ingredient.commonAllergens.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6">
                        <h2 className="text-2xl font-display font-normal text-cookbook-900 mb-6">
                            Instructions
                        </h2>

                        <ol className="space-y-4">
                            {displayRecipe.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-sage-700">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-cookbook-700 leading-relaxed font-serif pt-1">
                                        {instruction}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* Nutrition Information */}
                <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6 mt-8">
                    <h2 className="text-2xl font-display font-normal text-cookbook-900 mb-6">
                        Nutrition Information
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-cookbook-900">
                                {perServingNutrition.calories}
                            </div>
                            <div className="text-sm text-cookbook-600">Calories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-cookbook-900">
                                {perServingNutrition.protein}g
                            </div>
                            <div className="text-sm text-cookbook-600">Protein</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-cookbook-900">
                                {perServingNutrition.carbs}g
                            </div>
                            <div className="text-sm text-cookbook-600">Carbohydrates</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-cookbook-900">
                                {perServingNutrition.fat}g
                            </div>
                            <div className="text-sm text-cookbook-600">Fat</div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-cookbook-200">
                        <p className="text-sm text-cookbook-600 text-center">
                            Nutrition information per serving • Recipe makes {displayRecipe.servings} {displayRecipe.servings === 1 ? 'serving' : 'servings'} total
                            {isScaled && (
                                <span className="text-sage-600 ml-2">
                                    (scaled from {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
