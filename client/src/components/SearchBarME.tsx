
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SearchCheck, User, MessageCircle, Phone, Video } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  type: 'chat' | 'contact';
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
  timestamp?: string;
  status?: 'online' | 'offline' | 'away';
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchResults?: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
}

export const SearchBar = ({ onSearch, searchResults = [], onResultClick }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchQuery('');
    setIsActive(false);
    setIsFocused(false);
    onSearch('');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsActive(query.length > 0);
    onSearch(query);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
      setSearchQuery('');
      setIsActive(false);
      setIsFocused(false);
    }
  };

  const hasResults = searchResults.length > 0 && searchQuery.length > 0;
  const showNoResults = searchQuery.length > 0 && searchResults.length === 0;

  return (
    <>
      <div className="bg-[#111111] px-4 py-3 border-b border-[#333333] relative" ref={searchRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#A0A0A0]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            placeholder="Search or start a new chat"
            className="w-full bg-[#333333] text-white placeholder-[#A0A0A0] rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] touch-manipulation"
            autoComplete="off"
          />
          {isActive ? (
            <button
              onClick={handleClear}
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onMouseDown={e => e.preventDefault()} // Prevent focus on mousedown
            >
              <X className="h-4 w-4 text-[#A0A0A0] hover:text-white" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <SearchCheck className="h-4 w-4 text-[#A0A0A0]" />
            </div>
          )}
        </div>

      {/* Search Results Dropdown */}
        {isFocused && (hasResults || showNoResults) && (
          <div className="absolute left-0 right-0 mt-1 bg-[#222222] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {hasResults ? (
              searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="flex items-center p-3 hover:bg-[#333333] cursor-pointer border-b border-[#333333] last:border-b-0"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#444444] flex items-center justify-center overflow-hidden">
                    {result.avatar ? (
                      <img 
                        src={result.avatar} 
                        alt={result.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=random`;
                        }}
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#A0A0A0]" />
                    )}
                  </div>
                  {result.type === 'chat' && result.unreadCount && result.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#00A884] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {result.unreadCount}
                    </span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium truncate">{result.name}</h3>
                    {result.timestamp && (
                      <span className="text-xs text-[#A0A0A0] ml-2 whitespace-nowrap">
                        {result.timestamp}
                      </span>
                    )}
                  </div>
                  {result.lastMessage && (
                    <p className="text-sm text-[#A0A0A0] truncate">
                      {result.lastMessage}
                    </p>
                  )}
                </div>
                <div className="ml-2 flex space-x-1">
                  <button 
                    className="p-1 text-[#A0A0A0] hover:text-[#FFD700]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle message button click
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-[#A0A0A0] hover:text-[#FFD700]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle call button click
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
              ))
            ) : showNoResults ? (
              <div className="p-4 text-center text-[#A0A0A0]">
                <p>No results found for "{searchQuery}"</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};
