
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Construction, Building, Building2, Forklift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  selectedCategory: string;
  setSelectedCategory?: (category: string) => void;
  onCategorySelect?: (category: string) => void;
}

const CategoryGrid = ({ 
  selectedCategory, 
  setSelectedCategory = (category: string) => {},
  onCategorySelect = (category: string) => {}
}: CategoryGridProps) => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "earthmoving",
      name: "Earthmoving Equipment",
      icon: Construction,
      description: "JCB, Excavators, Bulldozers",
      count: "120+ items",
      image: "/images/Categories-OnRent/Earthmoving_Equipments.jpg"
    },
    {
      id: "transport",
      name: "Transport Vehicles",
      icon: Truck,
      description: "Dump Trucks, Trailers, Tankers",
      count: "85+ items",
      image: "/images/Categories-OnRent/Transport_vehicles .jpg"
    },
    {
      id: "concrete",
      name: "Concrete Equipment",
      icon: Building,
      description: "Mixers, Pumps, Vibrators",
      count: "65+ items",
      image: "/images/Categories-OnRent/Concrete_Equipments.jpg"
    },
    {
      id: "lifting",
      name: "Lifting Equipment",
      icon: Forklift,
      description: "Cranes, Forklifts, Hoists",
      count: "90+ items",
      image: "/images/Categories-OnRent/Lifting_equipments.jpg"
    },
    {
      id: "road-construction",
      name: "Road Construction",
      icon: Building2,
      description: "Pavers, Rollers, Milling",
      count: "45+ items",
      image: "/images/Categories-OnRent/Road_construction.jpg"
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Update the path to match the route defined in App.tsx
    navigate(`/onrent/category/${categoryId}`);
    
    // Also update the selected category in the parent component if needed
    if (setSelectedCategory) {
      setSelectedCategory(categoryId);
    }
    
    // Call the onCategorySelect callback if provided
    onCategorySelect(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Browse by Category
        </h2>
        <p className="text-muted-foreground text-lg">
          Find the right equipment for your construction needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <div 
              key={category.id}
              className={cn(
                "relative p-[1px] rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 group-hover:opacity-80 transition-all duration-300 hover:scale-105",
                "hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]",
                isSelected ? 'ring-2 ring-orange-500' : ''
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              <Card className="relative overflow-hidden h-full bg-card/80 backdrop-blur-sm border-0">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-[0.2px]" />
              </div>
              
              <CardContent className="relative z-10 p-6 text-center">
                <div className={cn(
                  "mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300",
                  isSelected 
                    ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30' 
                    : 'bg-white/20 text-white group-hover:bg-gradient-to-br group-hover:from-cyan-400/30 group-hover:to-blue-500/30 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                )}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white drop-shadow-md mb-2">
                  {category.name}
                </h3>
                <p className="text-white/90 text-sm drop-shadow-md">
                  {category.description}
                </p>
                <p className="text-xs text-white/80 mt-2 drop-shadow-md">
                  {category.count}
                </p>
              </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
