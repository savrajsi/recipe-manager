import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY } from '@/lib/constants';

/**
 * Manages search state with suggestions and manual execution
 * Separates user input from actual search queries
 */
export function useSearchWithSuggestions() {
    const [searchInput, setSearchInput] = useState(''); // What user types (for suggestions)
    const [searchQuery, setSearchQuery] = useState(''); // What actually triggers search
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Debounced version for API

    // Only debounce the actual search query, not the input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, DEBOUNCE_DELAY);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Execute search (called when user presses Enter or clicks suggestion)
    const executeSearch = (query: string) => {
        const trimmedQuery = query.trim();
        setSearchInput(trimmedQuery);
        setSearchQuery(trimmedQuery);
    };

    // Clear search
    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setDebouncedQuery('');
    };

    return {
        searchInput,        // Current input value (for input field)
        searchQuery,        // Current search query (for display)
        debouncedQuery,     // Debounced query (for API calls)
        setSearchInput,     // Update input as user types
        executeSearch,      // Execute search with given query
        clearSearch,        // Clear all search state
    };
}
