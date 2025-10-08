import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Heart, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRentalEquipment, type RentalEquipment } from "@/hooks/useRentalEquipment";

interface EquipmentGridProps {
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
}

const EquipmentGrid = ({ searchQuery, selectedCategory, selectedLocation }: EquipmentGridProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();

  const { data: equipment = [], isLoading, error } = useRentalEquipment({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    available: true
  });

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleCardClick = (id: number) => {
    navigate(`/onrent/equipment/${id}`);
  };

  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      // Filter by location if selected
      if (selectedLocation && item.location && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [equipment, selectedLocation]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading equipment. Please try again.</p>
      </div>
    );
  }

  if (filteredEquipment.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No equipment found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEquipment.map((item) => (
        <Card 
          key={item.id} 
          className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => handleCardClick(item.id)}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image || '/images/default-equipment.jpg'}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <button 
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
              onClick={(e) => toggleFavorite(e, item.id)}
            >
              <Heart 
                className={`h-5 w-5 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
            <Badge className="absolute top-2 left-2">
              {item.subcategory || item.category}
            </Badge>
            {item.availability && (
              <Badge 
                className={`absolute bottom-2 right-2 ${
                  item.availability === 'Available' 
                    ? 'bg-green-500' 
                    : 'bg-orange-500'
                }`}
              >
                {item.availability}
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                {item.supplier && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>{item.supplier}</span>
                    {item.merchantRating && Number(item.merchantRating) > 4 && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              
              {item.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.location}
                </div>
              )}
              
              {(item.rating !== undefined && item.rating > 0) && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.rating?.toFixed(1)} ({item.reviews || 0})
                  </span>
                </div>
              )}
              
              {item.features && item.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {item.price || `₹${Number(item.dailyRate).toLocaleString()}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    per {item.period || 'day'}
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/onrent/equipment/${item.id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentGrid;
