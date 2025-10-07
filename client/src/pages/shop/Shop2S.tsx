import { useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useLikedItems } from "@/contexts/LikedItemsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Truck, CheckCircle, ShoppingCart, Heart, ShieldCheck, Home, ShoppingBag } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useDealers } from "@/hooks/useDealers";

// Temporary type for dealer until we update the dealers data
type Dealer = {
  id: string | number;
  name: string;
  price: number;
  rating: number;
  deliveryTime?: string;
  location: string;
  verified: boolean;
  image: string;
  reviewCount?: number;
  category: string;
  subcategory: string;
  features: string[];
  unit?: string;
};



interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  dealers: Dealer[];
}

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { likedItems, addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { data: dealers = [], isLoading, error } = useDealers();

  // Toggle like status for a dealer
  const toggleLike = (dealer: Dealer, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the like icon
    const id = typeof dealer.id === 'number' ? dealer.id.toString() : dealer.id;
    
    if (isLiked(id)) {
      removeLikedItem(id);
    } else {
      addLikedItem({
        id,
        name: dealer.name,
        price: dealer.price || 0,
        unit: dealer.unit || 'unit',
        image: dealer.image,
        dealerName: dealer.name,
        dealerId: id
      });
    }
  };

  const locations = useMemo(() => {
    return ['All Locations', ...new Set(dealers.map(dealer => dealer.location).filter(Boolean as any))];
  }, [dealers]);

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

  const products: Product[] = useMemo(() => {
    const productMap = new Map<string, Product>();
    
    dealers.forEach(dealer => {
      const key = `${dealer.category}-${dealer.subcategory}`;
      if (!productMap.has(key)) {
        productMap.set(key, {
          id: key,
          name: `${dealer.subcategory} ${dealer.category}`,
          category: dealer.category,
          subcategory: dealer.subcategory,
          image: dealer.image,
          dealers: []
        });
      }
      
      const product = productMap.get(key)!;
      const dealerData = {
        ...dealer,
        id: dealer.id.toString(),
        price: dealer.price || 0,
        rating: dealer.rating || 0,
        verified: dealer.verified || false,
        reviewCount: dealer.reviewCount || 0,
        // Remove any undefined properties to avoid type errors
        ...(dealer.deliveryTime && { deliveryTime: dealer.deliveryTime })
      };
      // Remove the delivery property if it exists
      const { delivery, ...cleanDealer } = dealerData as any;
      product.dealers.push(cleanDealer);
    });
    
    // Filter by selected location if any
    let result = Array.from(productMap.values());
    
    if (locationFilter) {
      result = result.map(product => ({
        ...product,
        dealers: product.dealers.filter(dealer => 
          dealer.location.toLowerCase().includes(locationFilter.toLowerCase())
        )
      })).filter(product => product.dealers.length > 0);
    }
    
    // Filter by selected category if any
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by selected subcategory if any
    if (selectedSubCategory) {
      result = result.filter(product => 
        product.subcategory.toLowerCase() === selectedSubCategory.toLowerCase()
      );
    }
    
    return result;
  }, [selectedCategory, selectedSubCategory, locationFilter]);



  const handleBuyRequest = (product: Product, dealer: Dealer) => {
    const dealerId = typeof dealer.id === 'number' ? dealer.id.toString() : dealer.id;
    navigate(`/dealer/${dealerId}`);
  };
  


  // Location filter is handled by the Select component
  const handleLocationChange = (value: string) => {
    setLocationFilter(value === "All Locations" ? "" : value);
  };



  const handleCategoryClick = (categoryId: string) => {
    const location = searchParams.get('location') || '';
    navigate(`/dealers?category=${categoryId}${location ? `&location=${location}` : ''}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
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

      {/* Hero Section with Background Image */}
      <div 
        className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero/shop-hero-section.png')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">
            Find Construction Materials
          </h1>
          
          {/* Location Selector */}
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
            
            {/* Trust Badges - Hidden on mobile */}
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

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedCategory === "all" 
                  ? "All Materials" 
                  : (categoryData[selectedCategory as keyof typeof categoryData]?.name || 'Selected Category')}
                {selectedSubCategory && ` - ${selectedSubCategory}`}
                <span className="text-muted-foreground ml-2">({products.length} items)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => navigate(`/dealers?category=${product.category}&subcategory=${product.subcategory}`)}
                  >
                    <div className="relative h-48 overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button 
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle like for all dealers in this product
                          product.dealers.forEach(dealer => {
                            toggleLike(dealer, e);
                          });
                        }}
                      >
                        <Heart 
                          className={`h-5 w-5 ${product.dealers.some(d => isLiked(d.id.toString())) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                        />
                      </button>
                    </div>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.dealers.length} Dealers Available
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {product.dealers.slice(0, 2).map((dealer) => (
                          <div 
                            key={dealer.id} 
                            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              const dealerId = typeof dealer.id === 'number' ? dealer.id.toString() : dealer.id;
                              navigate(`/dealer/${dealerId}`);
                            }}
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{dealer.name}</span>
                                {dealer.verified && (
                                  <CheckCircle className="h-4 w-4 ml-1 text-green-500" />
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {dealer.location}
                              </div>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(dealer.rating || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({dealer.reviewCount || 0})
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-2">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  className="p-1 hover:bg-gray-100 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(dealer, e);
                                  }}
                                >
                                  <Heart 
                                    className={`h-4 w-4 ${isLiked(dealer.id.toString()) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                                  />
                                </button>
                                <div>
                                  <div className="font-bold">₹{dealer.price}</div>
                                  <div className="text-xs text-gray-500">per unit</div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="mt-2"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyRequest(product, dealer);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {product.dealers.length > 2 && (
                        <div className="text-center text-sm text-blue-600">
                          +{product.dealers.length - 2} more dealers available
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Link to={`/dealers?category=${product.category}&subcategory=${product.subcategory}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View All Dealers
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No products found matching your criteria.</p>
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

        {/* Trust Badges for Mobile - at bottom */}
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
