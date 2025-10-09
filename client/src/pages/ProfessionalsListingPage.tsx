import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SearchBar from "@/components/SearchBar";
import ProfessionalCard from "@/components/professionals/ProfessionalCard";
import { Professional } from "@/lib/types";
import { useProfessionals } from "@/hooks/useProfessionals";

const ProfessionalsListingPage = () => {
  const [activeTab, setActiveTab] = useState('Contractors');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const routerLocation = useLocation();
  const queryParams = new URLSearchParams(routerLocation.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(queryParams.get('location') || '');
  const [sortBy, setSortBy] = useState('rating');
  const navigate = useNavigate();
  
  // Fetch professionals from API
  const profession = activeTab.toLowerCase().slice(0, -1); // 'contractors' -> 'contractor'
  const { data: professionals = [], isLoading } = useProfessionals({
    profession,
    location: selectedLocation || undefined,
    search: searchTerm || undefined,
    sortBy: sortBy || undefined
  });
  
  // Update URL when filters change
  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('type', activeTab.toLowerCase());
    if (selectedLocation) newSearchParams.set('location', selectedLocation);
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (minRating > 0) newSearchParams.set('minRating', minRating.toString());
    if (minExperience > 0) newSearchParams.set('minExperience', minExperience.toString());
    if (sortBy) newSearchParams.set('sortBy', sortBy);

    const queryString = newSearchParams.toString();
    navigate(`/professionals${queryString ? `?${queryString}` : ''}`);
  };

  useEffect(() => {
    applyFilters();
  }, [activeTab, selectedLocation, searchTerm, minRating, minExperience, sortBy, navigate]);

  useEffect(() => {
    // Scroll to top when the component mounts or when search params change
    window.scrollTo(0, 0);
    
    const locParam = queryParams.get('location');
    const typeParam = queryParams.get('type');
    if (locParam) {
      setLocationFilter(locParam);
      setSelectedLocation(locParam);
    }
    if (typeParam) {
      if (typeParam.toLowerCase() === 'contractor') setActiveTab('Contractors');
      else if (typeParam.toLowerCase() === 'architect') setActiveTab('Architects');
    }
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.search, queryParams]);

  // Get unique locations from fetched professionals
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(professionals.map(pro => pro.location?.split(',')[0]?.trim()).filter(Boolean)));
  }, [professionals]);
  
  // Client-side filter for rating and experience (API doesn't support these filters yet)
  const filteredProfessionals = useMemo(() => {
    let filtered = professionals.filter(pro => {
      const matchesRating = pro.rating >= minRating;
      const matchesExperience = pro.experience >= minExperience;
      return matchesRating && matchesExperience;
    });
    
    // Sort professionals
    return filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [professionals, minRating, minExperience, sortBy]);
  const totalCount = filteredProfessionals.length;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const clearFilter = (filter: string) => {
    if (filter === 'location') {
      setSelectedLocation('');
    }
    if (filter === 'search') setSearchTerm('');
    if (filter === 'rating') setMinRating(0);
    if (filter === 'experience') setMinExperience(0);
    if (filter === 'all') {
      setSelectedLocation('');
      setSearchTerm('');
      setMinRating(0);
      setMinExperience(0);
      setSortBy('rating');
    }
  };

  const isAnyFilterActive = selectedLocation || searchTerm || minRating > 0 || minExperience > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Find Professionals | Kamshet.Build</title>
        <meta name="description" content={`Find the best construction professionals in Kamshet for your project`} />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-center mb-4">Find Professionals</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
        
        {/* Mobile Filter Controls - Collapsible */}
        <div className="mb-4">
          <button 
            onClick={() => document.getElementById('filterControls')?.classList.toggle('hidden')} 
            className="w-full flex items-center justify-between bg-gray-800 text-white py-2 px-3 rounded-md mb-2 text-sm font-medium"
          >
            <span>Filter & Sort</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div id="filterControls" className="hidden space-y-2">
            {/* Location Filter */}
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
              <select 
                className="w-full bg-gray-700 text-white rounded-md px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((loc: string) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Rating Filter */}
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Min Rating: {minRating.toFixed(1)}+
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5" 
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Any</span>
                  <span>5.0</span>
                </div>
              </div>
              
              {/* Experience Filter */}
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Experience: {minExperience}+ yrs
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="1" 
                  value={minExperience}
                  onChange={(e) => setMinExperience(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Any</span>
                  <span>20y</span>
                </div>
              </div>
            </div>
            
            {/* Sort By */}
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <label className="block text-xs font-medium text-gray-300 mb-1">Sort By</label>
              <select 
                className="w-full bg-gray-700 text-white rounded-md px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Active Filters - Horizontal Scrollable */}
        {isAnyFilterActive && (
          <div className="mb-3 overflow-x-auto whitespace-nowrap pb-1 -mx-4 px-4">
            <div className="flex gap-2 w-max min-w-full">
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span className="truncate max-w-[80px]">"{searchTerm}"</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('search')}
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {selectedLocation && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span>{selectedLocation}</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('location')}
                    aria-label="Remove location filter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {minRating > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span>{minRating}+★</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('rating')}
                    aria-label="Clear rating filter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {minExperience > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span>{minExperience}+ yrs</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('experience')}
                    aria-label="Clear experience filter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              <button 
                className="text-blue-400 text-xs font-medium"
                onClick={() => clearFilter('all')}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Tab Toggle */}
        <div className="flex mb-3 border-b border-gray-700">
          {['Contractors', 'Architects'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-xs font-medium ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200">
            Found {totalCount} {activeTab}
            {isAnyFilterActive && " matching your filters"}
          </h2>
        </div>
        
        {/* Results List */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((professional) => {
              const portfolioImages = professional.projects
                ?.filter(p => p.coverImage)
                .map(p => p.coverImage as string)
                .slice(0, 3) || [];
              
              return (
                <ProfessionalCard 
                  key={professional.id} 
                  professional={professional}
                  portfolioImages={portfolioImages}
                />
              );
            })
          ) : (
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50 col-span-2 text-center">
              <p className="text-gray-300">No professionals found matching your criteria.</p>
              <p className="mt-2 text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsListingPage;
