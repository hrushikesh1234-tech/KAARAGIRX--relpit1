
import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Star, Calendar, Clock, Shield, Truck, Check } from "lucide-react";

interface Equipment {
  id: string | number;
  name: string;
  supplier: string;
  location: string;
  price: string | number;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  dailyPrice: number;
  hourlyPrice: number;
  specifications: Record<string, string>;
  availability: string;
  description: string;
  policies: string[];
}

const EquipmentDetailsOR = () => {
  const { equipmentId } = useParams();
  const location = useLocation();
  const [selectedDuration, setSelectedDuration] = useState("daily");

  // Default specifications
  const defaultSpecifications = {
    "Type": "Construction Equipment",
    "Condition": "Good",
    "Manufacturer": "Not Specified",
    "Model Year": "N/A",
    "Hours Used": "N/A"
  };

  // Get equipment data from route state or use a default if not available
  const equipment: Equipment = {
    ...(location.state?.equipment || {} as Partial<Equipment>),
    id: equipmentId || "unknown",
    name: location.state?.equipment?.name || "Equipment Not Found",
    supplier: location.state?.equipment?.supplier || "Unknown",
    location: location.state?.equipment?.location || "N/A",
    price: location.state?.equipment?.price || "N/A",
    rating: location.state?.equipment?.rating || 0,
    reviews: location.state?.equipment?.reviews || 0,
    image: location.state?.equipment?.image || "/placeholder-equipment.jpg",
    features: Array.isArray(location.state?.equipment?.features) 
      ? location.state.equipment.features 
      : [],
    dailyPrice: Number(location.state?.equipment?.dailyPrice) || 0,
    hourlyPrice: Number(location.state?.equipment?.hourlyPrice) || 0,
    specifications: {
      ...defaultSpecifications,
      ...(location.state?.equipment?.specifications || {})
    } as Record<string, string>,
    availability: location.state?.equipment?.availability || "Unknown",
    description: location.state?.equipment?.description || "Equipment details not available.",
    policies: Array.isArray(location.state?.equipment?.policies)
      ? location.state.equipment.policies
      : []
  };

  // Transform price string to number if it's in the format "₹X,XXX"
  const priceValue = typeof equipment.price === 'string' 
    ? parseInt(equipment.price.replace(/[^0-9]/g, ''), 10) 
    : equipment.price || 0;
    
  const dailyPrice = equipment.dailyPrice || Math.round(priceValue * 0.9); // 10% discount for daily
  const hourlyPrice = equipment.hourlyPrice || Math.round(priceValue / 8); // Assuming 8-hour work day

  const priceOptions = [
    { id: "hourly", label: "Per Hour", price: hourlyPrice },
    { id: "daily", label: "Per Day", price: dailyPrice },
    { id: "weekly", label: "Per Week", price: equipment.dailyPrice * 6.5 },
    { id: "monthly", label: "Per Month", price: equipment.dailyPrice * 25 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-24 -mt-16 pb-6">
        {/* Breadcrumb */}
        <Link 
          to="/onrent" 
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Category
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Single image or placeholder if no image */}
                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={equipment.image || "/placeholder-equipment.jpg"}
                    alt={equipment.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Equipment Info */}
            <div>
              <div className="mb-4">
                <Badge className="mb-2 bg-green-500">{equipment.availability}</Badge>
                <h1 className="text-3xl font-bold text-foreground mb-2">{equipment.name}</h1>
                <p className="text-muted-foreground mb-2">{equipment.supplier}</p>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{equipment.location}</span>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{equipment.rating}</span>
                  <span className="text-muted-foreground">({equipment.reviews} reviews)</span>
                </div>
              </div>

              {/* Pricing */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Select Rental Duration</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {priceOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedDuration === option.id ? "default" : "outline"}
                        className={selectedDuration === option.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                        onClick={() => setSelectedDuration(option.id)}
                      >
                        <div className="text-center">
                          <div className="font-medium">₹{option.price.toLocaleString()}</div>
                          <div className="text-xs">{option.label}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  <Link 
                    to={`/onrent/booking/${equipment.id}`}
                    state={{ 
                      equipment,
                      selectedDuration,
                      selectedPrice: priceOptions.find(opt => opt.id === selectedDuration)?.price || 0
                    }}
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                      Rent Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold">Key Features</h3>
                <ul>
                  {equipment.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="mt-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="policies">Rental Policies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{equipment.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(equipment.specifications || {}).map(([key, value]: [string, string]) => (
                        <div key={key} className="flex justify-between border-b pb-2">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{value || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="policies" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {equipment.policies.map((policy: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                          <span>{policy}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
      </div>
      <div className="pb-16"></div>
    </div>
  );
};

export default EquipmentDetailsOR;
