import { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    onSearch: (query: string) => void;
    suggestions?: string[];
    placeholder?: string;
}

export function SearchInput({
    searchTerm,
    onSearchTermChange,
    onSearch,
    suggestions = [],
    placeholder = "Search recipes..."
}: SearchInputProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault();
                onSearch(searchTerm);
                setShowSuggestions(false);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    onSearch(suggestions[selectedIndex]);
                } else {
                    onSearch(searchTerm);
                }
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;

            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchTermChange(value);
        setShowSuggestions(value.length >= 2);
        setSelectedIndex(-1);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        onSearch(suggestion);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    // Handle search button click
    const handleSearchClick = () => {
        onSearch(searchTerm);
        setShowSuggestions(false);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const shouldShowSuggestions = showSuggestions && suggestions.length > 0;

    return (
        <div className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    className="w-full px-4 py-3 pr-12 border border-cookbook-300 rounded-lg focus:ring-2 focus:ring-cookbook-500 focus:border-cookbook-500 outline-none bg-cookbook-50 text-cookbook-800 placeholder-cookbook-500"
                />

                {/* Search Button */}
                <button
                    onClick={handleSearchClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-cookbook-500 hover:text-cookbook-700 transition-colors rounded-md hover:bg-cookbook-100"
                    title="Search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {shouldShowSuggestions && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 bg-white border border-cookbook-200 rounded-lg shadow-lg mt-1 z-50 max-h-64 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full text-left px-4 py-3 hover:bg-cookbook-50 transition-colors border-b border-cookbook-100 last:border-b-0 ${index === selectedIndex ? 'bg-cookbook-100' : ''
                                }`}
                        >
                            <span className="text-cookbook-800 font-serif">
                                {suggestion}
                            </span>
                        </button>
                    ))}

                    {/* Show current input as option if not in suggestions */}
                    {searchTerm && !suggestions.includes(searchTerm) && (
                        <button
                            onClick={() => handleSuggestionClick(searchTerm)}
                            className={`w-full text-left px-4 py-3 hover:bg-cookbook-50 transition-colors border-t border-cookbook-200 ${selectedIndex === suggestions.length ? 'bg-cookbook-100' : ''
                                }`}
                        >
                            <span className="text-cookbook-600 text-sm">
                                Search for "{searchTerm}"
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
