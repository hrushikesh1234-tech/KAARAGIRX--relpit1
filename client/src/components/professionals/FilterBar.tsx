import { useState, useEffect } from "react";
import { ProfessionalFilter } from "@/lib/types";

interface FilterBarProps {
  onFilterChange: (filters: ProfessionalFilter) => void;
  initialFilters?: ProfessionalFilter;
}

const FilterBar = ({ onFilterChange, initialFilters }: FilterBarProps) => {
  const [filters, setFilters] = useState<ProfessionalFilter>(initialFilters || {});
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  
  const specializations = [
    "Residential",
    "Commercial",
    "Renovation",
    "Interior Design",
    "Eco-friendly Design",
    "Landscape Architecture",
  ];

  // Apply filters when they change
  useEffect(() => {
    if (selectedSpecializations.length > 0) {
      onFilterChange({
        ...filters,
        specialization: selectedSpecializations.join(',')
      });
    } else {
      onFilterChange(filters);
    }
  }, [filters, selectedSpecializations, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specialization)) {
        return prev.filter(s => s !== specialization);
      } else {
        return [...prev, specialization];
      }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      ...filters,
      specialization: selectedSpecializations.join(',')
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              🔍
            </span>
            <input 
              type="text" 
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              placeholder="e.g. Renovation, Bungalow" 
              className="w-full pl-10 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select 
            name="location"
            value={filters.location || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Locations</option>
            <option value="Kamshet">Kamshet</option>
            <option value="Lonavala">Lonavala</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
          <select 
            name="profession"
            value={filters.profession || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Professionals</option>
            <option value="contractor">Contractors</option>
            <option value="architect">Architects</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select 
            name="sortBy"
            value={filters.sortBy || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Highest Rating</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          <div className="flex flex-wrap gap-2">
            {specializations.map(specialization => (
              <span 
                key={specialization}
                className={`px-3 py-1 ${selectedSpecializations.includes(specialization) 
                  ? 'bg-primary text-white' 
                  : 'bg-blue-100 text-primary'} rounded-full text-sm cursor-pointer hover:bg-blue-200`}
                onClick={() => handleSpecializationToggle(specialization)}
              >
                {specialization}
              </span>
            ))}
          </div>
        </div>
        
        <div className="ml-auto">
          <button 
            onClick={handleApplyFilters}
            className="mt-5 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded font-medium transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
