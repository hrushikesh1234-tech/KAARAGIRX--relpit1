
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedLocation?: string;
  setSelectedLocation?: (location: string) => void;
  onSearch?: (query: string) => void;
}

const HeroSection = ({ 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  selectedLocation = '', 
  setSelectedLocation = () => {},
  onSearch = () => {}
}: HeroSectionProps) => {
  const navigate = useNavigate();
  
  const locations = [
    "Khopoli", "Lonavala", "Khandala", "Kamshet", "Vadgaon", "Talegaon"
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to OnRent page with search parameters
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedLocation) params.set('location', selectedLocation);
      
      navigate(`/on-rent?${params.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white -mt-16 pt-16">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Rent Construction Equipment
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Find the perfect machinery for your construction needs
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for equipment, vehicles, machines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-foreground"
                />
              </div>
            </div>
            
            <div className="md:w-64">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 text-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 h-12 px-8"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
