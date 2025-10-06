import React from 'react';
import { Link } from 'react-router-dom';

interface DealerFiltersProps {
  category?: string;
  subcategory?: string;
  locationFilter: string;
  sortBy: string;
  uniqueLocations: string[];
  onLocationChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const DealerFilters: React.FC<DealerFiltersProps> = ({
  category,
  subcategory,
  locationFilter,
  sortBy,
  uniqueLocations,
  onLocationChange,
  onSortChange
}) => {
  return (
    <div className="fixed top-14 left-0 right-0 bg-white z-10">
      <div className="max-w-7xl mx-auto px-4 bg-white">
        <div className="pt-1 pb-0">
          <div className="flex items-center">
            <Link 
              to="/shop" 
              className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back to shop"
            >
              <span className="text-gray-600">⬅️</span>
            </Link>
            <h2 className="text-base font-medium text-gray-900">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
              {subcategory && ` > ${subcategory}`}
            </h2>
          </div>
        </div>

        <div className="py-2">
          <div className="flex flex-row gap-2">
            {/* Location Filter */}
            <div className="relative flex-1">
              <select 
                className="w-full pl-2 pr-6 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white h-8"
                value={locationFilter}
                onChange={(e) => onLocationChange(e.target.value)}
                aria-label="Filter by location"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By Filter */}
            <div className="relative flex-1">
              <select 
                className="w-full pl-2 pr-6 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white h-8"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort by"
              >
                <option value="">Sort by</option>
                <option value="price-high-to-low">Highest to lowest price</option>
                <option value="price-low-to-high">Lowest to highest price</option>
                <option value="highest-rated">Highest rated first</option>
                <option value="lowest-rated">Lowest rated first</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
