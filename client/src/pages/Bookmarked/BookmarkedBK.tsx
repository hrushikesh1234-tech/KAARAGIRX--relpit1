
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Grid3X3, LayoutList, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BookmarkCard from '@/components/BookmarkCardBK';
import CategoryFilter from '@/components/CategoryFilterBK';
import { bookmarkData, BookmarkItem, BookmarkCategory } from '@/data/bookmarkData';
import { cn } from '@/lib/utils';

const Bookmarked = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookmarkCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = bookmarkData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const [showFilters, setShowFilters] = useState(true);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersHeight, setFiltersHeight] = useState(0);

  // Calculate filters height when component mounts
  useEffect(() => {
    if (filtersRef.current) {
      setFiltersHeight(filtersRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="relative">
      {/* Compact Sticky Header with Filters */}
      <div 
        ref={filtersRef}
        className="sticky top-0 z-50 bg-gray-50 border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-4 py-2">
          {/* Main Filter Bar */}
          <div className="flex items-center justify-between gap-2">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white border border-gray-300 rounded-md p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-gray-300 mx-0.5"></div>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'list' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                )}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="w-36">
              <Select value={sortBy} onValueChange={(value: 'date' | 'title') => setSortBy(value)}>
                <SelectTrigger className="h-9 text-sm border-gray-300 bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date" className="text-sm">By Date</SelectItem>
                  <SelectItem value="title" className="text-sm">By Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-1.5 text-sm border-gray-300 bg-white hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Additional Filters (Collapsible) */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          )}

          {/* Results Count */}
          <div className="mt-2 text-sm text-gray-500">
            {filteredAndSortedBookmarks.length} result{filteredAndSortedBookmarks.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Content with adjusted spacing */}
      <div 
        className="container mx-auto px-4"
        style={{ 
          paddingTop: '1rem',
          minHeight: 'calc(100vh - 4rem)'
        }}
      >
        {/* Bookmarks Grid */}
        {filteredAndSortedBookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-2">No bookmarks found</div>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarked;
