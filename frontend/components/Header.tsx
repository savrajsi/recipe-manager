import { SearchInput } from './SearchInput';

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearch: (query: string) => void;
    suggestions?: string[];
}

export function Header({ searchTerm, onSearchChange, onSearch, suggestions }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm border-b border-cookbook-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <h1 className="text-3xl font-display font-normal text-cookbook-900 tracking-tight">
                        SPRX Kitchens
                    </h1>
                    <div className="flex-1 max-w-lg mx-8">
                        <SearchInput
                            searchTerm={searchTerm}
                            onSearchTermChange={onSearchChange}
                            onSearch={onSearch}
                            suggestions={suggestions}
                            placeholder="Search recipes..."
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
