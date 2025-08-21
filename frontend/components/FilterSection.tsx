import React, { useState, useRef, useEffect } from 'react';
import { SortOption, FILTER_OPTIONS, TAG_GROUPS, MEAL_TIME_OPTIONS, POPULAR_INGREDIENTS } from '@/lib/constants';

// Simplified TagDropdown Component without counts
interface TagDropdownProps {
    label: string;
    options: readonly string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
}

// Simplified single-select dropdown without counts
interface SingleSelectDropdownProps {
    label: string;
    options: readonly string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

function TagDropdown({ label, options, selectedTags, onToggleTag }: TagDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            {/* Button styled like your existing buttons */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1 rounded text-xs font-medium transition-colors bg-cookbook-100 text-cookbook-700 hover:bg-cookbook-200 border border-cookbook-200 flex items-center gap-1"
            >
                {label}
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-cookbook-200 rounded-lg shadow-lg z-50 min-w-[160px] max-h-64 overflow-y-auto">
                    {options.map(tag => {
                        const isSelected = selectedTags.includes(tag);

                        return (
                            <button
                                key={tag}
                                onClick={() => {
                                    onToggleTag(tag);
                                    // Keep dropdown open for multi-select
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-cookbook-50 flex items-center justify-between transition-colors text-cookbook-800 ${isSelected ? 'bg-cookbook-100 font-medium' : ''
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-cookbook-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {tag}
                                </span>
                                {isSelected && (
                                    <span className="text-cookbook-500">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SingleSelectDropdown({ label, options, selectedValue, onSelect }: SingleSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Create display label with selection info
    const displayLabel = selectedValue
        ? `${label}: ${selectedValue}`
        : label;

    return (
        <div ref={dropdownRef} className="relative">
            {/* Button styled like existing dropdowns */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1 rounded text-xs font-medium transition-colors bg-cookbook-100 text-cookbook-700 hover:bg-cookbook-200 border border-cookbook-200 flex items-center gap-1"
            >
                {displayLabel}
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-cookbook-200 rounded-lg shadow-lg z-50 min-w-[160px] max-h-64 overflow-y-auto">
                    {/* All/Clear option */}
                    <button
                        onClick={() => {
                            onSelect('');
                            setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-cookbook-50 flex items-center justify-between transition-colors text-cookbook-800 ${!selectedValue ? 'bg-cookbook-100 font-medium' : ''}`}
                    >
                        <span className="flex items-center gap-2">
                            {!selectedValue && (
                                <svg className="w-3 h-3 text-cookbook-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            All
                        </span>
                    </button>

                    {/* Individual options */}
                    {options.map(option => {
                        const isSelected = selectedValue === option;

                        return (
                            <button
                                key={option}
                                onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-cookbook-50 flex items-center justify-between transition-colors text-cookbook-800 capitalize ${isSelected ? 'bg-cookbook-100 font-medium' : ''
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-cookbook-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {option}
                                </span>
                                {isSelected && (
                                    <span className="text-cookbook-500">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

interface FilterSectionProps {
    // Filter states
    selectedTags: string[];
    selectedDietary: string[];
    selectedDifficulty: string;
    selectedMealTime: string;
    sortBy: SortOption;
    hasActiveFilters: boolean;
    showFavoritesOnly: boolean;

    // Filter actions
    onToggleTag: (tag: string) => void;
    onToggleDietary: (dietary: string) => void;
    onSetDifficulty: (difficulty: string) => void;
    onSetMealTime: (mealTime: string) => void;
    onSetSort: (sort: SortOption) => void;
    onClearAll: () => void;
    onSearch: (query: string) => void;
    onToggleFavoritesOnly: () => void;

    // Results info
    filteredCount: number;
    totalCount: number;
    currentSearchQuery?: string;
}

export function FilterSection({
    selectedTags,
    selectedDietary,
    selectedDifficulty,
    selectedMealTime,
    sortBy,
    hasActiveFilters,
    showFavoritesOnly,
    onToggleTag,
    onToggleDietary,
    onSetDifficulty,
    onSetMealTime,
    onSetSort,
    onClearAll,
    onSearch,
    onToggleFavoritesOnly,
    filteredCount,
    totalCount,
    currentSearchQuery
}: FilterSectionProps) {
    return (
        <div className="mb-8 space-y-6">
            {/* Search Query Display - moved to top */}
            {currentSearchQuery && (
                <div className="bg-cookbook-100 border border-cookbook-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-cookbook-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm font-medium text-cookbook-700">
                                Showing results for:
                            </span>
                            <span className="text-sm font-semibold text-cookbook-900 bg-white px-2 py-1 rounded">
                                "{currentSearchQuery}"
                            </span>
                        </div>
                        <button
                            onClick={onClearAll}
                            className="text-xs text-cookbook-600 hover:text-cookbook-800 underline"
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            )}

            {/* Popular Ingredients Quick Select */}
            {!currentSearchQuery && (
                <div className="bg-sage-50 border border-sage-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-sage-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-sm font-medium text-sage-700">
                            Quick ingredient search:
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_INGREDIENTS.map((ingredient) => (
                            <button
                                key={ingredient}
                                onClick={() => onSearch(ingredient)}
                                className="px-3 py-1.5 text-xs font-medium bg-white text-sage-700 hover:bg-sage-100 hover:text-sage-800 rounded-full transition-colors duration-200 border border-sage-200 hover:border-sage-300 shadow-sm"
                                title={`Find recipes with ${ingredient}`}
                            >
                                {ingredient}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* All Filters - Consistent Dropdown Layout */}
            <div>
                {/* All Filters as Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-cookbook-700">Filters:</span>

                    {/* Difficulty Dropdown */}
                    <SingleSelectDropdown
                        label="Difficulty"
                        options={FILTER_OPTIONS.difficulty}
                        selectedValue={selectedDifficulty}
                        onSelect={onSetDifficulty}
                    />

                    {/* Meal Time Dropdown */}
                    <SingleSelectDropdown
                        label="Meal Time"
                        options={MEAL_TIME_OPTIONS}
                        selectedValue={selectedMealTime}
                        onSelect={onSetMealTime}
                    />

                    {/* Multi-Select Tag Dropdowns (Dietary, Style & Occasion) */}
                    {Object.entries(TAG_GROUPS).map(([groupKey, group]) => {
                        // Handle dietary vs regular tags differently
                        const isDietaryGroup = groupKey === 'dietary';
                        const relevantSelections = isDietaryGroup ? selectedDietary : selectedTags;
                        const groupSelections = relevantSelections.filter(tag => (group.tags as readonly string[]).includes(tag));
                        const displayText = groupSelections.length > 0
                            ? `${group.label} (${groupSelections.length})`
                            : group.label;

                        return (
                            <TagDropdown
                                key={groupKey}
                                label={displayText}
                                options={group.tags}
                                selectedTags={relevantSelections}
                                onToggleTag={isDietaryGroup ? onToggleDietary : onToggleTag}
                            />
                        );
                    })}

                    {/* Favorites Filter */}
                    <button
                        onClick={onToggleFavoritesOnly}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors border flex items-center gap-1.5 ${showFavoritesOnly
                                ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                : 'bg-cookbook-100 text-cookbook-700 hover:bg-cookbook-200 border-cookbook-200'
                            }`}
                        title={showFavoritesOnly ? 'Show all recipes' : 'Show favorites only'}
                    >
                        <svg className="w-3 h-3" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {showFavoritesOnly ? 'Favorites Only' : 'Favorites'}
                    </button>

                    {/* Clear Filters - Inline with dropdowns */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClearAll}
                            className="text-xs text-cookbook-600 hover:text-cookbook-800 underline ml-2"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {selectedTags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-cookbook-600 text-white"
                            >
                                {tag}
                                <button
                                    onClick={() => onToggleTag(tag)}
                                    className="ml-1 hover:text-cookbook-200 text-xs"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Count and Sort */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-cookbook-600">
                    Showing {filteredCount} of {totalCount} recipes
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-cookbook-700">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSetSort(e.target.value as SortOption)}
                        className="pl-3 pr-10 py-2 border border-cookbook-300 rounded-lg text-sm bg-white text-cookbook-800 focus:ring-2 focus:ring-cookbook-500 focus:border-cookbook-500 outline-none appearance-none bg-no-repeat bg-right"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 8px center',
                            backgroundSize: '16px 16px'
                        }}
                    >
                        {FILTER_OPTIONS.sort.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}