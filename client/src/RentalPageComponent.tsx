import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/onrent/HeroSection";
import CategoryGrid from "@/components/onrent/CategoryGrid";
import FeaturedListings from "@/components/onrent/FeaturedListings";
import SearchFilters from "@/components/onrent/SearchFilters";
import EquipmentGrid from "@/components/onrent/EquipmentGrid";

const RentalPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    // Get search parameters from URL
    const searchParam = searchParams.get('search');
    const locationParam = searchParams.get('location');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (locationParam) {
      setSelectedLocation(locationParam);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedLocation={selectedLocation}
        setSelectedLocation={handleLocationSelect}
      />
      <div className="container mx-auto px-4 py-8">
        <SearchFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategorySelect}
          selectedLocation={selectedLocation}
          onCategorySelect={handleCategorySelect}
          onLocationSelect={handleLocationSelect}
        />
        <CategoryGrid 
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategorySelect}
          onCategorySelect={handleCategorySelect}
        />
        <FeaturedListings />
        <EquipmentGrid 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
};

export default RentalPage;
