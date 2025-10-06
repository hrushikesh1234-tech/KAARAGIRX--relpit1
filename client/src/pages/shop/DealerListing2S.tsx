'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  useSearchParams,
  useNavigate, 
  useParams, 
  useLocation
} from 'react-router-dom';
import { Link } from '@/components/ui/Link';
import { Badge } from '@/components/ui/badge';

// Import icons using require
import { Home, ShoppingBag, Truck, ShoppingCart, ArrowLeft, Star, Heart, MapPin, CheckCircle, CheckCircle2, HardHat, Droplet, Droplets, Factory, Ruler, Package, Package2, Boxes, Blocks } from 'lucide-react';

// Create aliases for icons
const BoxIcon = Package;
const BrickWall = Blocks;
import { useCart } from '@/contexts/CartContext';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { dealers } from "@/data/dealers";
import type { Dealer } from '@/types/dealer.types';
import { getFallbackImage } from "@/utils/imageUtils";
import './styles/scrollbar-hide.css';

// Type for URL parameters
type RouteParams = {
  category?: string;
  subcategory?: string;
};

// Type for subcategory
type Subcategory = {
  name: string;
  slug: string;
  image: string;
};

// Initialize dealer list with proper typing
const dealerList: Dealer[] = [...dealers];

const DealerListing2S: React.FC = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Scroll to top when component mounts or location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // Get URL parameters
  const { category: categoryParam = '', subcategory: subcategoryParam = '' } = useParams<RouteParams>();
  
  // Context hooks
  const { addToCart, removeFromCart, isItemInCart } = useCart();
  const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  
  // State
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  
  // Get current search params as an object
  const searchParamsObj = useMemo(() => ({
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    toString: () => searchParams.toString()
  }), [searchParams]);
  
  // Derived state from URL
  const category = (categoryParam?.toLowerCase() || searchParamsObj.get('category') || '').toLowerCase();
  const subcategory = (subcategoryParam?.toLowerCase() || searchParamsObj.get('subcategory') || '').toLowerCase();
  
  // Initialize state from URL params
  useEffect(() => {
    const sortParam = searchParamsObj.get('sort');
    const locationParam = searchParamsObj.get('location');
    
    if (sortParam) setSortBy(sortParam);
    if (locationParam) setLocationFilter(locationParam);
  }, [searchParamsObj]);
  
  // Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    navigate({ search: params.toString() }, { replace: true });
  };
  
  // Handle location filter change
  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
    updateFilters({ location: location === 'All Locations' ? '' : location });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sort: value });
  };

  // Get the first image for a dealer with fallbacks
  const getDealerImage = (dealer: Dealer): string => {
    // Map of dealer IDs to their specific image paths
    const dealerImageMap: Record<number, string> = {
      1: '/images/materials images/cement/001/a1.png',
      2: '/images/materials images/cement/002/b1.png',
      245: '/images/materials images/cement/245/c1.png',
      250: '/images/materials images/cement/250/e1.png',
      253: '/images/materials images/cement/253/d1.png',
      5: '/images/materials images/bricks/005/f1.png',
      238: '/images/materials images/bricks/238/g1.png',
      3: '/images/materials images/blocks/003/h1.png',
      239: '/images/materials images/blocks/239/i1.png',
      4: '/images/materials images/sand/004/j1.png',
      240: '/images/materials images/sand/240/k1.png',
      246: '/images/materials images/sand/246/l1.png',
      251: '/images/materials images/sand/251/m1.png',
      254: '/images/materials images/sand/254/n1.png',
      6: '/images/materials images/steel/006/03.png',
      241: '/images/materials images/steel/241/p1.png',
      247: '/images/materials images/steel/247/q1.png',
      7: '/images/materials images/stone dust/007/r1.png',
      242: '/images/materials images/stone dust/242/s1.png',
      8: '/images/materials images/aggregate/008/t1.png',
      243: '/images/materials images/aggregate/243/u1.png',
      248: '/images/materials images/aggregate/248/v1.png',
      252: '/images/materials images/aggregate/252/w1.png',
      9: '/images/materials images/rubblestone/009/x1.png',
      244: '/images/materials images/rubblestone/244/y1.png',
      249: '/images/materials images/rubblestone/249/z1.png'
    };

    // Return the specific image if it exists
    if (dealer.id in dealerImageMap) {
      return dealerImageMap[dealer.id as keyof typeof dealerImageMap];
    }
    
    // Fall back to the dealer's image if available
    if (dealer?.image) {
      return dealer.image;
    }
    
    // Fall back to a category-based image
    return getFallbackImage(dealer?.category || 'other');
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, dealer: Dealer) => {
    const target = e.target as HTMLImageElement;
    // Set fallback image based on dealer category
    target.src = getFallbackImage(dealer.category || 'other');
  };

  // Log the dealers data for debugging
  useEffect(() => {
    console.log('Dealers data:', dealers);
  }, []);

  // Log URL parameters for debugging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('DealerListing URL Params:', { 
        category, 
        subcategory, 
        location: locationFilter 
      });
    }
  }, [category, subcategory, locationFilter]);

  /**
   * Extract unique locations from dealerList for the dropdown
   * @returns Array of unique location strings
   */
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    dealerList.forEach(dealer => {
      if (dealer.location) {
        locations.add(dealer.location.split(',')[0].trim()); // Get just the city name
      }
    });
    return Array.from(locations).sort();
  }, [dealerList]);

  // Format category name for display with proper case handling
  const formatCategory = (category: string): string => {
    if (!category) return '';
    return category
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace('Mm', 'mm') // Fix case for 'mm' in sizes
      .replace('Ppc', 'PPC') // Fix case for PPC
      .replace('Op', 'OP') // Fix case for OPC
      .replace('Tmt', 'TMT'); // Fix case for TMT
  };

  // Apply filters to dealerList with proper typing
  const filteredDealers = dealerList.filter((dealer: Dealer) => {
    const dealerCategory = (dealer.category || '').toLowerCase();
    const dealerSubcategory = (dealer.subcategory || '').toLowerCase();
    const dealerLocation = (dealer.location || '').toLowerCase();
    
    // Normalize filter values
    const normalizedCategory = category.trim();
    const normalizedSubcategory = subcategory.trim();
    const normalizedLocation = locationFilter.trim();
    
    // Check if category matches (if category filter is applied)
    const matchesCategory = !normalizedCategory || 
      dealerCategory === normalizedCategory ||
      dealerCategory.replace(/\s+/g, '-') === normalizedCategory;
    
    // Check if subcategory matches (if subcategory filter is applied)
    let matchesSubcategory = true;
    if (normalizedSubcategory) {
      // Normalize both the dealer's subcategory and the filter subcategory
      const normalize = (str: string): string => str.toLowerCase().trim().replace(/[\s-]+/g, '-');
      const dealerSubNormalized = normalize(dealerSubcategory);
      const filterSubNormalized = normalize(normalizedSubcategory);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Comparing subcategories:', { 
          dealerSubcategory, 
          normalizedSubcategory,
          dealerSubNormalized, 
          filterSubNormalized 
        });
      }
      
      // Special handling for stone-dust and rubblestone variations
      const isStoneDust = ['stonedust', 'stone-dust', 'stone dust', 'fine-stone-dust', 'coarse-stone-dust']
        .map((s: string) => normalize(s))
        .includes(filterSubNormalized);
        
      const isRubble = ['rubblestone', 'rubble-stone', 'rubble stone', 'rubble', '10mm-rubble', '20mm-rubble', '40mm-rubble']
        .map((s: string) => normalize(s))
        .includes(filterSubNormalized);
      
      // Check for matches with all variations
      if (isStoneDust) {
        const stoneDustVariations = ['stonedust', 'stone-dust', 'stone dust', 'fine-stone-dust', 'coarse-stone-dust']
          .map((s: string) => normalize(s));
        matchesSubcategory = stoneDustVariations.some((variation: string) => 
          dealerSubNormalized.includes(variation) || 
          variation.includes(dealerSubNormalized)
        );
      } else if (isRubble) {
        const rubbleVariations = ['rubblestone', 'rubble-stone', 'rubble stone', 'rubble', '10mm-rubble', '20mm-rubble', '40mm-rubble']
          .map((s: string) => normalize(s));
        matchesSubcategory = rubbleVariations.some((variation: string) => 
          dealerSubNormalized.includes(variation) || 
          variation.includes(dealerSubNormalized)
        );
      } else {
        // For other subcategories, do a direct comparison with type safety
        matchesSubcategory = 
          typeof dealerSubNormalized === 'string' && 
          typeof filterSubNormalized === 'string' &&
          (dealerSubNormalized === filterSubNormalized ||
           dealerSubNormalized.includes(filterSubNormalized) ||
           filterSubNormalized.includes(dealerSubNormalized)
          );
      }
    }
    
    // Check if location matches (if location filter is applied)
    const matchesLocation = !normalizedLocation || 
      (dealerLocation && typeof dealerLocation === 'string' && 
       normalizedLocation && typeof normalizedLocation === 'string' &&
       dealerLocation.toLowerCase().includes(normalizedLocation.toLowerCase()));
      
    return matchesCategory && matchesSubcategory && matchesLocation;
  });

  // Apply sorting to filtered dealers
  const sortedAndFilteredDealers = [...filteredDealers].sort((a, b) => {
    switch (sortBy) {
      case 'highest-rated':
        return (b.rating || 0) - (a.rating || 0);
      case 'lowest-rated':
        return (a.rating || 0) - (b.rating || 0);
      case 'price-high-to-low':
        return (b.price || 0) - (a.price || 0);
      case 'price-low-to-high':
        return (a.price || 0) - (b.price || 0);
      default:
        return 0; // No sorting
    }
  });
  
  // Handle subcategory selection
  const handleSubcategorySelect = (subcatName: string) => {
    const normalizedCurrentSub = subcategory?.toLowerCase().trim() || '';
    const normalizedNewSub = subcatName.toLowerCase().trim();
    
    if (normalizedCurrentSub === normalizedNewSub) {
      // If already selected, remove the subcategory filter
      updateFilters({ subcategory: '' });
    } else {
      // Otherwise, set the new subcategory filter
      updateFilters({ 
        subcategory: subcatName.replace(/\s+/g, '-') 
      });
    }
  };

  // Toggle like status for a dealer
  const toggleLike = (dealer: Dealer, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = typeof dealer.id === 'number' ? dealer.id.toString() : dealer.id;
    
    if (isLiked(id)) {
      removeLikedItem(id);
    } else {
      addLikedItem({
        id,
        name: dealer.name,
        price: dealer.price || 0,
        image: dealer.image,
        unit: dealer.unit || 'unit',
        dealerName: dealer.name,
        dealerId: id
      });
    }
  };

  // Handle add/remove from cart
  const handleAddToCart = async (dealer: Dealer, e: React.MouseEvent) => {
    e.stopPropagation();
    const dealerId = dealer.id.toString();
    const itemInCart = isItemInCart(dealerId);
    
    setAddingToCartId(dealerId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (itemInCart) {
        // Remove from cart
        removeFromCart(dealerId);
        toast.success('Item removed from cart');
      } else {
        // Add to cart
        addToCart({
          id: dealerId,
          name: dealer.name,
          price: dealer.price || 0,
          unit: dealer.unit || 'unit',
          image: dealer.image,
          dealerName: dealer.name,
          dealerId: dealerId
        });
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(`Failed to ${itemInCart ? 'remove from' : 'add to'} cart`);
    } finally {
      setAddingToCartId(null);
    }
  };

  // Generate a unique 3-digit code for each dealer based on their ID
  const generateDealerCode = (id: number | string): string => {
    // Convert ID to string and pad with leading zeros if needed
    const idStr = String(id);
    // Take last 3 digits or pad with leading zeros
    const code = idStr.padStart(3, '0').slice(-3);
    return code;
  };

  // Handle view details
  const handleViewDetails = (dealerId: number | string) => {
    navigate(`/dealer/${dealerId}`, {
      state: { 
        from: 'dealer-listing',
        filters: { 
          category, 
          subcategory, 
          location: locationFilter 
        }
      }
    });
  };

  // Get subcategories with proper image paths
  const getSubcategories = (): Subcategory[] => {
    console.log('Getting subcategories for category:', category);
    if (!category) return [];
    
    // Get all unique subcategories for the current category from dealerList
    const subcategoryMap = new Map<string, Subcategory>();
    
    dealerList.forEach(dealer => {
      // Check if the dealer belongs to the current category (case-insensitive)
      if (dealer.category && dealer.category.toLowerCase() === category.toLowerCase() && dealer.subcategory) {
        const subcatName = dealer.subcategory.trim();
        if (!subcategoryMap.has(subcatName)) {
          // Format the subcategory name for display
          const displayName = formatCategory(subcatName);
          // Create a URL-friendly slug
          const slug = subcatName.toLowerCase().replace(/\s+/g, '-');
          // Use the dealer's image or a fallback
          const image = dealer.image || getFallbackImage(category || 'other');
          
          subcategoryMap.set(subcatName, {
            name: displayName,
            slug,
            image
          });
        }
      }
    });
    
    console.log('Found subcategories:', Array.from(subcategoryMap.values()));
    
    // Return the subcategories as an array
    return Array.from(subcategoryMap.values());
  };

  const subcategories = getSubcategories();
  
  // Debug logs
  console.log('Current category:', category);
  console.log('Subcategories:', subcategories);
  console.log('Subcategory condition:', subcategories.length > 0);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <h1 className="text-lg font-medium text-gray-900">Dealers</h1>
        </div>
      </div>

      {/* Fixed Content Area */}
      <div className="fixed top-14 left-0 right-0 bg-white z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 bg-white">
          {/* Back Button and Category Title */}
          <div className="pt-1 pb-0">
            <div className="flex items-center">
              <Link 
                to="/shop" 
                className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Back to shop"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <h2 className="text-base font-medium text-gray-900">
                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
                {subcategory && ` > ${subcategory}`}
              </h2>
            </div>
          </div>

          {/* Filters */}
          <div className="py-2">
            <div className="flex flex-row gap-2">
              {/* Location Filter */}
              <div className="relative flex-1">
                <div className="relative w-full">
                  <select 
                    className="w-full pl-2 pr-6 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white h-8 appearance-none"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'none',
                      paddingRight: '1.5rem'
                    }}
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Sort By Filter */}
              <div className="relative flex-1">
                <div className="relative w-full">
                  <select 
                    className="w-full pl-2 pr-6 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white h-8 appearance-none"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'none',
                      paddingRight: '1.5rem'
                    }}
                  >
                    <option value="">Sort by</option>
                    <option value="price-high-to-low">Highest to lowest price</option>
                    <option value="price-low-to-high">Lowest to highest price</option>
                    <option value="highest-rated">Highest rated first</option>
                    <option value="lowest-rated">Lowest rated first</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 ? (
            <div className="border-b border-gray-100">
              <div className="relative pb-2">
                <div 
                  className="flex overflow-x-auto -mx-2"
                  style={{
                    msOverflowStyle: 'none',  // Hide scrollbar in IE and Edge
                    scrollbarWidth: 'none',    // Hide scrollbar in Firefox
                    WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
                    scrollBehavior: 'smooth',  // Smooth scrolling
                    cursor: 'grab',            // Change cursor to indicate draggable
                    paddingBottom: '4px'        // Add some space at the bottom
                  }}
                  onMouseDown={(e) => {
                    // Enable horizontal scrolling with mouse drag
                    const container = e.currentTarget;
                    const startX = e.pageX - container.offsetLeft;
                    const scrollLeft = container.scrollLeft;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      e.preventDefault();
                      const x = e.pageX - container.offsetLeft;
                      const walk = (x - startX) * 2; // Scroll speed
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
                  <div className="flex space-x-3 px-2">
                    {/* All Categories Button */}
                    <div className="flex-shrink-0 w-14 sm:w-20">
                      <button
                        onClick={() => handleSubcategorySelect('')}
                        className={`w-full flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all ${
                          !subcategory 
                            ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                        aria-label="Show all subcategories"
                      >
                        <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-100 mb-1 sm:mb-1.5">
                          <img 
                            src={
                              category.toLowerCase() === 'stone-dust' ? 
                              '/images/categories/stone dust.jpg' :
                              category.toLowerCase() === 'aggregate' ?
                              '/images/categories/AGGREGATE.jpg' :
                              category.toLowerCase() === 'rubblestone' ?
                              '/images/categories/Rubblestone.jfif' :
                              `/images/categories/${category.toLowerCase()}.jpg`
                            }
                            alt="All"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                          {!subcategory && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-medium text-center truncate w-full ${
                          !subcategory ? 'text-blue-700 font-semibold' : 'text-gray-700'
                        }`}>
                          All
                        </span>
                      </button>
                    </div>

                    {/* Subcategory Buttons */}
                    {subcategories.map((subcat) => {
                      const isSelected = subcategory?.toLowerCase() === subcat.slug.toLowerCase();
                      return (
                        <div key={subcat.slug} className="flex-shrink-0 w-14 sm:w-20">
                          <button
                            onClick={() => handleSubcategorySelect(subcat.slug)}
                            className={`w-full flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all ${
                              isSelected 
                                ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                            aria-label={`Filter by ${subcat.name}`}
                          >
                            <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-100 mb-1 sm:mb-1.5">
                              <img 
                                src={(() => {
                                  // Map subcategory slugs to image paths with proper encoding for spaces
                                  const imageMap: Record<string, string> = {
                                    // Cement
                                    'opc-43': '/images/subcategories/OPC 43.jpg',
                                    'opc-53': '/images/subcategories/OPC 53.jpg',
                                    'ppc': '/images/subcategories/PCC.png',
                                    'white-cement': '/images/subcategories/White Cement.jpg',
                                    'rmc': '/images/subcategories/RMC.jpg',
                                    
                                    // Bricks
                                    'red-clay': '/images/subcategories/RED CLAY BRICKS.jpg',
                                    'fly-ash': '/images/subcategories/FLY ASH BRICKS.jpg',
                                    
                                    // Blocks
                                    'aac': '/images/subcategories/AAC-blocks.jpg',
                                    'concrete': '/images/subcategories/concrete- blocks.jpg',
                                    
                                    // Sand
                                    'fine': '/images/subcategories/FINE SAND.jpg',
                                    'coarse': '/images/subcategories/coarse sand.jpg',
                                    'filtered': '/images/subcategories/FILTERD SAND.jpg',
                                    'river-sand': '/images/subcategories/REVER-SAND.jpg',
                                    'red-sand': '/images/subcategories/RED-SAND.jpg',
                                    
                                    // Steel
                                    'tmt-bars': '/images/subcategories/TMT BARS.jpg',
                                    'steel-rods': '/images/subcategories/STEEL RODS.jpg',
                                    'binding-wire': '/images/subcategories/BINDING WIRE.jpg',
                                    
                                    // Stone Dust
                                    'fine-stone-dust': '/images/subcategories/fine stone dust.jpg',
                                    'coarse-stone-dust': '/images/subcategories/coarse stone dust.jpg',
                                    
                                    // Aggregates
                                    '10mm': '/images/subcategories/10mm.jpg',
                                    '20mm': '/images/subcategories/20mm.jpg',
                                    '40mm': '/images/subcategories/40mm.jpg',
                                    'dust': '/images/subcategories/Dust Aggegate.jpg',
                                    
                                    // Rubblestone
                                    '10mm-rubble': '/images/subcategories/10 mm rubblestone.jpg',
                                    '20mm-rubble': '/images/subcategories/20 mm  rubblestone.jpg',
                                    '40mm-rubble': '/images/subcategories/40 mm rubblestone.jpg'
                                  };
                                  return imageMap[subcat.slug] || getFallbackImage(category);
                                })()}
                                alt={subcat.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = getFallbackImage(category);
                                }}
                              />
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                              </div>
                              )}
                            </div>
                            <span 
                              className={`text-[10px] sm:text-xs font-medium text-center truncate w-full ${
                                isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                              }`}
                            >
                              {subcat.name}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-gray-500 border-b border-gray-100">
              No subcategories found for this category.
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 mt-[155px] pb-20 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Dealers List */}
          <div className="space-y-3">
          {sortedAndFilteredDealers.map((dealer) => (
            <div 
              key={dealer.id}
              className="relative flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                const target = e.target as HTMLElement;
                // Only navigate if the click wasn't on an interactive element
                if (!(target instanceof HTMLButtonElement) && 
                    !(target instanceof HTMLAnchorElement) &&
                    !(target.closest('button') || target.closest('a'))) {
                  const params = new URLSearchParams();
                  if (category) params.set('category', category);
                  if (subcategory) params.set('subcategory', subcategory);
                  if (locationFilter) params.set('location', locationFilter);
                  
                  const path = `/dealer/${dealer.id}?${params.toString()}`;
                  console.log('Navigating to:', path);
                  navigate(path, { 
                    state: { 
                      from: 'dealer-listing',
                      filters: { category, subcategory, location: locationFilter }
                    }
                  });
                }
              }}
            >
              {/* Product Image */}
              <div className="relative flex-shrink-0 w-20">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mb-1.5 flex items-center justify-center">
                  <img 
                    src={getDealerImage(dealer)} 
                    alt={dealer.name}
                    className="w-full h-full object-contain p-1"
                    style={{ 
                      maxWidth: '140%',
                      maxHeight: '140%',
                      transform: 'scale(1.4)'
                    }}
                    onError={(e) => handleImageError(e, dealer)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center bg-yellow-50 px-1.5 py-0.5 rounded text-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                    <Link to={`/dealer/${dealer.id}`} className="block group text-sm font-medium text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                      {dealer.rating.toFixed(1)}
                    </Link>
                    <span className="ml-0.5 text-2xs text-gray-500">({dealer.reviewCount || 0})</span>
                  </div>
                  {dealer.deliveryTime && (
                    <div className="flex items-center justify-center text-2xs text-gray-500">
                      <Truck className="w-3 h-3 mr-0.5 text-gray-400" />
                      <span>{dealer.deliveryTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{dealer.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono bg-gray-100">
                        ID: {generateDealerCode(dealer.id)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1 -mx-0.5">
                      {/* Category Badge */}
                      <div className="inline-flex items-center max-w-[100px] px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 overflow-hidden">
                        {dealer.category === 'cement' && <Factory className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.category === 'bricks' && <BrickWall className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.category === 'sand' && <Droplets className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.category === 'blocks' && <Boxes className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.category === 'steel' && <Package2 className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.category === 'pipes' && <Ruler className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {!['cement', 'bricks', 'sand', 'blocks', 'steel', 'pipes'].includes(dealer.category) && (
                          <BoxIcon className="flex-shrink-0 w-3 h-3 mr-1" />
                        )}
                        <span className="truncate">
                          {formatCategory(dealer.category)}
                        </span>
                      </div>
                      
                      {/* Subcategory Badge */}
                      <div className="inline-flex items-center max-w-[100px] px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 overflow-hidden">
                        {dealer.subcategory === 'opc-43' && <HardHat className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'opc-53' && <HardHat className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'ppc' && <Droplet className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'fly-ash-bricks' && <BrickWall className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'concrete-blocks' && <Boxes className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'm-sand' && <Droplets className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'riversand' && <Droplet className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'cement-bricks' && <BrickWall className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'concrete-bricks' && <BrickWall className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'red-bricks' && <BrickWall className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'rcc-pipes' && <Ruler className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'pvc-pipes' && <Ruler className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'hume-pipes' && <Ruler className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'tmt-bars' && <Package2 className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'steel-bars' && <Package2 className="flex-shrink-0 w-3 h-3 mr-1" />}
                        {dealer.subcategory === 'steel-plates' && <Package2 className="flex-shrink-0 w-3 h-3 mr-1" />}
                        <span className="truncate">
                          {formatCategory(dealer.subcategory)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleLike(dealer, e)}
                    className="text-gray-300 hover:text-red-500 focus:outline-none p-1 -mr-1"
                    aria-label={isLiked(dealer.id.toString()) ? 'Remove from liked items' : 'Add to liked items'}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked(dealer.id.toString()) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} 
                    />
                  </button>
                </div>
                
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <Package className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {dealer.businessType || 'Supplier'}
                  {dealer.location && (
                    <>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {dealer.location}
                    </>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹{dealer.price}</span>
                    <span className="text-sm text-gray-500 ml-1">/{dealer.unit || 'unit'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8 px-3 flex-1"
                      onClick={() => {
                        // Create a new URLSearchParams with the current category and subcategory
                        const params = new URLSearchParams();
                        if (category) params.set('category', category);
                        if (subcategory) params.set('subcategory', subcategory);
                        if (locationFilter) params.set('location', locationFilter);
                        
                        // Navigate to the dealer profile with the current filters
                        navigate(`/dealer/${dealer.id}?${params.toString()}`, { 
                          state: { 
                            from: 'dealer-listing',
                            filters: { category, subcategory, location: locationFilter }
                          } 
                        });
                      }}
                    >
                      View
                    </Button>
                    <Button 
                      variant="default"
                      size="sm" 
                      className={`text-xs h-8 px-3 flex-1 transition-all ${
                        isItemInCart(dealer.id.toString()) 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                      onClick={(e) => handleAddToCart(dealer, e)}
                      disabled={addingToCartId === dealer.id.toString()}
                    >
                      {addingToCartId === dealer.id.toString() ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isItemInCart(dealer.id.toString()) ? 'Removing...' : 'Adding...'}
                        </div>
                      ) : isItemInCart(dealer.id.toString()) ? (
                        <div className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          <span>In Cart</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          <span>Add</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

            {filteredDealers.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerListing2S;