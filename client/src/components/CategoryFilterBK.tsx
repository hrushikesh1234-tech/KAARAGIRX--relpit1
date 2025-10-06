
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkCategory } from '@/data/bookmarkData';
import { cn } from '@/lib/utils';
import styles from './CategoryFilter.module.css';

// Gradient colors for different categories
const categoryGradients = {
  'all': 'from-blue-500 to-blue-600',
  'architect': 'from-purple-500 to-pink-500',
  'contractor': 'from-amber-500 to-orange-500',
  'material': 'from-emerald-500 to-teal-500',
  'machine/vehicle': 'from-red-500 to-orange-500',
  'dealer': 'from-indigo-500 to-blue-500',
  'rental company': 'from-rose-500 to-pink-500',
};

interface CategoryFilterProps {
  selectedCategory: BookmarkCategory | 'all';
  onCategoryChange: (category: BookmarkCategory | 'all') => void;
}

const categories: { value: BookmarkCategory | 'all'; label: string; count: number }[] = [
  { value: 'all', label: 'All', count: 30 },
  { value: 'architect', label: 'Architect', count: 5 },
  { value: 'contractor', label: 'Contractor', count: 5 },
  { value: 'material', label: 'Material', count: 5 },
  { value: 'machine/vehicle', label: 'Machine/Vehicle', count: 5 },
  { value: 'dealer', label: 'Dealer', count: 5 },
  { value: 'rental company', label: 'Rental Company', count: 5 },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle mouse down for drag scrolling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.userSelect = 'none';
  }, []);

  // Handle mouse leave/up to stop dragging
  const handleMouseUpOrLeave = useCallback(() => {
    if (!containerRef.current) return;
    
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
    containerRef.current.style.removeProperty('user-select');
  }, []);

  // Handle mouse move for drag scrolling
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        className={`${styles.scrollContainer} ${isDragging ? styles.grabbing : ''}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
      >
        {categories.map((category) => (
          <Button
            key={category.value}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              'group relative flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden',
              category.value === 'machine/vehicle' ? 'min-w-[140px]' : 
              category.value === 'rental company' ? 'min-w-[150px]' : 'min-w-[100px]',
              selectedCategory === category.value
                ? 'text-white border-transparent shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              `bg-gradient-to-r ${categoryGradients[category.value as keyof typeof categoryGradients] || 'from-gray-500 to-gray-600'}`
            )}
            style={{
              backgroundSize: selectedCategory === category.value ? '100% 100%' : '200% 200%',
              backgroundPosition: selectedCategory === category.value ? 'center' : 'left center',
              transition: 'all 0.3s ease',
            }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {category.label}
              <span 
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium',
                  selectedCategory === category.value
                    ? 'bg-white/20 text-white/90 backdrop-blur-sm'
                    : 'bg-white/80 text-gray-700 group-hover:bg-white/90'
                )}
              >
                {category.count}
              </span>
            </span>
            {selectedCategory === category.value && (
              <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
