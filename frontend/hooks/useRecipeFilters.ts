import { useState } from 'react';
import { SortOption } from '@/lib/constants';
import { useSearchWithSuggestions } from './useSearchWithSuggestions';

export function useRecipeFilters() {
    // Use the new search hook for enhanced search functionality
    const searchHook = useSearchWithSuggestions();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficultyState] = useState<string>('');
    const [selectedMealTime, setSelectedMealTimeState] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');

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

    // Custom executeSearch that clears all filters before searching
    const executeSearchWithFilterClear = (query: string) => {
        // Clear all existing filters when starting a new search
        setSelectedTags([]);
        setSelectedDietary([]);
        setSelectedDifficultyState('');
        setSelectedMealTimeState('');
        setSortBy('newest');

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
    };

    // Check if any filters are active
    const hasActiveFilters = selectedTags.length > 0 ||
        selectedDietary.length > 0 ||
        selectedDifficulty !== '' ||
        selectedMealTime !== '' ||
        searchHook.searchQuery !== '';

    return {
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
        clearAllFilters,
    };
}
