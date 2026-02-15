/**
 * SearchBar Pattern Re-export Tests
 * Verifies Step 6.5 SearchBar pattern-level exports.
 * File: SearchBar.test.js
 */

import SearchBarPatternModule from '@platform/patterns/SearchBar';
import SearchBarPatternIndex from '@platform/patterns/SearchBar/index.js';
import { SearchBar, useSearchBar } from '@platform/patterns';

describe('SearchBar Pattern Re-exports', () => {
  it('should export default SearchBar from pattern path', () => {
    const SearchBarPattern = SearchBarPatternModule.default || SearchBarPatternModule;
    expect(SearchBarPattern).toBeDefined();
    expect(typeof SearchBarPattern).toBe('function');
  });

  it('should export default SearchBar from pattern index file', () => {
    const SearchBarFromIndex = SearchBarPatternIndex.default || SearchBarPatternIndex;
    expect(SearchBarFromIndex).toBeDefined();
    expect(typeof SearchBarFromIndex).toBe('function');
  });

  it('should export SearchBar and useSearchBar from patterns barrel', () => {
    expect(SearchBar).toBeDefined();
    expect(typeof SearchBar).toBe('function');
    expect(useSearchBar).toBeDefined();
    expect(typeof useSearchBar).toBe('function');
  });
});
