'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SortOption } from '@/lib/constants';
import { useSearchWithSuggestions } from '@/hooks/useSearchWithSuggestions';

interface FiltersContextType {
    // Search state (from search hook)
    searchInput: string;
    searchQuery: string;
    debouncedSearchTerm: string;

    // Filter state
    selectedTags: string[];
    selectedDietary: string[];
    selectedDifficulty: string;
    selectedMealTime: string;
    sortBy: SortOption;
    hasActiveFilters: boolean;
    showFavoritesOnly: boolean;

    // Search actions
    setSearchInput: (input: string) => void;
    executeSearch: (query: string) => void;

    // Filter setters
    setSelectedDifficulty: (difficulty: string) => void;
    setSelectedMealTime: (mealTime: string) => void;
    setSortBy: (sort: SortOption) => void;

    // Filter actions
    toggleTag: (tag: string) => void;
    toggleDietary: (dietary: string) => void;
    toggleFavoritesOnly: () => void;
    clearAllFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

interface FiltersProviderProps {
    children: ReactNode;
}

export function FiltersProvider({ children }: FiltersProviderProps) {
    // Use the search hook for enhanced search functionality
    const searchHook = useSearchWithSuggestions();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficultyState] = useState<string>('');
    const [selectedMealTime, setSelectedMealTimeState] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

    // Simple filter toggle functions
    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const toggleDietary = (dietary: string) => {
        setSelectedDietary(prev =>
            prev.includes(dietary) ? prev.filter(d => d !== dietary) : [...prev, dietary]
        );
    };

    const setSelectedDifficulty = (difficulty: string) => {
        // Handle toggle behavior: if clicking the same difficulty, clear it
        const newDifficulty = selectedDifficulty === difficulty ? '' : difficulty;
        setSelectedDifficultyState(newDifficulty);
    };

    const setSelectedMealTime = (mealTime: string) => {
        // Handle toggle behavior: if clicking the same meal time, clear it
        const newMealTime = selectedMealTime === mealTime ? '' : mealTime;
        setSelectedMealTimeState(newMealTime);
    };

    const toggleFavoritesOnly = () => {
        setShowFavoritesOnly(prev => !prev);
    };

    // Custom executeSearch that clears all filters before searching
    const executeSearchWithFilterClear = (query: string) => {
        // Clear all existing filters when starting a new search
        setSelectedTags([]);
        setSelectedDietary([]);
        setSelectedDifficultyState('');
        setSelectedMealTimeState('');
        setSortBy('newest');
        setShowFavoritesOnly(false);

        // Then execute the search
        searchHook.executeSearch(query);
    };

    const clearAllFilters = () => {
        searchHook.clearSearch();
        setSelectedTags([]);
        setSelectedDietary([]);
        setSelectedDifficultyState('');
        setSelectedMealTimeState('');
        setSortBy('newest');
        setShowFavoritesOnly(false);
    };

    // Check if any filters are active
    const hasActiveFilters = selectedTags.length > 0 ||
        selectedDietary.length > 0 ||
        selectedDifficulty !== '' ||
        selectedMealTime !== '' ||
        searchHook.searchQuery !== '' ||
        showFavoritesOnly;

    const value: FiltersContextType = {
        // Search state (from search hook)
        searchInput: searchHook.searchInput,
        searchQuery: searchHook.searchQuery,
        debouncedSearchTerm: searchHook.debouncedQuery,

        // Filter state
        selectedTags,
        selectedDietary,
        selectedDifficulty,
        selectedMealTime,
        sortBy,
        hasActiveFilters,
        showFavoritesOnly,

        // Search actions
        setSearchInput: searchHook.setSearchInput,
        executeSearch: executeSearchWithFilterClear, // Use custom version that clears filters

        // Filter setters
        setSelectedDifficulty,
        setSelectedMealTime,
        setSortBy,

        // Filter actions
        toggleTag,
        toggleDietary,
        toggleFavoritesOnly,
        clearAllFilters,
    };

    return (
        <FiltersContext.Provider value={value}>
            {children}
        </FiltersContext.Provider>
    );
}

export function useFilters(): FiltersContextType {
    const context = useContext(FiltersContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FiltersProvider');
    }
    return context;
}
