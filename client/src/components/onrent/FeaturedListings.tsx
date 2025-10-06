
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const FeaturedListings = () => {
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/onrent/equipment/${id}`);
  };

  const featuredItems = [
    {
      id: 1,
      name: "JCB 3DX Backhoe Loader",
      category: "Earthmoving",
      location: "Khopoli",
      price: "₹2,500",
      period: "per day",
      rating: 4.8,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      features: ["GPS Tracking", "Operator Available", "Fuel Included"]
    },
    {
      id: 10,
      name: "Tata 16T Dump Truck",
      category: "Transport",
      location: "Lonavala",
      price: "₹3,200",
      period: "per day",
      rating: 4.6,
      reviews: 32,
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop",
      features: ["Driver Included", "Insurance Covered", "24/7 Support"]
    },
    {
      id: 13,
      name: "Concrete Mixer 10CFT",
      category: "Concrete",
      location: "Khandala",
      price: "₹1,800",
      period: "per day",
      rating: 4.7,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop",
      features: ["Self Loading", "Easy Operation", "Low Maintenance"]
    },
    {
      id: 16,
      name: "Mobile Crane 25T",
      category: "Lifting",
      location: "Kamshet",
      price: "₹5,500",
      period: "per day",
      rating: 4.9,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&h=300&fit=crop",
      features: ["Certified Operator", "Safety Certified", "Emergency Service"]
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Equipment
          </h2>
          <p className="text-muted-foreground text-lg">
            Top-rated construction equipment available for rent
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
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
                <Badge className="absolute top-3 left-3 bg-orange-500">
                  Featured
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                
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
                  {item.features.map((feature, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-orange-500">{item.price}</span>
                    <span className="text-sm text-muted-foreground">/{item.period}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Rent Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;
