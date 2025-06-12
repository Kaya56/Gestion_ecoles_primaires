import React, { useState } from "react";
import type { FC, ChangeEvent } from "react";

// SearchBar component 
interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    value?: string;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder = "Rechercher...", onSearch, value = "" }) => {
    const [inputValue, setInputValue] = useState<string>(value);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: "1rem"
                }}
            />
        </div>
    );
};

export default SearchBar;