
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Heart, BookCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface EquipmentGridProps {
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
}

const EquipmentGrid = ({ searchQuery, selectedCategory, selectedLocation }: EquipmentGridProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();

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

  const equipmentItems = [
    // Earthmoving Equipment - JCB
    {
      id: 1,
      name: "JCB 3DX Backhoe Loader",
      category: "earthmoving",
      subcategory: "JCB (Backhoe Loader)",
      location: "Khopoli",
      price: "₹2,500",
      period: "per day",
      rating: 4.8,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      features: ["GPS Tracking", "Operator Available", "Fuel Included"],
      availability: "Available"
    },
    {
      id: 2,
      name: "JCB 4DX Backhoe Loader",
      category: "earthmoving",
      subcategory: "JCB (Backhoe Loader)",
      location: "Lonavala",
      price: "₹2,800",
      period: "per day",
      rating: 4.6,
      reviews: 32,
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=300&fit=crop",
      features: ["Advanced Hydraulics", "AC Cabin", "GPS Tracking"],
      availability: "Available"
    },
    {
      id: 3,
      name: "JCB 2DX Mini Backhoe",
      category: "earthmoving",
      subcategory: "JCB (Backhoe Loader)",
      location: "Khandala",
      price: "₹2,200",
      period: "per day",
      rating: 4.7,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=400&h=300&fit=crop",
      features: ["Compact Design", "Easy Operation", "Low Fuel Consumption"],
      availability: "Available"
    },
    
    // Earthmoving Equipment - Bulldozer
    {
      id: 4,
      name: "CAT D6T Bulldozer",
      category: "earthmoving",
      subcategory: "Bulldozer",
      location: "Kamshet",
      price: "₹4,500",
      period: "per day",
      rating: 4.5,
      reviews: 22,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      features: ["Powerful Engine", "GPS Enabled", "Operator Included"],
      availability: "Available"
    },
    {
      id: 5,
      name: "Komatsu D65 Bulldozer",
      category: "earthmoving",
      subcategory: "Bulldozer",
      location: "Vadgaon",
      price: "₹4,200",
      period: "per day",
      rating: 4.4,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
      features: ["Fuel Efficient", "Easy Controls", "Safety Features"],
      availability: "Available"
    },
    {
      id: 6,
      name: "L&T D4 Bulldozer",
      category: "earthmoving",
      subcategory: "Bulldozer",
      location: "Talegaon",
      price: "₹3,800",
      period: "per day",
      rating: 4.3,
      reviews: 15,
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop",
      features: ["Reliable Performance", "Low Maintenance", "24/7 Support"],
      availability: "Rented"
    },

    // Earthmoving Equipment - Excavator
    {
      id: 7,
      name: "Hyundai R220 Excavator",
      category: "earthmoving",
      subcategory: "Excavator",
      location: "Khopoli",
      price: "₹3,500",
      period: "per day",
      rating: 4.7,
      reviews: 35,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
      features: ["20 Ton Capacity", "Long Reach", "AC Cabin"],
      availability: "Available"
    },
    {
      id: 8,
      name: "Tata Hitachi EX200 Excavator",
      category: "earthmoving",
      subcategory: "Excavator",
      location: "Lonavala",
      price: "₹3,200",
      period: "per day",
      rating: 4.6,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
      features: ["Fuel Efficient", "Advanced Hydraulics", "GPS Tracking"],
      availability: "Available"
    },
    {
      id: 9,
      name: "JCB JS210 Excavator",
      category: "earthmoving",
      subcategory: "Excavator",
      location: "Khandala",
      price: "₹3,300",
      period: "per day",
      rating: 4.5,
      reviews: 24,
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop",
      features: ["Precise Control", "Quick Coupler", "Operator Training"],
      availability: "Available"
    },

    // Transport Vehicles - Dump Truck
    {
      id: 10,
      name: "Tata 16T Dump Truck",
      category: "transport",
      subcategory: "Dump Truck / Tipper",
      location: "Kamshet",
      price: "₹3,200",
      period: "per day",
      rating: 4.6,
      reviews: 32,
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop",
      features: ["Driver Included", "Insurance Covered", "24/7 Support"],
      availability: "Available"
    },
    {
      id: 11,
      name: "Mahindra 12T Tipper",
      category: "transport",
      subcategory: "Dump Truck / Tipper",
      location: "Vadgaon",
      price: "₹2,800",
      period: "per day",
      rating: 4.4,
      reviews: 25,
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400&h=300&fit=crop",
      features: ["Hydraulic Tipper", "Good Condition", "Experienced Driver"],
      availability: "Available"
    },
    {
      id: 12,
      name: "Ashok Leyland 14T Dump Truck",
      category: "transport",
      subcategory: "Dump Truck / Tipper",
      location: "Talegaon",
      price: "₹3,000",
      period: "per day",
      rating: 4.5,
      reviews: 29,
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop",
      features: ["Heavy Duty", "GPS Enabled", "Well Maintained"],
      availability: "Available"
    },

    // Concrete Equipment - Concrete Mixers
    {
      id: 13,
      name: "Concrete Mixer 10CFT",
      category: "concrete",
      subcategory: "Concrete Mixers",
      location: "Khopoli",
      price: "₹1,800",
      period: "per day",
      rating: 4.7,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop",
      features: ["Self Loading", "Easy Operation", "Low Maintenance"],
      availability: "Available"
    },
    {
      id: 14,
      name: "Transit Mixer 7CFT",
      category: "concrete",
      subcategory: "Concrete Mixers",
      location: "Lonavala",
      price: "₹2,200",
      period: "per day",
      rating: 4.5,
      reviews: 22,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop",
      features: ["Mobile Mixing", "Timer Control", "Quality Output"],
      availability: "Available"
    },
    {
      id: 15,
      name: "Batch Mixer 5CFT",
      category: "concrete",
      subcategory: "Concrete Mixers",
      location: "Khandala",
      price: "₹1,500",
      period: "per day",
      rating: 4.3,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=300&fit=crop",
      features: ["Compact Size", "Efficient Mixing", "Easy Transport"],
      availability: "Available"
    },

    // Lifting Equipment - Mobile Cranes
    {
      id: 16,
      name: "Mobile Crane 25T",
      category: "lifting",
      subcategory: "Mobile Cranes",
      location: "Kamshet",
      price: "₹5,500",
      period: "per day",
      rating: 4.9,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop",
      features: ["Certified Operator", "Safety Certified", "Emergency Service"],
      availability: "Available"
    },
    {
      id: 17,
      name: "Hydra Crane 14T",
      category: "lifting",
      subcategory: "Mobile Cranes",
      location: "Vadgaon",
      price: "₹4,200",
      period: "per day",
      rating: 4.6,
      reviews: 41,
      image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&h=300&fit=crop",
      features: ["Telescopic Boom", "All Terrain", "Quick Setup"],
      availability: "Available"
    },
    {
      id: 18,
      name: "Pick & Carry Crane 10T",
      category: "lifting",
      subcategory: "Mobile Cranes",
      location: "Talegaon",
      price: "₹3,800",
      period: "per day",
      rating: 4.4,
      reviews: 33,
      image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=300&fit=crop",
      features: ["Compact Design", "Easy Maneuver", "Cost Effective"],
      availability: "Available"
    }
  ];

  const filteredItems = equipmentItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
    
    const matchesLocation = selectedLocation === "" || item.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Available Equipment ({filteredItems.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleCardClick(item.id)}
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <Badge 
                className={`absolute top-3 left-3 ${
                  item.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {item.availability}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                onClick={(e) => toggleFavorite(e, item.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${
                    favorites.includes(item.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600'
                  }`} 
                />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                {item.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{item.location}</span>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
                <span className="text-sm text-muted-foreground">({item.reviews})</span>
              </div>
              
              <div className="space-y-1 mb-4">
                {item.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
                {item.features.length > 2 && (
                  <div className="text-xs text-orange-500">
                    +{item.features.length - 2} more features
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-orange-500">{item.price}</span>
                  <span className="text-sm text-muted-foreground">/{item.period}</span>
                </div>
                <Button 
                  size="sm" 
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={item.availability === 'Rented'}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.availability === 'Available' ? 'Rent Now' : 'Rented'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            No equipment found matching your criteria
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default EquipmentGrid;
