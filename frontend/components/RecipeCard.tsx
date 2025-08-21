'use client';

import Link from 'next/link';
import { RecipeWithNutrition } from '@/types/recipe';
import FavoriteButton from './FavoriteButton';
import { useFavorites } from '@/contexts/FavoritesContext';

interface RecipeCardProps {
  recipe: RecipeWithNutrition;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="bg-white rounded-lg shadow-sm border border-cookbook-200 overflow-hidden hover:shadow-md hover:border-cookbook-300 transition-all duration-300 cursor-pointer group">
        {/* Recipe Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Favorite Button Overlay */}
          <div className="absolute top-3 right-3">
            <FavoriteButton
              recipeId={recipe.id}
              isFavorite={isFavorite(recipe.id)}
              onToggle={toggleFavorite}
              className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white/90"
            />
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-6">
          <h3 className="text-xl font-display font-normal text-cookbook-900 mb-3 leading-tight">
            {recipe.title}
          </h3>
          <p className="text-cookbook-600 mb-5 text-sm leading-relaxed font-serif">
            {recipe.description}
          </p>

          {/* Recipe Meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-cookbook-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.prepTime}
              </span>
              <span className="capitalize px-3 py-1 bg-cookbook-100 text-cookbook-700 rounded-full text-xs font-medium">
                {recipe.difficulty}
              </span>
            </div>
            <div className="text-sm font-medium text-cookbook-700">
              {recipe.caloriesPerServing} cal
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-sage-100 text-sage-700 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}