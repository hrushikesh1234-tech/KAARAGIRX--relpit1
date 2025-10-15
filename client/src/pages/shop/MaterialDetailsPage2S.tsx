'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MapPin, Truck, Heart, ShoppingCart, 
  ArrowLeft, ArrowRight, Plus, Minus, Check,  
  Building2, ChevronDown, User
} from 'lucide-react';
import { useMaterial, useMaterialsByDealer } from "@/hooks/useMaterials";
import { useCart } from "@/contexts/CartContext";
import { useLikedItems } from "@/contexts/LikedItemsContext";
import { getFallbackImage } from "@/utils/imageUtils";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import '@/styles/custom-scrollbar.css';
import { toast } from 'sonner';

interface ProductImage {
  url: string;
  alt: string;
}

const MaterialDetailsPage2S = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, isItemInCart, removeFromCart } = useCart();
  const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch material details
  const { data: material, isLoading: isLoadingMaterial } = useMaterial(materialId || '');
  
  // Fetch dealer's other products
  const { data: dealerProducts = [], isLoading: isLoadingProducts } = useMaterialsByDealer(
    material?.dealerId || 0
  );

  // Get product images (either from images array or construct from material data)
  const getProductImages = (): ProductImage[] => {
    if (!material) return [];
    
    // If material has images array, use it
    if (material.images && material.images.length > 0) {
      return material.images.map((img, idx) => ({
        url: img,
        alt: `${material.name} - Image ${idx + 1}`
      }));
    }
    
    // Otherwise use single image or fallback
    const imageUrl = material.image || getFallbackImage(material.category || 'other');
    return [{
      url: imageUrl,
      alt: material.name
    }];
  };

  const productImages = getProductImages();
  const selectedImage = productImages[selectedImageIndex]?.url || productImages[0]?.url || '';

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Handle swipe navigation
  const handleSwipeLeft = useCallback(() => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex(prevIndex => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  }, [productImages.length]);

  const handleSwipeRight = useCallback(() => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex(prevIndex => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [productImages.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeRight,
    onSwipedRight: handleSwipeLeft,
    trackMouse: true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!material) return;
    
    setIsAddingToCart(true);
    
    try {
      const cartItem = {
        id: `${material.id}`,
        name: material.name,
        price: Number(material.price),
        quantity: quantity,
        unit: material.unit || 'unit',
        image: material.image || '',
        dealerName: material.dealerName || '',
        dealerId: `${material.dealerId}`
      };
      
      if (isItemInCart(cartItem.id)) {
        removeFromCart(cartItem.id);
        toast.success('Removed from cart', {
          description: `${cartItem.name} has been removed from your cart`,
          duration: 3000
        });
      } else {
        addToCart(cartItem);
        toast.success('Added to cart', {
          description: `${quantity} ${material.unit || 'unit'} of ${cartItem.name} has been added to your cart`,
          action: {
            label: 'View Cart',
            onClick: () => navigate('/cart')
          },
          duration: 3000
        });
      }
      
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart', {
        description: 'Please try again',
        duration: 3000
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleLike = () => {
    if (!material) return;
    
    const id = material.id.toString();
    
    if (isLiked(id)) {
      removeLikedItem(id);
      toast.success('Removed from favorites');
    } else {
      addLikedItem({
        id,
        name: material.name,
        price: Number(material.price),
        image: material.image || '',
        unit: material.unit || 'unit',
        dealerName: material.dealerName || '',
        dealerId: material.dealerId.toString()
      });
      toast.success('Added to favorites');
    }
  };

  const handleDealerClick = () => {
    if (!material?.dealerId) return;
    navigate(`/dealer-public/${material.dealerId}`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/material/${productId}`);
  };

  if (isLoadingMaterial || !material) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Filter out current product from dealer's products
  const otherDealerProducts = dealerProducts.filter(p => p.id !== material.id);

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold truncate">{material.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6">
          {/* Product Details Section */}
          <div className="bg-white shadow-sm rounded-lg p-3 sm:p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Image Gallery */}
              <div className="space-y-3">
                {/* Main Image */}
                <div 
                  className="relative bg-gray-100 rounded-lg overflow-hidden group" 
                  style={{ aspectRatio: '4/3' }}
                  {...swipeHandlers}
                >
                  <div className="w-full h-full">
                    <Zoom>
                      <img 
                        src={selectedImage} 
                        alt={material.name}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getFallbackImage(material.category || 'other');
                        }}
                      />
                    </Zoom>
                    
                    {/* Navigation arrows */}
                    {productImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={handleSwipeLeft}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={handleSwipeRight}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleThumbnailClick(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={img.url} 
                          alt={img.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getFallbackImage(material.category || 'other');
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{material.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{material.category}</Badge>
                    {material.subcategory && (
                      <Badge variant="outline">{material.subcategory}</Badge>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{Number(material.price).toLocaleString()}
                    </span>
                    <span className="text-gray-600">/ {material.unit}</span>
                  </div>

                  {/* In Stock Badge */}
                  {material.inStock && (
                    <Badge className="bg-green-500 mb-4">
                      <Check className="h-3 w-3 mr-1" />
                      In Stock
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {material.description && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 text-sm">{material.description}</p>
                  </div>
                )}

                {/* Specifications */}
                {material.specifications && Object.keys(material.specifications).length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(material.specifications).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-600">{key}:</span>
                          <span className="ml-1 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Minimum Order */}
                {material.minOrder && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Minimum Order:</span> {material.minOrder}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-gray-600 ml-2">{material.unit}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      'Adding...'
                    ) : isItemInCart(material.id.toString()) ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        In Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant={isLiked(material.id.toString()) ? "default" : "outline"}
                    size="icon"
                    className="flex-shrink-0"
                    onClick={toggleLike}
                  >
                    <Heart 
                      className={`h-5 w-5 ${isLiked(material.id.toString()) ? 'fill-current' : ''}`} 
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Information Section */}
          <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg mb-3">Sold By</h3>
            <div 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg cursor-pointer hover:from-blue-100 hover:to-gray-100 transition-all duration-200 border border-blue-100 hover:border-blue-200 group"
              onClick={handleDealerClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleDealerClick();
                }
              }}
            >
              <div className="flex-shrink-0">
                {material.dealerImage ? (
                  <img 
                    src={material.dealerImage} 
                    alt={material.dealerName || 'Dealer'}
                    className="w-20 h-20 rounded-full object-cover border-3 border-blue-200 group-hover:border-blue-300 transition-colors shadow-md"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/default-dealer.png';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-3 border-blue-200 group-hover:border-blue-300 transition-colors shadow-md">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg text-gray-900 truncate">{material.dealerName || 'Dealer'}</h4>
                  {material.dealerVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs flex-shrink-0">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {material.dealerLocation && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{material.dealerLocation}</span>
                  </div>
                )}
                {material.dealerRating && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">{material.dealerRating}</span>
                    </div>
                    {material.dealerReviewCount && (
                      <span className="text-sm text-gray-500">({material.dealerReviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                <ChevronDown className="h-6 w-6 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                <span className="text-xs font-medium whitespace-nowrap">View Profile</span>
              </div>
            </div>
          </div>

          {/* Other Products from This Dealer */}
          {otherDealerProducts.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">More from {material.dealerName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {otherDealerProducts.slice(0, 8).map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-3">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <img 
                          src={product.image || getFallbackImage(product.category || 'other')} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getFallbackImage(product.category || 'other');
                          }}
                        />
                      </div>
                      <h4 className="font-medium text-sm mb-1 truncate">{product.name}</h4>
                      <p className="text-blue-600 font-semibold text-sm">
                        ₹{Number(product.price).toLocaleString()}
                        <span className="text-gray-500 text-xs ml-1">/ {product.unit}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {otherDealerProducts.length > 8 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleDealerClick}
                  >
                    View All Products from {material.dealerName}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailsPage2S;
