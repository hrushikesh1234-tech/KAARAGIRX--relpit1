import React from 'react';
// Import Lucide icons using require
import { CheckCircle } from 'lucide-react';

export interface Subcategory {
  name: string;
  slug: string;
  image: string;
}

interface SubcategoryFilterProps {
  category?: string;
  subcategory?: string;
  subcategories: Subcategory[];
  onSelect: (name: string) => void;
}

export const SubcategoryFilter: React.FC<SubcategoryFilterProps> = ({
  category,
  subcategory,
  subcategories,
  onSelect
}) => {
  if (subcategories.length === 0) {
    return (
      <div className="py-2 text-center text-gray-500 border-b border-gray-100">
        No subcategories found for this category.
      </div>
    );
  }

  return (
    <div className="border-b border-gray-100">
      <div className="relative pb-2">
        <div 
          className="flex overflow-x-auto -mx-2"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            cursor: 'grab',
            paddingBottom: '4px'
          }}
          onMouseDown={(e) => {
            // Enable horizontal scrolling with mouse drag
            const container = e.currentTarget;
            const startX = e.pageX - container.offsetLeft;
            const scrollLeft = container.scrollLeft;
            
            const handleMouseMove = (e: MouseEvent) => {
              e.preventDefault();
              const x = e.pageX - container.offsetLeft;
              const walk = (x - startX) * 2;
              container.scrollLeft = scrollLeft - walk;
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
              container.style.cursor = 'grab';
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp, { once: true });
            container.style.cursor = 'grabbing';
          }}
        >
          <div className="flex space-x-3 px-2">
            {/* All Categories Button */}
            <div className="flex-shrink-0 w-20">
              <button
                onClick={() => onSelect('')}
                className={`w-full flex flex-col items-center p-2 rounded-lg transition-all ${
                  !subcategory 
                    ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                aria-label="Show all subcategories"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 mb-1.5">
                  <img 
                    src={
                      category?.toLowerCase() === 'stone-dust' ? 
                      '/images/categories/stone dust.jpg' :
                      category?.toLowerCase() === 'aggregate' ?
                      '/images/categories/AGGREGATE.jpg' :
                      category?.toLowerCase() === 'rubblestone' ?
                      '/images/categories/Rubblestone.jfif' :
                      category ? 
                      `/images/categories/${category.toLowerCase()}.jpg` :
                      '/images/placeholder.jpg'
                    }
                    alt="All"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  {!subcategory && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium text-center truncate w-full ${
                  !subcategory ? 'text-blue-700 font-semibold' : 'text-gray-700'
                }`}>
                  All
                </span>
              </button>
            </div>

            {/* Subcategory Buttons */}
            {subcategories.map((subcat) => {
              const isSelected = subcategory?.toLowerCase() === subcat.slug.toLowerCase();
              return (
                <div key={subcat.slug} className="flex-shrink-0 w-20">
                  <button
                    onClick={() => onSelect(subcat.name)}
                    className={`w-full flex flex-col items-center p-2 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-label={`Filter by ${subcat.name}`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 mb-1.5">
                      <img 
                        src={subcat.image} 
                        alt={subcat.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                        }}
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium text-center truncate w-full ${
                      isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                    }`}>
                      {subcat.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
