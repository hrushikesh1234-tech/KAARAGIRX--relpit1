
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Star, MapPin, ChevronRight } from "lucide-react";
import HeroSection from "@/components/onrent/HeroSection";
import CategoryGrid from "@/components/onrent/CategoryGrid";
import QuickActions from "@/components/onrent/QuickActions";

const OnRentOR = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    // Get search parameters from URL
    const searchParam = searchParams.get('search');
    const locationParam = searchParams.get('location');
    
    if (searchParam) setSearchQuery(searchParam);
    if (locationParam) setSelectedLocation(locationParam);
  }, [searchParams]);

  // Featured equipment data from CategoryPageOR.tsx
  const featuredCategories = [
    {
      id: "earthmoving",
      title: "Earthmoving Equipment",
      items: [
        {
          id: 1,
          name: "JCB 3DX Backhoe Loader",
          supplier: "Khopoli Construction Rentals",
          location: "Khopoli",
          price: "₹2,500",
          rating: 4.8,
          reviews: 45,
          image: "/images/sub-categories-OnRent/Earth moving/jcb.png",
          features: ["GPS Tracking", "Operator Available", "Fuel Included"],
        },
        {
          id: 2,
          name: "Bulldozer",
          supplier: "Lonavala Equipment Hub",
          location: "Lonavala",
          price: "₹2,800",
          rating: 4.0,
          reviews: 77,
          image: "/images/sub-categories-OnRent/Earth moving/Bulldozer.png",
          features: ["Advanced Hydraulics", "AC Cabin", "GPS Tracking"],
        },
        {
          id: 3,
          name: "Mini Excavator",
          supplier: "Lonavala Equipment Hub",
          location: "Lonavala",
          price: "₹3,300",
          rating: 3.6,
          reviews: 98,
          image: "/images/sub-categories-OnRent/Earth moving/mini_excavator.png",
          features: ["Compact Design", "Easy Operation", "Low Fuel Consumption"],
        },
        {
          id: 4,
          name: "Motor Grader",
          supplier: "Talegoan Equipment Hub",
          location: "Talegoan",
          price: "₹1,700",
          rating: 4.3,
          reviews: 322,
          image: "/images/sub-categories-OnRent/Earth moving/motor_grader.png",
          features: ["Precision Grading", "Heavy Duty", "GPS Enabled"],
        },
        {
          id: 5,
          name: "Excavator",
          supplier: "Vadgoan Heavy Machinery",
          location: "Vadgaon",
          price: "₹2,200",
          rating: 4.7,
          reviews: 28,
          image: "/images/sub-categories-OnRent/Earth moving/excavator.png",
          features: ["360° Rotation", "Heavy Duty Bucket", "Eco-Friendly"],
        },
        {
          id: 6,
          name: "Skid Steer Loader",
          supplier: "Nangargaon Big Machinery",
          location: "Nangargaon",
          price: "₹5,000",
          rating: 4.7,
          reviews: 28,
          image: "/images/sub-categories-OnRent/Earth moving/skid_steer_loader.png",
          features: ["Compact Design", "Versatile Attachments", "Easy to Operate"],
        },
        {
          id: 7,
          name: "Wheel Loader",
          supplier: "Kamshet Malooc",
          location: "Kamshet",
          price: "₹4,070",
          rating: 4.9,
          reviews: 2,
          image: "/images/sub-categories-OnRent/Earth moving/wheel_loader.png",
          features: ["Large Bucket", "High Power", "Fuel Efficient"],
        }
      ],
    },
    {
      id: "lifting",
      title: "Lifting Equipment",
      items: [
        {
          id: 11,
          name: "Truck Mounted Crane",
          supplier: "Heavy Lifters",
          location: "Mumbai",
          price: "₹18,000",
          rating: 4.6,
          reviews: 67,
          image: "/images/sub-categories-OnRent/lifting equipment/truck-mounted_crane.png",
          features: ["25 Ton Capacity", "4-Section Boom", "LMI System"],
        },
        {
          id: 12,
          name: "Tower Crane",
          supplier: "SkyLift Solutions",
          location: "Pune",
          price: "₹25,000",
          rating: 4.8,
          reviews: 52,
          image: "/images/sub-categories-OnRent/lifting equipment/tall_tower_crane.png",
          features: ["50m Height", "8 Ton Capacity", "Auto-Lube System"],
        },
        {
          id: 13,
          name: "Rope Hoist",
          supplier: "Aerial Access",
          location: "Pune",
          price: "₹3,500",
          rating: 4.4,
          reviews: 38,
          image: "/images/sub-categories-OnRent/lifting equipment/rope_hoist_lifting.png",
          features: ["5 Ton Capacity", "Smooth Operation", "Heavy Duty"],
        },
        {
          id: 14,
          name: "Mobile Crane",
          supplier: "Heavy Lifters",
          location: "Mumbai",
          price: "₹18,000",
          rating: 4.6,
          reviews: 67,
          image: "/images/sub-categories-OnRent/lifting equipment/mobile_crane.png",
          features: ["25 Ton Capacity", "4-Section Boom", "LMI System"],
        },
        {
          id: 15,
          name: "Forklift",
          supplier: "Lift & Move",
          location: "Pune",
          price: "₹2,500",
          rating: 4.3,
          reviews: 56,
          image: "/images/sub-categories-OnRent/lifting equipment/forklift.png",
          features: ["3 Ton Capacity", "Diesel Engine", "Side Shifter"],
        },
        {
          id: 16,
          name: "Crawler Crane",
          supplier: "Heavy Lifters",
          location: "Mumbai",
          price: "₹22,000",
          rating: 4.7,
          reviews: 42,
          image: "/images/sub-categories-OnRent/lifting equipment/crawler_crane.png",
          features: ["40 Ton Capacity", "Crawler Undercarriage", "Heavy Lifting"],
        }
      ],
    },
    {
      id: "road-construction",
      title: "Road Construction",
      items: [
        {
          id: 17,
          name: "Road Roller",
          supplier: "Road Masters",
          location: "Pune",
          price: "₹4,500",
          rating: 4.5,
          reviews: 48,
          image: "/images/sub-categories-OnRent/road constructions/road-roller-.jpg",
          features: ["10 Ton Weight", "Vibration System", "Water Tank"],
        },
        {
          id: 18,
          name: "Asphalt Paver",
          supplier: "Pave Right",
          location: "Mumbai",
          price: "₹12,000",
          rating: 4.7,
          reviews: 36,
          image: "/images/sub-categories-OnRent/road constructions/Asphalt-paver-machine.jpg",
          features: ["6m Paving Width", "Auto Leveling", "Heated Screed"],
        },
        {
          id: 19,
          name: "Cold Milling Machine",
          supplier: "Road Tech",
          location: "Pune",
          price: "₹15,000",
          rating: 4.6,
          reviews: 29,
          image: "/images/sub-categories-OnRent/road constructions/cold_milling_machine.jpg",
          features: ["2m Milling Width", "Level Pro System", "Dust Suppression"],
        },
        {
          id: 20,
          name: "Bitumen Sprayer",
          supplier: "Road Builders",
          location: "Nashik",
          price: "₹8,500",
          rating: 4.4,
          reviews: 31,
          image: "/images/sub-categories-OnRent/road constructions/bitumen_sprayer.jpg",
          features: ["Precision Spraying", "Heated Tank", "Variable Speed"],
        }
      ],
    },
    {
      id: "transport",
      title: "Transport Vehicles",
      items: [
        {
          id: 21,
          name: "Dump Truck",
          supplier: "Heavy Haulers",
          location: "Pune",
          price: "₹6,500",
          rating: 4.5,
          reviews: 58,
          image: "/images/sub-categories-OnRent/Transport vehicles/dump_truck.png",
          features: ["10 Ton Capacity", "Tarp System", "GPS Tracking"],
        },
        {
          id: 22,
          name: "Trailer Truck",
          supplier: "Cargo Movers",
          location: "Mumbai",
          price: "₹5,500",
          rating: 4.4,
          reviews: 47,
          image: "/images/sub-categories-OnRent/Transport vehicles/trailer_truck.png",
          features: ["8 Ton Capacity", "Hydraulic Liftgate", "Tie-down Points"],
        },
        {
          id: 23,
          name: "Tractor",
          supplier: "Agri Haul",
          location: "Nashik",
          price: "₹4,200",
          rating: 4.3,
          reviews: 39,
          image: "/images/sub-categories-OnRent/Transport vehicles/tractor.png",
          features: ["Heavy Duty", "4WD", "Versatile Attachment Options"],
        },
        {
          id: 24,
          name: "Mini Truck",
          supplier: "City Movers",
          location: "Pune",
          price: "₹3,800",
          rating: 4.2,
          reviews: 42,
          image: "/images/sub-categories-OnRent/Transport vehicles/mini_truck.png",
          features: ["Compact Size", "Good Mileage", "Easy to Maneuver"],
        },
        {
          id: 25,
          name: "Container Truck",
          supplier: "Heavy Haulers",
          location: "Mumbai",
          price: "₹7,800",
          rating: 4.6,
          reviews: 35,
          image: "/images/sub-categories-OnRent/Transport vehicles/container_truck.png",
          features: ["20ft/40ft Capacity", "Heavy Duty Chassis", "Secure Locking"],
        },
        {
          id: 26,
          name: "Cement Bulker",
          supplier: "Bulk Transport",
          location: "Pune",
          price: "₹8,500",
          rating: 4.5,
          reviews: 31,
          image: "/images/sub-categories-OnRent/Transport vehicles/cement_bulker.png",
          features: ["30 Ton Capacity", "Pneumatic Discharge", "Dust Control"],
        }
      ],
    },
    {
      id: "concrete",
      title: "Concrete Equipment",
      items: [
        {
          id: 8,
          name: "Concrete Mixer",
          supplier: "Pune Mixers",
          location: "Pune",
          price: "₹3,500",
          rating: 4.5,
          reviews: 63,
          image: "/images/sub-categories-OnRent/Concrete Equipment/concrete_mixer.png",
          features: ["9 Cubic Meter Capacity", "Auto Loading", "Water Tank"],
        },
        {
          id: 9,
          name: "Concrete Batching Plant",
          supplier: "Nashik Construction",
          location: "Nashik",
          price: "₹15,000",
          rating: 4.6,
          reviews: 28,
          image: "/images/sub-categories-OnRent/Concrete Equipment/concrete_batching_plant.png",
          features: ["60m³/h Capacity", "Computer Controlled", "Dust Control"],
        },
        {
          id: 10,
          name: "Power Trowel",
          supplier: "Smooth Finish Co",
          location: "Mumbai",
          price: "₹1,200",
          rating: 4.3,
          reviews: 37,
          image: "/images/sub-categories-OnRent/Concrete Equipment/power_trowel.png",
          features: ["Dual Blade System", "Ergonomic Handle", "Adjustable Speed"],
        }
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <QuickActions />
      <div id="hero-section">
        <HeroSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>
      
      <CategoryGrid 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Featured Categories Carousel */}
      <div className="container mx-auto px-4 py-12">
        {featuredCategories.map((category) => (
          <div key={category.id} className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
              <Link 
                to={`/onrent/category/${category.id}`} 
                className="text-primary hover:underline flex items-center gap-1 text-sm"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
            >
              <CarouselContent>
                {category.items.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 px-3">
                    <Link 
                      to={`/onrent/equipment/${item.id}`}
                      state={{ equipment: item }}
                    >
                      <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-gray-900 border-gray-800">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-bold text-lg drop-shadow-md">{item.name}</h3>
                            <p className="text-gray-300 text-sm">{item.supplier}</p>
                          </div>
                        </div>
                        <CardContent className="p-4 bg-gray-900">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full text-xs font-medium">
                              <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                              {item.rating} <span className="text-gray-400 ml-1">({item.reviews})</span>
                            </div>
                            <div className="flex items-center text-gray-400 text-xs">
                              <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                              {item.location}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.features.slice(0, 2).map((feature, i) => (
                              <span key={i} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                            <div>
                              <span className="text-xs text-gray-400 block">Starting from</span>
                              <span className="text-lg font-bold text-white">{item.price}/day</span>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                              View Details
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4" />
              <CarouselNext className="right-2 md:right-4" />
            </Carousel>
          </div>
        ))}
      </div>
      
      {/* Glowing KARAGIRX Brand */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
            <span className="relative inline-block group">
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-lg blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
                KARAGIRX
              </span>
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Your trusted partner in construction equipment rental solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnRentOR;
