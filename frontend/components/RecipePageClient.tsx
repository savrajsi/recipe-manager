'use client';

import Link from 'next/link';
import { DetailedRecipe } from '@/types/recipe';
import FavoriteButton from './FavoriteButton';
import { useFavorites } from '@/contexts/FavoritesContext';

interface RecipePageClientProps {
    recipe: DetailedRecipe;
}

export function RecipePageClient({ recipe }: RecipePageClientProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const totalTime = parseInt(recipe.prepTime) + parseInt(recipe.cookTime);

    // Calculate per-serving nutrition values (rounded to whole numbers)
    const perServingNutrition = {
        calories: Math.round(recipe.totalNutrition.calories / recipe.servings),
        protein: Math.round(recipe.totalNutrition.protein / recipe.servings),
        carbs: Math.round(recipe.totalNutrition.carbs / recipe.servings),
        fat: Math.round(recipe.totalNutrition.fat / recipe.servings)
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
                                {recipe.title}
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
                            {recipe.description}
                        </p>

                        {/* Recipe Meta Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{recipe.servings}</div>
                                <div className="text-sm text-cookbook-600">Servings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{recipe.prepTime}</div>
                                <div className="text-sm text-cookbook-600">Prep Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-semibold text-cookbook-900">{recipe.cookTime}</div>
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
                                    {recipe.difficulty}
                                </span>
                                <div className="text-sm font-medium text-cookbook-700">
                                    {recipe.caloriesPerServing} calories per serving
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-sage-100 text-sage-700 text-sm rounded-full font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 p-6">
                        <h2 className="text-2xl font-display font-normal text-cookbook-900 mb-6">
                            Ingredients
                        </h2>

                        <ul className="space-y-3">
                            {recipe.ingredients.map((ingredient, index) => (
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
                            {recipe.instructions.map((instruction, index) => (
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
                            Nutrition information per serving • Recipe makes {recipe.servings} servings total
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
