'use client';

import { useMemo } from 'react';
import { useRecipeFilters } from '@/hooks/useRecipeFilters';
import { useRecipes } from '@/hooks/useRecipes';
import { useAllRecipes } from '@/hooks/useAllRecipes';
import { useProcessedRecipes } from '@/hooks/useProcessedRecipes';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { useFilterCounts } from '@/hooks/useFilterCounts';
import { Header } from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { FilterSection } from '@/components/FilterSection';
import { RecipeGrid } from '@/components/RecipeGrid';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

export default function HomePage() {
    // Fetch ALL recipes for search suggestions (unfiltered)
    const { allRecipes } = useAllRecipes();

    // Custom hooks handle all the filtering logic
    const filters = useRecipeFilters();

    // Memoize filter objects to prevent unnecessary re-renders
    // Using JSON.stringify for array comparison - it's simpler and more reliable
    const selectedTagsKey = useMemo(() => JSON.stringify(filters.selectedTags), [filters.selectedTags]);
    const selectedDietaryKey = useMemo(() => JSON.stringify(filters.selectedDietary), [filters.selectedDietary]);

    const recipeFilters = useMemo(() => ({
        debouncedSearchTerm: filters.debouncedSearchTerm,
        selectedTags: filters.selectedTags,
        selectedMealTime: filters.selectedMealTime,
        selectedDifficulty: filters.selectedDifficulty
    }), [
        filters.debouncedSearchTerm,
        selectedTagsKey, // Use memoized key
        filters.selectedMealTime,
        filters.selectedDifficulty
    ]);

    const processingFilters = useMemo(() => ({
        selectedDietary: filters.selectedDietary,
        sortBy: filters.sortBy
    }), [
        selectedDietaryKey, // Use memoized key
        filters.sortBy
    ]);

    const filterCountsInput = useMemo(() => ({
        selectedTags: filters.selectedTags,
        selectedDietary: filters.selectedDietary,
        selectedDifficulty: filters.selectedDifficulty,
        selectedMealTime: filters.selectedMealTime,
        searchQuery: filters.searchQuery
    }), [
        selectedTagsKey, // Use memoized key
        selectedDietaryKey, // Use memoized key
        filters.selectedDifficulty,
        filters.selectedMealTime,
        filters.searchQuery
    ]);

    // Fetch filtered recipes for display
    const { recipes, loading, error } = useRecipes(recipeFilters);

    const filteredRecipes = useProcessedRecipes(recipes, processingFilters);

    // Generate search suggestions from ALL recipes, not just filtered ones
    const searchSuggestions = useSearchSuggestions(allRecipes, filters.searchInput);

    // Generate filter counts for progressive disclosure
    const filterCounts = useFilterCounts(recipes, filterCountsInput);

    // Loading and error states
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="bg-cookbook-50 min-h-screen">
            <Header
                searchTerm={filters.searchInput}
                onSearchChange={filters.setSearchInput}
                onSearch={filters.executeSearch}
                suggestions={searchSuggestions}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PageHeader />

                <FilterSection
                    selectedTags={filters.selectedTags}
                    selectedDietary={filters.selectedDietary}
                    selectedDifficulty={filters.selectedDifficulty}
                    selectedMealTime={filters.selectedMealTime}
                    sortBy={filters.sortBy}
                    hasActiveFilters={filters.hasActiveFilters}
                    onToggleTag={filters.toggleTag}
                    onToggleDietary={filters.toggleDietary}
                    onSetDifficulty={filters.setSelectedDifficulty}
                    onSetMealTime={filters.setSelectedMealTime}
                    onSetSort={filters.setSortBy}
                    onClearAll={filters.clearAllFilters}
                    onSearch={filters.executeSearch}
                    filteredCount={filteredRecipes.length}
                    totalCount={recipes.length}
                    currentSearchQuery={filters.searchQuery}
                    filterCounts={filterCounts}
                />

                <RecipeGrid
                    recipes={filteredRecipes}
                    onClearFilters={filters.clearAllFilters}
                />
            </main>
        </div>
    );
}