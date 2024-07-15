import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce'; // Import debounce from lodash

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const debouncedSearch = debounce((query) => {
    onSearch(query);
  }, 300); // Adjust debounce delay as needed

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel(); // Clean up the debounce
    };
  }, [query]);

  return (
    <input
      type="text"
      placeholder="Search videos..."
      value={query}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
