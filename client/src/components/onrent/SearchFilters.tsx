
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface SearchFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  onCategorySelect?: (category: string) => void;
  onLocationSelect?: (location: string) => void;
}

const SearchFilters = ({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedLocation, 
  onCategorySelect = () => {},
  onLocationSelect = () => {}
}: SearchFiltersProps) => {
  const [priceRange, setPriceRange] = useState([1000, 10000]);

  const categories = [
    { id: "earthmoving", name: "Earthmoving Equipment", count: 120 },
    { id: "transport", name: "Transport Vehicles", count: 85 },
    { id: "concrete", name: "Concrete Equipment", count: 65 },
    { id: "lifting", name: "Lifting Equipment", count: 90 },
    { id: "road-construction", name: "Road Construction", count: 45 },
    { id: "drilling", name: "Drilling Equipment", count: 35 },
    { id: "compaction", name: "Compaction Equipment", count: 40 }
  ];

  const features = [
    { id: "driver-included", name: "Driver Included" },
    { id: "fuel-included", name: "Fuel Included" },
    { id: "insurance", name: "Insurance Covered" },
    { id: "gps-tracking", name: "GPS Tracking" },
    { id: "24-7-support", name: "24/7 Support" },
    { id: "maintenance", name: "Maintenance Included" }
  ];

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={category.id}
                checked={selectedCategory === category.id}
                onCheckedChange={() => {
                  const newCategory = selectedCategory === category.id ? "" : category.id;
                  setSelectedCategory(newCategory);
                  onCategorySelect(newCategory);
                }}
              />
              <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <span>{category.name}</span>
                  <span className="text-muted-foreground text-sm">({category.count})</span>
                </div>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range (per day)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={20000}
              min={500}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox id={feature.id} />
              <Label htmlFor={feature.id} className="cursor-pointer">
                {feature.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;
