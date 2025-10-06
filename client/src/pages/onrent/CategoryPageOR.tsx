
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CategoryPageOR = () => {
  const { categoryId } = useParams();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");

  const locations = [
    "Khopoli", "Lonavala", "Khandala", "Kamshet", "Vadgaon", "Talegaon"
  ];

  const categoryData: Record<string, any> = {
    "earthmoving": {
      name: "Earthmoving Equipment",
      subcategories: [
        "JCB (Backhoe Loader)",
        "Bulldozer", 
        "Excavator",
        "Skid Steer Loader",
        "Wheel Loader",
        "Motor Grader",
        "Mini Excavator"
      ]
    },
    "transport": {
      name: "Transport Vehicles",
      subcategories: [
        "Dump Truck / Tipper",
        "Trailer Truck",
        "Container Truck", 
        "Cement Bulker",
        "Water Tanker",
        "Diesel Tanker",
        "Tractor Trolley",
        "Pickup Truck",
        "Tempo",
        "Mini Trucks"
      ]
    },
    "concrete": {
      name: "Concrete Equipment",
      subcategories: [
        "Concrete Mixers",
        "Concrete Pump",
        "Batching Plant",
        "Transit Mixer",
        "Vibrator",
        "Power Trowel",
        "Screed Vibrators"
      ]
    },
    "lifting": {
      name: "Lifting Equipment",
      subcategories: [
        "Mobile Cranes",
        "Tower Cranes",
        "Crawler Cranes",
        "Truck-Mounted Crane",
        "Gantry Crane",
        "Forklifts",
        "Hoists & Winches"
      ]
    },
    "road-construction": {
      name: "Road Construction",
      subcategories: [
        "Asphalt Paver",
        "Road Roller",
        "Bitumen Sprayer",
        "Cold Milling Machine",
        "Chip Spreader"
      ]
    }
  };

  const sampleEquipment = [
    {
      id: 1,
      name: "JCB 3DX Backhoe Loader",
      supplier: "Khopoli Construction Rentals",
      location: "Khopoli",
      price: "₹2,500",
      period: "per day",
      rating: 4.8,
      reviews: 45,
      image: "/images/sub-categories-OnRent/Earth moving/jcb.png",
      features: ["GPS Tracking", "Operator Available", "Fuel Included"],
      availability: "Available"
    },
    {
      id: 2,
      name: "Bulldozer",
      supplier: "Lonavala Equipment Hub",
      location: "Lonavala", 
      price: "₹2,800",
      period: "per day",
      rating: 4.0,
      reviews: 77,
      image: "/images/sub-categories-OnRent/Earth moving/Bulldozer.png",
      features: ["Advanced Hydraulics", "AC Cabin", "GPS Tracking"],
      availability: "Available"
    },
    {
      id: 3,
      name: "mini-excavator",
      supplier: "Lonavala Equipment Hub",
      location: "Lonavala", 
      price: "₹3,300",
      period: "per day",
      rating: 3.6,
      reviews: 98,
      image: "/images/sub-categories-OnRent/Earth moving/mini_excavator.png",
      features: ["Advanced Hydraulics", "AC Cabin", "GPS Tracking"],
      availability: "Available"
    },
    {
      id: 4,
      name: "Motor Grader",
      supplier: "Talegoan Equipment Hub",
      location: "Talegoan", 
      price: "₹1,700",
      period: "per day",
      rating: 4.3,
      reviews: 322,
      image: "/images/sub-categories-OnRent/Earth moving/motor_grader.png",
      features: ["Advanced Hydraulics", "AC Cabin", "GPS Tracking"],
      availability: "Available"
    },
    {
      id: 5,
      name: "Excavator",
      supplier: "Vadgoan Heavy Machinery",
      location: "Vadgaon",
      price: "₹2,200",
      period: "per day", 
      rating: 4.7,
      reviews: 28,
      image: "/images/sub-categories-OnRent/Earth moving/excavator.png",
      features: ["Compact Design", "Easy Operation", "Low Fuel Consumption"],
      availability: "Available"
    },
    {
      id: 6,
      name: "Skid Steer Loader",
      supplier: "Nangargaon big Machinery",
      location: "Nangargaon",
      price: "₹5,000",
      period: "per day", 
      rating: 4.7,
      reviews: 28,
      image: "/images/sub-categories-OnRent/Earth moving/skid_steer_loader.png",
      features: ["Compact Design", "Easy Operation", "Low Fuel Consumption"],
      availability: "Available"
    },
    {
      id: 7,
      name: "Wheel Loader",
      supplier: "Kamshet malooc",
      location: "Kamshet",
      price: "₹4,070",
      period: "per day", 
      rating: 4.9,
      reviews: 2,
      image: "/images/sub-categories-OnRent/Earth moving/wheel_loader.png",
      features: ["Compact Design", "Easy Operation", "Low Fuel Consumption"],
      availability: "Available"
    },
  ];

  const concreteEquipment = [
    {
      id: 8,
      name: "Concrete Mixer",
      supplier: "Pune Mixers",
      location: "Pune",
      price: "₹3,500",
      period: "per day",
      rating: 4.5,
      reviews: 63,
      image: "/images/sub-categories-OnRent/Concrete Equipment/concrete_mixer.png",
      features: ["9 Cubic Meter Capacity", "Auto Loading", "Water Tank"],
      availability: "Available"
    },
    {
      id: 9,
      name: "Concrete Batching Plant",
      supplier: "Nashik Construction",
      location: "Nashik",
      price: "₹15,000",
      period: "per day",
      rating: 4.6,
      reviews: 28,
      image: "/images/sub-categories-OnRent/Concrete Equipment/concrete_batching_plant.png",
      features: ["60m³/h Capacity", "Computer Controlled", "Dust Control"],
      availability: "Available"
    },
    {
      id: 10,
      name: "Power Trowel",
      supplier: "Smooth Finish Co",
      location: "Mumbai",
      price: "₹1,200",
      period: "per day",
      rating: 4.3,
      reviews: 37,
      image: "/images/sub-categories-OnRent/Concrete Equipment/power_trowel.png",
      features: ["Dual Blade System", "Ergonomic Handle", "Adjustable Speed"],
      availability: "Available"
    }
  ];

  const liftingEquipment = [
    {
      id: 11,
      name: "Truck Mounted Crane",
      supplier: "Heavy Lifters",
      location: "Mumbai",
      price: "₹18,000",
      period: "per day",
      rating: 4.6,
      reviews: 67,
      image: "/images/sub-categories-OnRent/lifting equipment/truck-mounted_crane.png",
      features: ["25 Ton Capacity", "4-Section Boom", "LMI System"],
      availability: "Available"
    },
    {
      id: 12,
      name: "Tower Crane",
      supplier: "SkyLift Solutions",
      location: "Pune",
      price: "₹25,000",
      period: "per day",
      rating: 4.8,
      reviews: 52,
      image: "/images/sub-categories-OnRent/lifting equipment/tall_tower_crane.png",
      features: ["50m Height", "8 Ton Capacity", "Auto-Lube System"],
      availability: "Available"
    },
    {
      id: 13,
      name: "Rope Hoist",
      supplier: "Aerial Access",
      location: "Pune",
      price: "₹3,500",
      period: "per day",
      rating: 4.4,
      reviews: 38,
      image: "/images/sub-categories-OnRent/lifting equipment/rope_hoist_lifting.png",
      features: ["5 Ton Capacity", "Smooth Operation", "Heavy Duty"],
      availability: "Available"
    },
    {
      id: 14,
      name: "Mobile Crane",
      supplier: "Heavy Lifters",
      location: "Mumbai",
      price: "₹18,000",
      period: "per day",
      rating: 4.6,
      reviews: 67,
      image: "/images/sub-categories-OnRent/lifting equipment/mobile_crane.png",
      features: ["25 Ton Capacity", "4-Section Boom", "LMI System"],
      availability: "Available"
    },
    {
      id: 15,
      name: "Forklift",
      supplier: "Lift & Move",
      location: "Pune",
      price: "₹2,500",
      period: "per day",
      rating: 4.3,
      reviews: 56,
      image: "/images/sub-categories-OnRent/lifting equipment/forklift.png",
      features: ["3 Ton Capacity", "Diesel Engine", "Side Shifter"],
      availability: "Available"
    },
    {
      id: 16,
      name: "Crawler Crane",
      supplier: "Heavy Lifters",
      location: "Mumbai",
      price: "₹22,000",
      period: "per day",
      rating: 4.7,
      reviews: 42,
      image: "/images/sub-categories-OnRent/lifting equipment/crawler_crane.png",
      features: ["40 Ton Capacity", "Crawler Undercarriage", "Heavy Lifting"],
      availability: "Available"
    }
  ];

  const roadConstructionEquipment = [
    {
      id: 17,
      name: "Road Roller",
      supplier: "Road Masters",
      location: "Pune",
      price: "₹4,500",
      period: "per day",
      rating: 4.5,
      reviews: 48,
      image: "/images/sub-categories-OnRent/road constructions/road-roller-.jpg",
      features: ["10 Ton Weight", "Vibration System", "Water Tank"],
      availability: "Available"
    },
    {
      id: 18,
      name: "Asphalt Paver",
      supplier: "Pave Right",
      location: "Mumbai",
      price: "₹12,000",
      period: "per day",
      rating: 4.7,
      reviews: 36,
      image: "/images/sub-categories-OnRent/road constructions/Asphalt-paver-machine.jpg",
      features: ["6m Paving Width", "Auto Leveling", "Heated Screed"],
      availability: "Available"
    },
    {
      id: 19,
      name: "Cold Milling Machine",
      supplier: "Road Tech",
      location: "Pune",
      price: "₹15,000",
      period: "per day",
      rating: 4.6,
      reviews: 29,
      image: "/images/sub-categories-OnRent/road constructions/cold_milling_machine.jpg",
      features: ["2m Milling Width", "Level Pro System", "Dust Suppression"],
      availability: "Available"
    },
    {
      id: 20,
      name: "Bitumen Sprayer",
      supplier: "Road Builders",
      location: "Nashik",
      price: "₹8,500",
      period: "per day",
      rating: 4.4,
      reviews: 31,
      image: "/images/sub-categories-OnRent/road constructions/bitumen_sprayer.jpg",
      features: ["Precision Spraying", "Heated Tank", "Variable Speed"],
      availability: "Available"
    }
  ];

  const transportVehicles = [
    {
      id: 21,
      name: "Dump Truck",
      supplier: "Heavy Haulers",
      location: "Pune",
      price: "₹6,500",
      period: "per day",
      rating: 4.5,
      reviews: 58,
      image: "/images/sub-categories-OnRent/Transport vehicles/dump_truck.png",
      features: ["10 Ton Capacity", "Tarp System", "GPS Tracking"],
      availability: "Available"
    },
    {
      id: 22,
      name: "Trailer Truck",
      supplier: "Cargo Movers",
      location: "Mumbai",
      price: "₹5,500",
      period: "per day",
      rating: 4.4,
      reviews: 47,
      image: "/images/sub-categories-OnRent/Transport vehicles/trailer_truck.png",
      features: ["8 Ton Capacity", "Hydraulic Liftgate", "Tie-down Points"],
      availability: "Available"
    },
    {
      id: 23,
      name: "Tractor",
      supplier: "Agri Haul",
      location: "Nashik",
      price: "₹4,200",
      period: "per day",
      rating: 4.3,
      reviews: 39,
      image: "/images/sub-categories-OnRent/Transport vehicles/tractor.png",
      features: ["Heavy Duty", "4WD", "Versatile Attachment Options"],
      availability: "Available"
    },
    {
      id: 24,
      name: "Mini Truck",
      supplier: "City Movers",
      location: "Pune",
      price: "₹3,800",
      period: "per day",
      rating: 4.2,
      reviews: 42,
      image: "/images/sub-categories-OnRent/Transport vehicles/mini_truck.png",
      features: ["Compact Size", "Good Mileage", "Easy to Maneuver"],
      availability: "Available"
    },
    {
      id: 25,
      name: "Container Truck",
      supplier: "Heavy Haulers",
      location: "Mumbai",
      price: "₹7,800",
      period: "per day",
      rating: 4.6,
      reviews: 35,
      image: "/images/sub-categories-OnRent/Transport vehicles/container_truck.png",
      features: ["20ft/40ft Capacity", "Heavy Duty Chassis", "Secure Locking"],
      availability: "Available"
    },
    {
      id: 26,
      name: "Cement Bulker",
      supplier: "Bulk Transport",
      location: "Pune",
      price: "₹8,500",
      period: "per day",
      rating: 4.5,
      reviews: 31,
      image: "/images/sub-categories-OnRent/Transport vehicles/cement_bulker.png",
      features: ["30 Ton Capacity", "Pneumatic Discharge", "Dust Control"],
      availability: "Available"
    }
  ];
  const getEquipmentByCategory = (categoryId: string) => {
    switch(categoryId) {
      case 'earthmoving':
        return sampleEquipment;
      case 'concrete':
        return concreteEquipment;
      case 'lifting':
        return liftingEquipment;
      case 'road-construction':
        return roadConstructionEquipment;
      case 'transport':
        return transportVehicles;
      default:
        return [];
    }
  };

  const currentCategory = categoryData[categoryId || ""];
  const categoryEquipment = getEquipmentByCategory(categoryId || "");
  
  const filteredEquipment = categoryEquipment.filter(item => {
    const matchesLocation = selectedLocation === "all" || item.location === selectedLocation;
    return matchesLocation;
  });

  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  // Get subcategories with images based on the current category
  const getSubcategories = () => {
    if (!categoryId) return {};
    
    const subcategoriesMap: Record<string, Record<string, string>> = {
      'earthmoving': {
        'JCB (Backhoe Loader)': '/images/sub-categories-OnRent/Earth moving/jcb.png',
        'Bulldozer': '/images/sub-categories-OnRent/Earth moving/Bulldozer.png',
        'Excavator': '/images/sub-categories-OnRent/Earth moving/excavator.png',
        'Skid Steer Loader': '/images/sub-categories-OnRent/Earth moving/skid_steer_loader.png',
        'Wheel Loader': '/images/sub-categories-OnRent/Earth moving/wheel_loader.png',
        'Motor Grader': '/images/sub-categories-OnRent/Earth moving/motor_grader.png',
        'Mini Excavator': '/images/sub-categories-OnRent/Earth moving/mini_excavator.png'
      },
      'transport': {
        'Dump Truck / Tipper': '/images/sub-categories-OnRent/Transport vehicles/dump_truck.png',
        'Trailer Truck': '/images/sub-categories-OnRent/Transport vehicles/trailer_truck.png',
        'Container Truck': '/images/sub-categories-OnRent/Transport vehicles/container_truck.png',
        'Cement Bulker': '/images/sub-categories-OnRent/Transport vehicles/cement_bulker.png',
        'Water Tanker': '/images/sub-categories-OnRent/Transport vehicles/water_tanker.png',
        'Diesel Tanker': '/images/sub-categories-OnRent/Transport vehicles/diesel_tanker.png',
        'Tractor Trolley': '/images/sub-categories-OnRent/Transport vehicles/tractor.png',
        'Pickup Truck': '/images/sub-categories-OnRent/Transport vehicles/pickup_truck.png',
        'Tempo': '/images/sub-categories-OnRent/Transport vehicles/tempo.png',
        'Mini Trucks': '/images/sub-categories-OnRent/Transport vehicles/mini_truck.png'
      },
      'concrete': {
        'Concrete Mixers': '/images/sub-categories-OnRent/Concrete Equipment/concrete_mixer.png',
        'Concrete Pump': '/images/sub-categories-OnRent/Concrete Equipment/concrete_pump.png',
        'Batching Plant': '/images/sub-categories-OnRent/Concrete Equipment/concrete_batching_plant.png',
        'Transit Mixer': '/images/sub-categories-OnRent/Concrete Equipment/transit_mixer.png',
        'Vibrator': '/images/sub-categories-OnRent/Concrete Equipment/concrete_vibrator.png',
        'Power Trowel': '/images/sub-categories-OnRent/Concrete Equipment/power_trowel.png',
        'Screed Vibrators': '/images/sub-categories-OnRent/Concrete Equipment/screed_vibrator.png'
      },
      'lifting': {
        'Mobile Cranes': '/images/sub-categories-OnRent/lifting equipment/mobile_crane.png',
        'Tower Cranes': '/images/sub-categories-OnRent/lifting equipment/tall_tower_crane.png',
        'Crawler Cranes': '/images/sub-categories-OnRent/lifting equipment/crawler_crane.png',
        'Truck-Mounted Crane': '/images/sub-categories-OnRent/lifting equipment/truck-mounted_crane.png',
        'Gantry Crane': '/images/sub-categories-OnRent/lifting equipment/gantry_crane.png',
        'Forklifts': '/images/sub-categories-OnRent/lifting equipment/forklift.png',
        'Hoists & Winches': '/images/sub-categories-OnRent/lifting equipment/rope_hoist_lifting.png'
      },
      'road-construction': {
        'Asphalt Paver': '/images/sub-categories-OnRent/road constructions/Asphalt-paver-machine.jpg',
        'Road Roller': '/images/sub-categories-OnRent/road constructions/road-roller-.jpg',
        'Bitumen Sprayer': '/images/sub-categories-OnRent/road constructions/bitumen_sprayer.jpg',
        'Cold Milling Machine': '/images/sub-categories-OnRent/road constructions/cold_milling_machine.jpg',
        'Chip Spreader': '/images/sub-categories-OnRent/road constructions/chip_spreader.jpg'
      }
    };

    return subcategoriesMap[categoryId] || {};
  };

  const subcategories = getSubcategories();
  const subcategoryEntries = Object.entries(subcategories);

  // Handle subcategory selection
  const handleSubcategorySelect = (subcat: string) => {
    setSelectedSubCategory(prev => prev === subcat ? 'all' : subcat);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header with Back Button and Location Filter */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <Link to="/onrent" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700">
              <ArrowLeft className="w-4 h-4" />
              Back to OnRent
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">Filter by:</span>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Location" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sticky Subcategory Filter with Images */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-2">
            <div className="relative">
              <div 
                className="flex space-x-3 overflow-x-auto pb-3 -mx-2 px-2"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  cursor: 'grab',
                  paddingBottom: '4px'
                }}
                onMouseDown={(e) => {
                  // Enable horizontal scrolling with mouse drag
                  const container = e.currentTarget;
                  const startX = e.pageX - container.offsetLeft;
                  const scrollLeft = container.scrollLeft;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    e.preventDefault();
                    const x = e.pageX - container.offsetLeft;
                    const walk = (x - startX) * 2;
                    container.scrollLeft = scrollLeft - walk;
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    container.style.cursor = 'grab';
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp, { once: true });
                  container.style.cursor = 'grabbing';
                }}
              >
                {/* All Types Button */}
                <div className="flex-shrink-0 w-28 h-28">
                  <button
                    onClick={() => handleSubcategorySelect('all')}
                    className={`w-full h-full relative rounded-lg overflow-hidden transition-all ${
                      selectedSubCategory === 'all' 
                        ? 'ring-2 ring-orange-500 ring-offset-2' 
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    aria-label="Show all subcategories"
                  >
                    <div className="absolute inset-0">
                      <img 
                        src={
                          categoryId === 'earthmoving' ? '/images/Categories-OnRent/Earthmoving_Equipments.jpg' :
                          categoryId === 'transport' ? '/images/Categories-OnRent/Transport_vehicles .jpg' :
                          categoryId === 'concrete' ? '/images/Categories-OnRent/Concrete_Equipments.jpg' :
                          categoryId === 'lifting' ? '/images/Categories-OnRent/Lifting_equipments.jpg' :
                          '/images/Categories-OnRent/Road_construction.jpg'
                        }
                        alt="All"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center pb-2">
                        <span className="text-white font-semibold text-sm px-2 text-center">All</span>
                      </div>
                    </div>
                    {selectedSubCategory === 'all' && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-10">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Subcategory Buttons */}
                {subcategoryEntries.map(([name, image]) => {
                  const isSelected = selectedSubCategory === name;
                  return (
                    <div key={name} className="flex-shrink-0 w-28 h-28">
                      <button
                        onClick={() => handleSubcategorySelect(name)}
                        className={`w-full h-full relative rounded-lg overflow-hidden transition-all ${
                          isSelected 
                            ? 'ring-2 ring-orange-500 ring-offset-2' 
                            : 'hover:ring-1 hover:ring-gray-300'
                        }`}
                        aria-label={`Filter by ${name}`}
                      >
                        <div className="absolute inset-0">
                          <img 
                            src={image} 
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-equipment.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center pb-2">
                            <span className="text-white font-semibold text-xs px-2 text-center">
                              {name}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-10">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Category Title and Description */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-1">{currentCategory.name}</h1>
            <p className="text-muted-foreground">Choose from our wide range of {currentCategory.name.toLowerCase()}</p>
          </div>
          
          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Link 
              to={`/onrent/equipment/${item.id}`} 
              state={{ equipment: item }}
              key={item.id} 
              className="block"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative flex-grow">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        item.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {item.availability}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.supplier}
                    </p>
                    
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
                        onClick={(e) => e.preventDefault()}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        </div>
        <div className="pb-16"></div>
      </div>
    </div>
  );
};

export default CategoryPageOR;
