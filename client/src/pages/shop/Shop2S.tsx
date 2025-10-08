import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLikedItems } from "@/contexts/LikedItemsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Truck, CheckCircle, ShoppingCart, Heart, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useMaterials } from "@/hooks/useMaterials";

// Import Material type
import type { Material } from '@/hooks/useMaterials';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { likedItems, addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  const navigate = useNavigate();
  
  const { data: materials = [], isLoading, error } = useMaterials({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    subcategory: selectedSubCategory || undefined,
    inStock: true
  });

  // Toggle like status for a material
  const toggleLike = (material: Material, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = material.id.toString();
    
    if (isLiked(id)) {
      removeLikedItem(id);
    } else {
      addLikedItem({
        id,
        name: material.name,
        price: Number(material.price) || 0,
        unit: material.unit || 'unit',
        image: material.image || '',
        dealerName: material.dealerName || '',
        dealerId: material.dealerId.toString()
      });
    }
  };

  const locations = useMemo(() => {
    const uniqueLocations = new Set(
      materials
        .map(m => m.dealerLocation)
        .filter((loc): loc is string => Boolean(loc))
    );
    return ['All Locations', ...Array.from(uniqueLocations)];
  }, [materials]);

  const categoryData = {
    "all": { name: "All Materials", count: 45, subcategories: [], image: "/images/categories/cement.jpg" },
    "cement": { 
      name: "Cement", 
      count: 5, 
      subcategories: ["OPC 43", "OPC 53", "PPC", "White Cement", "RMC"],
      image: "/images/categories/cement.jpg"
    },
    "bricks": { 
      name: "Bricks", 
      count: 10, 
      subcategories: ["Red Clay", "Fly Ash"],
      image: "/images/categories/bricks.jpg"
    },
    "blocks": { 
      name: "Blocks", 
      count: 10, 
      subcategories: ["Concrete", "AAC"],
      image: "/images/categories/blocks.jpg"
    },
    "sand": { 
      name: "Sand", 
      count: 5, 
      subcategories: ["River Sand", "Red Sand", "Coarse", "Fine", "Filtered"],
      image: "/images/categories/sand.jpg"
    },
    "steel": { 
      name: "Steel", 
      count: 3, 
      subcategories: ["TMT Bars", "Binding Wire", "Steel Rods"],
      image: "/images/categories/steel.jpg"
    },
    "stone-dust": { 
      name: "Stone Dust", 
      count: 5, 
      subcategories: ["Fine", "Coarse"],
      image: "/images/categories/stone dust.jpg"
    },
    "aggregate": { 
      name: "Aggregate", 
      count: 5, 
      subcategories: ["10mm", "20mm", "40mm", "Dust"],
      image: "/images/categories/AGGREGATE.jpg"
    },
    "rubblestone": { 
      name: "Rubblestone", 
      count: 5, 
      subcategories: ["1-3 Inch", "3-5 Inch", "5-8 Inch"],
      image: "/images/categories/Rubblestone.jfif"
    }
  };

  const categories = Object.entries(categoryData)
    .filter(([id]) => id !== 'all')
    .map(([id, data]) => ({
      id,
      ...data
    }));

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let result = [...materials];
    
    // Filter by location
    if (locationFilter && locationFilter !== 'All Locations') {
      result = result.filter(material => 
        material.dealerLocation?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(material => 
        material.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by subcategory
    if (selectedSubCategory && selectedSubCategory !== 'all') {
      result = result.filter(material => 
        material.subcategory?.toLowerCase() === selectedSubCategory.toLowerCase()
      );
    }
    
    // Sort materials
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'dealer-name':
        result.sort((a, b) => (a.dealerName || '').localeCompare(b.dealerName || ''));
        break;
      case 'rating':
        result.sort((a, b) => Number(b.dealerRating || 0) - Number(a.dealerRating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }
    
    return result;
  }, [materials, selectedCategory, selectedSubCategory, locationFilter, sortBy]);

  const handleLocationChange = (value: string) => {
    setLocationFilter(value === "All Locations" ? "" : value);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('all');
  };

  const handleMaterialClick = (material: Material) => {
    navigate(`/dealer/${material.dealerId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto w-full">
        {/* Floating Cart and Heart Icons */}
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
          <Button 
            size="icon" 
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full shadow-lg bg-white hover:bg-gray-50 relative"
            onClick={() => navigate('/liked-items')}
          >
            <Heart className="h-5 w-5" />
            {likedItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                {likedItems.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Hero Section */}
        <div 
          className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/shop-hero-section.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 w-full max-w-4xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">
              Find Construction Materials
            </h1>
            
            <div className="max-w-xs mx-auto space-y-2">
              <p className="text-white text-lg font-medium mb-2">Select your location</p>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 h-5 w-5" />
                <Select value={locationFilter || 'All Locations'} onValueChange={handleLocationChange}>
                  <SelectTrigger className="pl-10 bg-white/10 border-white/30 text-white backdrop-blur-sm h-12 w-full">
                    <SelectValue placeholder="Choose location..." className="text-white placeholder-gray-300" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="lg:w-80 space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Categories</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <button
                          onClick={() => handleCategoryClick(category.id)}
                          className={cn(
                            "w-full rounded-lg border-2 overflow-hidden hover:shadow-md transition-all",
                            selectedCategory === category.id ? "border-blue-600" : "border-gray-200"
                          )}
                        >
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400 text-2xl">📦</div>
                            )}
                          </div>
                          <div className="p-2 bg-white">
                            <div className="flex items-center justify-center">
                              <span className="text-xs font-medium">{category.name}</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hidden lg:block">
                <CardHeader>
                  <h3 className="font-semibold">Why Choose Us?</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Verified Dealers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Quality Assured</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Materials Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory === "all" 
                      ? "All Materials" 
                      : (categoryData[selectedCategory as keyof typeof categoryData]?.name || 'Selected Category')}
                    <span className="text-muted-foreground ml-2">({filteredMaterials.length} items)</span>
                  </h2>
                  
                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="dealer-name">Dealer Name</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Subcategory Tabs */}
                {selectedCategory !== "all" && categoryData[selectedCategory as keyof typeof categoryData]?.subcategories.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={!selectedSubCategory || selectedSubCategory === 'all' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubCategory('all')}
                      className="whitespace-nowrap"
                    >
                      All
                    </Button>
                    {categoryData[selectedCategory as keyof typeof categoryData]?.subcategories.map((subcat) => (
                      <Button
                        key={subcat}
                        variant={selectedSubCategory === subcat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSubCategory(subcat)}
                        className="whitespace-nowrap"
                      >
                        {subcat}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <Card 
                      key={material.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => handleMaterialClick(material)}
                    >
                      <div className="relative h-48 overflow-hidden group">
                        <img
                          src={material.image || '/images/categories/default.jpg'}
                          alt={material.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button 
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          onClick={(e) => toggleLike(material, e)}
                        >
                          <Heart 
                            className={`h-5 w-5 ${isLiked(material.id.toString()) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                        {material.subcategory && (
                          <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">
                            {material.subcategory}
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold">{material.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{Number(material.price).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            per {material.unit}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        {material.minOrder && (
                          <div className="text-sm text-gray-600">
                            Min Order: {material.minOrder}
                          </div>
                        )}
                        
                        {/* Dealer Information */}
                        <div className="pt-3 border-t">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-sm">{material.dealerName || 'Unknown Dealer'}</span>
                                {material.dealerVerified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {material.dealerLocation || 'Location not specified'}
                              </div>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(Number(material.dealerRating) || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({material.dealerReviewCount || 0})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/cart');
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMaterialClick(material);
                          }}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No materials found matching your criteria.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedSubCategory('');
                        setLocationFilter('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust Badges for Mobile */}
          <Card className="lg:hidden mt-8">
            <CardHeader>
              <h3 className="font-semibold">Why Choose Us?</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm">Verified Dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Quality Assured</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shop;
