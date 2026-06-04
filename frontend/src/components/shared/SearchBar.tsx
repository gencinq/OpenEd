import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = ''
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-11 pl-11 pr-4 rounded-lg border border-input bg-card text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-sm transition-all focus:border-indigo-500"
      />
      <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
    </form>
  );
};
export default SearchBar;
