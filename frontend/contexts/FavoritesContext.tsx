'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (recipeId: string) => void;
    isFavorite: (recipeId: string) => boolean;
    clearFavorites: () => void;
    isLoaded: boolean;
    favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
    children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('recipe-favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (error) {
                console.error('Error parsing favorites from localStorage:', error);
                setFavorites([]);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('recipe-favorites', JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    const toggleFavorite = (recipeId: string) => {
        setFavorites(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const isFavorite = (recipeId: string) => favorites.includes(recipeId);

    const clearFavorites = () => setFavorites([]);

    const value: FavoritesContextType = {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        isLoaded,
        favoritesCount: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites(): FavoritesContextType {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
