import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
  className?: string;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder = 'Rechercher...', onSearch, value = '', className = '' }) => {
  const [inputValue, setInputValue] = useState<string>(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
      />
    </div>
  );
};

export default SearchBar;