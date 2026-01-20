/**
 * useHeader Hook
 * Shared logic for Header component
 * File: useHeader.js
 */
import { useState, useEffect } from 'react';
import { usePathname } from 'expo-router';

/**
 * Header hook
 * @param {Object} options - Hook options
 * @param {Function} [options.onSearch] - Search handler
 * @param {Function} [options.onMenuToggle] - Menu toggle handler
 * @returns {Object} Header state and handlers
 */
const useHeader = ({ onSearch, onMenuToggle } = {}) => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [pathname]);

  return {
    searchValue,
    isMenuOpen,
    isSearchFocused,
    handleSearchChange,
    handleMenuToggle,
    setIsSearchFocused,
    setSearchValue,
    setIsMenuOpen,
  };
};

export default useHeader;

