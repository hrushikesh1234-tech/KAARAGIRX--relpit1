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

import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  CheckCircle2, 
  Package, 
  Grid3x3, 
  List,
  Truck
} from 'lucide-react';

import { useCart } from '@/contexts/CartContext';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useMaterials, type Material } from "@/hooks/useMaterials";
import { getFallbackImage } from "@/utils/imageUtils";
import './styles/scrollbar-hide.css';

type RouteParams = {
  category?: string;
  subcategory?: string;
};

type Subcategory = {
  name: string;
  slug: string;
  image: string;
};

type ViewMode = 'grid' | 'list';

const MaterialsListingPage2S: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  const { category: categoryParam = '', subcategory: subcategoryParam = '' } = useParams<RouteParams>();
  
  const { addToCart, removeFromCart, isItemInCart } = useCart();
  const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const searchParamsObj = useMemo(() => ({
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    toString: () => searchParams.toString()
  }), [searchParams]);
  
  const category = (categoryParam?.toLowerCase() || searchParamsObj.get('category') || '').toLowerCase();
  const subcategory = (subcategoryParam?.toLowerCase() || searchParamsObj.get('subcategory') || '').toLowerCase();
  
  const { data: materialList = [], isLoading, error } = useMaterials({
    category: category || undefined,
    subcategory: subcategory || undefined,
  });
  
  useEffect(() => {
    const sortParam = searchParamsObj.get('sort');
    const locationParam = searchParamsObj.get('location');
    
    if (sortParam) setSortBy(sortParam);
    if (locationParam) setLocationFilter(locationParam);
  }, [searchParamsObj]);
  
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
  
  const handleLocationChange = (location: string) => {
    setLocationFilter(location);
    updateFilters({ location: location === 'All Locations' ? '' : location });
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sort: value });
  };

  const getMaterialImage = (material: Material): string => {
    if (material?.image) {
      return material.image;
    }
    
    return getFallbackImage(material?.category || 'other');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, material: Material) => {
    const target = e.target as HTMLImageElement;
    target.src = getFallbackImage(material.category || 'other');
  };

  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    materialList.forEach(material => {
      if (material.dealerLocation) {
        locations.add(material.dealerLocation.split(',')[0].trim());
      }
    });
    return Array.from(locations).sort();
  }, [materialList]);

  const formatCategory = (category: string): string => {
    if (!category) return '';
    return category
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace('Mm', 'mm')
      .replace('Ppc', 'PPC')
      .replace('Op', 'OP')
      .replace('Tmt', 'TMT');
  };

  const filteredMaterials = materialList.filter((material: Material) => {
    const materialCategory = (material.category || '').toLowerCase();
    const materialSubcategory = (material.subcategory || '').toLowerCase();
    const materialLocation = (material.dealerLocation || '').toLowerCase();
    
    const normalizedCategory = category.trim();
    const normalizedSubcategory = subcategory.trim();
    const normalizedLocation = locationFilter.trim();
    
    const matchesCategory = !normalizedCategory || 
      materialCategory === normalizedCategory ||
      materialCategory.replace(/\s+/g, '-') === normalizedCategory;
    
    let matchesSubcategory = true;
    if (normalizedSubcategory) {
      const normalize = (str: string): string => str.toLowerCase().trim().replace(/[\s-]+/g, '-');
      const materialSubNormalized = normalize(materialSubcategory);
      const filterSubNormalized = normalize(normalizedSubcategory);
      
      const isStoneDust = ['stonedust', 'stone-dust', 'stone dust', 'fine-stone-dust', 'coarse-stone-dust']
        .map((s: string) => normalize(s))
        .includes(filterSubNormalized);
        
      const isRubble = ['rubblestone', 'rubble-stone', 'rubble stone', 'rubble', '10mm-rubble', '20mm-rubble', '40mm-rubble']
        .map((s: string) => normalize(s))
        .includes(filterSubNormalized);
      
      if (isStoneDust) {
        const stoneDustVariations = ['stonedust', 'stone-dust', 'stone dust', 'fine-stone-dust', 'coarse-stone-dust']
          .map((s: string) => normalize(s));
        matchesSubcategory = stoneDustVariations.some((variation: string) => 
          materialSubNormalized.includes(variation) || 
          variation.includes(materialSubNormalized)
        );
      } else if (isRubble) {
        const rubbleVariations = ['rubblestone', 'rubble-stone', 'rubble stone', 'rubble', '10mm-rubble', '20mm-rubble', '40mm-rubble']
          .map((s: string) => normalize(s));
        matchesSubcategory = rubbleVariations.some((variation: string) => 
          materialSubNormalized.includes(variation) || 
          variation.includes(materialSubNormalized)
        );
      } else {
        matchesSubcategory = 
          typeof materialSubNormalized === 'string' && 
          typeof filterSubNormalized === 'string' &&
          (materialSubNormalized === filterSubNormalized ||
           materialSubNormalized.includes(filterSubNormalized) ||
           filterSubNormalized.includes(materialSubNormalized)
          );
      }
    }
    
    const matchesLocation = !normalizedLocation || 
      (materialLocation && typeof materialLocation === 'string' && 
       normalizedLocation && typeof normalizedLocation === 'string' &&
       materialLocation.toLowerCase().includes(normalizedLocation.toLowerCase()));
      
    return matchesCategory && matchesSubcategory && matchesLocation;
  });

  const sortedAndFilteredMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case 'highest-rated':
        return (Number(b.dealerRating) || 0) - (Number(a.dealerRating) || 0);
      case 'lowest-rated':
        return (Number(a.dealerRating) || 0) - (Number(b.dealerRating) || 0);
      case 'price-high-to-low':
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      case 'price-low-to-high':
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      default:
        return 0;
    }
  });
  
  const handleSubcategorySelect = (subcatName: string) => {
    const normalizedCurrentSub = subcategory?.toLowerCase().trim() || '';
    const normalizedNewSub = subcatName.toLowerCase().trim();
    
    if (normalizedCurrentSub === normalizedNewSub) {
      updateFilters({ subcategory: '' });
    } else {
      updateFilters({ 
        subcategory: subcatName.replace(/\s+/g, '-') 
      });
    }
  };

  const toggleLike = (material: Material, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = typeof material.id === 'number' ? material.id.toString() : material.id;
    
    if (isLiked(id)) {
      removeLikedItem(id);
    } else {
      addLikedItem({
        id,
        name: material.name,
        price: Number(material.price) || 0,
        image: material.image || '',
        unit: material.unit || 'unit',
        dealerName: material.dealerName || '',
        dealerId: material.dealerId.toString()
      });
    }
  };

  const handleAddToCart = async (material: Material, e: React.MouseEvent) => {
    e.stopPropagation();
    const materialId = material.id.toString();
    const itemInCart = isItemInCart(materialId);
    
    setAddingToCartId(materialId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (itemInCart) {
        removeFromCart(materialId);
        toast.success('Item removed from cart');
      } else {
        addToCart({
          id: materialId,
          name: material.name,
          price: Number(material.price) || 0,
          unit: material.unit || 'unit',
          image: material.image || '',
          dealerName: material.dealerName || '',
          dealerId: material.dealerId.toString()
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

  const getSubcategories = (): Subcategory[] => {
    if (!category) return [];
    
    const subcategoryMap = new Map<string, Subcategory>();
    
    materialList.forEach(material => {
      if (material.category && material.category.toLowerCase() === category.toLowerCase() && material.subcategory) {
        const subcatName = material.subcategory.trim();
        if (!subcategoryMap.has(subcatName)) {
          const displayName = formatCategory(subcatName);
          const slug = subcatName.toLowerCase().replace(/\s+/g, '-');
          const image = material.image || getFallbackImage(category || 'other');
          
          subcategoryMap.set(subcatName, {
            name: displayName,
            slug,
            image
          });
        }
      }
    });
    
    return Array.from(subcategoryMap.values());
  };

  const subcategories = getSubcategories();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <h1 className="text-lg font-medium text-gray-900">Materials</h1>
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

          {/* Filters and View Toggle */}
          <div className="py-2">
            <div className="flex flex-row gap-2 items-center">
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

              {/* View Toggle */}
              <div className="flex gap-1 border border-gray-200 rounded p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Subcategories Slider */}
          {subcategories.length > 0 ? (
            <div className="border-b border-gray-100">
              <div className="relative pb-2">
                <div 
                  className="flex overflow-x-auto -mx-2"
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'smooth',
                    cursor: 'grab',
                    paddingBottom: '4px'
                  }}
                  onMouseDown={(e) => {
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
                          <Package className="w-full h-full p-2 text-gray-600" />
                        </div>
                        <span className={`text-2xs sm:text-xs text-center leading-tight ${
                          !subcategory ? 'text-blue-700 font-semibold' : 'text-gray-700'
                        }`}>
                          All
                        </span>
                      </button>
                    </div>

                    {/* Subcategory Buttons */}
                    {subcategories.map((subcat) => {
                      const isSelected = subcategory && subcategory.toLowerCase() === subcat.slug.toLowerCase();
                      return (
                        <div key={subcat.slug} className="flex-shrink-0 w-14 sm:w-20">
                          <button
                            onClick={() => handleSubcategorySelect(subcat.slug)}
                            className={`w-full flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all ${
                              isSelected 
                                ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-100 mb-1 sm:mb-1.5">
                              <img 
                                src={subcat.image} 
                                alt={subcat.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <span className={`text-2xs sm:text-xs text-center leading-tight ${
                              isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                            }`}>
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
          ) : null}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 mt-[155px] pb-20 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Products Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {sortedAndFilteredMaterials.map((material: Material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (category) params.set('category', category);
                    if (subcategory) params.set('subcategory', subcategory);
                    if (locationFilter) params.set('location', locationFilter);
                    
                    navigate(`/material/${material.id}?${params.toString()}`, {
                      state: {
                        from: 'materials-listing',
                        filters: { category, subcategory, location: locationFilter }
                      }
                    });
                  }}
                >
                  {/* Heart Icon */}
                  <button
                    onClick={(e) => toggleLike(material, e)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
                    aria-label={isLiked(material.id.toString()) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked(material.id.toString())
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={getMaterialImage(material)}
                      alt={material.name}
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, material)}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {material.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-white mr-0.5" />
                        <span className="font-medium">{(Number(material.dealerRating) || 0).toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500">({material.dealerReviewCount || 0})</span>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-lg font-bold text-gray-900">₹{material.price}</span>
                      <span className="text-xs text-gray-500 ml-1">/{material.unit || 'unit'}</span>
                    </div>

                    {/* Sold By */}
                    <div className="text-xs text-gray-600 mb-3">
                      Sold by: <span className="font-medium">{material.dealerName || 'Dealer'}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      variant="default"
                      size="sm"
                      className={`w-full text-xs h-8 transition-all ${
                        isItemInCart(material.id.toString())
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                      onClick={(e) => handleAddToCart(material, e)}
                      disabled={addingToCartId === material.id.toString()}
                    >
                      {addingToCartId === material.id.toString() ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isItemInCart(material.id.toString()) ? 'Removing...' : 'Adding...'}
                        </div>
                      ) : isItemInCart(material.id.toString()) ? (
                        <div className="flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          <span>In Cart</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 mr-1.5" />
                          <span>Add to Cart</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedAndFilteredMaterials.map((material: Material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer flex gap-4"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (category) params.set('category', category);
                    if (subcategory) params.set('subcategory', subcategory);
                    if (locationFilter) params.set('location', locationFilter);
                    
                    navigate(`/material/${material.id}?${params.toString()}`, {
                      state: {
                        from: 'materials-listing',
                        filters: { category, subcategory, location: locationFilter }
                      }
                    });
                  }}
                >
                  {/* Product Image */}
                  <div className="relative flex-shrink-0 w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                    <img
                      src={getMaterialImage(material)}
                      alt={material.name}
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, material)}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Product Name */}
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {material.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-white mr-0.5" />
                          <span className="font-medium">{(Number(material.dealerRating) || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-500">({material.dealerReviewCount || 0})</span>
                      </div>

                      {/* Sold By */}
                      <div className="text-sm text-gray-600 mb-2">
                        Sold by: <span className="font-medium">{material.dealerName || 'Dealer'}</span>
                      </div>

                      {/* Location */}
                      {material.dealerLocation && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Truck className="w-3.5 h-3.5 mr-1" />
                          <span>{material.dealerLocation}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-3">
                      {/* Price */}
                      <div>
                        <span className="text-xl font-bold text-gray-900">₹{material.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/{material.unit || 'unit'}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 items-center w-full sm:w-auto">
                        <button
                          onClick={(e) => toggleLike(material, e)}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                          aria-label={isLiked(material.id.toString()) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isLiked(material.id.toString())
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                        <Button
                          variant="default"
                          size="sm"
                          className={`text-sm h-9 px-3 sm:px-4 transition-all flex-1 sm:flex-initial ${
                            isItemInCart(material.id.toString())
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-orange-500 hover:bg-orange-600'
                          }`}
                          onClick={(e) => handleAddToCart(material, e)}
                          disabled={addingToCartId === material.id.toString()}
                        >
                          {addingToCartId === material.id.toString() ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="hidden sm:inline">{isItemInCart(material.id.toString()) ? 'Removing...' : 'Adding...'}</span>
                            </div>
                          ) : isItemInCart(material.id.toString()) ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              <span>In Cart</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ShoppingCart className="w-4 h-4 mr-1.5" />
                              <span>Add to Cart</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading materials...</p>
            </div>
          )}

          {!isLoading && filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsListingPage2S;
