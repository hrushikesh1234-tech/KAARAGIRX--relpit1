
import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRentalEquipment } from "@/hooks/useRentalEquipment";

const CategoryPageOR = () => {
  const { categoryId } = useParams();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  
  const { data: rentalEquipment = [], isLoading, error } = useRentalEquipment({ 
    category: categoryId,
    subcategory: selectedSubCategory !== 'all' ? selectedSubCategory : undefined
  });

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

  const locations = useMemo(() => {
    const uniqueLocations = new Set(
      rentalEquipment
        .map(item => item.location)
        .filter((loc): loc is string => Boolean(loc))
    );
    return Array.from(uniqueLocations);
  }, [rentalEquipment]);

  const filteredEquipment = useMemo(() => {
    let equipment = rentalEquipment;
    
    if (selectedLocation && selectedLocation !== "all") {
      equipment = equipment.filter(item => item.location === selectedLocation);
    }
    
    return equipment;
  }, [rentalEquipment, selectedLocation]);


  const currentCategory = categoryData[categoryId || ""];

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
                    onClick={() => setSelectedSubCategory('all')}
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
                      {(item.features || []).slice(0, 2).map((feature, index) => (
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
