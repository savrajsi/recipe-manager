import { useState, useEffect, useCallback } from 'react';
import { DetailedRecipe } from '@/types/recipe';

interface UseRecipeScalingReturn {
    currentServings: number;
    scaledRecipe: DetailedRecipe | null;
    loading: boolean;
    error: string | null;
    updateServings: (servings: number) => void;
    resetToOriginal: () => void;
    isScaled: boolean;
}

export function useRecipeScaling(originalRecipe: DetailedRecipe): UseRecipeScalingReturn {
    const [currentServings, setCurrentServings] = useState(originalRecipe.servings);
    const [scaledRecipe, setScaledRecipe] = useState<DetailedRecipe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isScaled = currentServings !== originalRecipe.servings;

    const fetchScaledRecipe = useCallback(async (servings: number) => {
        if (servings === originalRecipe.servings) {
            setScaledRecipe(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/recipes/${originalRecipe.id}/scale/${servings}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to scale recipe');
            }

            const scaled = await response.json();
            setScaledRecipe(scaled);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to scale recipe');
            console.error('Error scaling recipe:', err);
        } finally {
            setLoading(false);
        }
    }, [originalRecipe.id, originalRecipe.servings]);

    const updateServings = useCallback((servings: number) => {
        if (servings < 1 || servings > 50) {
            setError('Serving size must be between 1 and 50');
            return;
        }

        setCurrentServings(servings);
        fetchScaledRecipe(servings);
    }, [fetchScaledRecipe]);

    const resetToOriginal = useCallback(() => {
        setCurrentServings(originalRecipe.servings);
        setScaledRecipe(null);
        setError(null);
    }, [originalRecipe.servings]);

    // Clean up error when servings change
    useEffect(() => {
        if (error && currentServings >= 1 && currentServings <= 50) {
            setError(null);
        }
    }, [currentServings, error]);

    return {
        currentServings,
        scaledRecipe,
        loading,
        error,
        updateServings,
        resetToOriginal,
        isScaled
    };
}
