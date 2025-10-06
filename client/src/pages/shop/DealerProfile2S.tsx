'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
// Import useSwipeable
import { useSwipeable } from 'react-swipeable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Import Lucide icons
import { 
  Star, MapPin, Truck, Phone, Heart, ShoppingCart, 
  ArrowLeft, ArrowRight, Plus, Minus, Check, CheckCircle2, 
  Clock, MessageSquare, CreditCard, Wallet, DollarSign, Package as PackageIcon, X,
  Building2, Calendar, BadgeCheck, Award, ShieldCheck, Users, Box, CheckCircle, Loader2, Mail, ZoomIn,
  ChevronDown 
} from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { dealers } from "@/data/dealers";
import { Dealer } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { getDealerImagePath, getFallbackImage, getDealerImageById, getDealerProductImage, getDealerImages } from "@/utils/imageUtils";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import '@/styles/custom-scrollbar.css';
import { toast } from 'sonner';

interface OrderDetails {
  quantity: number;
  totalPrice: number;
  deliveryCharge: number;
  tax: number;
  grandTotal: number;
  deliveryAddress: string;
  paymentMethod: string;
}

interface ProductInfo {
  name: string;
  productName: string;
  price: number;
  unit: string;
  features: string[];
  specifications: Record<string, string>;
  description: string;
  otherProducts: Array<{
    id: number;
    name: string;
    price: number;
    unit: string;
    image: string;
  }>;
}

const DealerProfile2S = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeSection, setActiveSection] = useState<'description' | 'order'>('description');
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [visibleProductsCount, setVisibleProductsCount] = useState(4);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, isItemInCart, removeFromCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    quantity: 1,
    totalPrice: 0,
    deliveryCharge: 0,
    tax: 0,
    grandTotal: 0,
    deliveryAddress: '',
    paymentMethod: 'cod'
  });

  // Get product images for the current dealer
  const getProductImages = (dealer: Dealer): string[] => {
    // Map of dealer IDs to their specific image paths arrays
    const dealerImageMap: Record<number, string[]> = {
      // Cement Dealers
      1: [
        '/images/materials images/cement/001/a1.png',
        '/images/materials images/cement/001/a2.png',
        '/images/materials images/cement/001/a3.png',
        '/images/materials images/cement/001/a4.png',
        '/images/materials images/cement/001/a5.png',
        '/images/materials images/cement/001/a6.png'
      ],
      2: [
        '/images/materials images/cement/002/b1.png',
        '/images/materials images/cement/002/b2.png',
        '/images/materials images/cement/002/b3.png',
        '/images/materials images/cement/002/b4.png'
      ],
      245: [
        '/images/materials images/cement/245/c1.png',
        '/images/materials images/cement/245/c2.png',
        '/images/materials images/cement/245/c3.png',
        '/images/materials images/cement/245/c4.png',
        '/images/materials images/cement/245/c5.png',
        '/images/materials images/cement/245/c6.png',
        '/images/materials images/cement/245/c7.png'
      ],
      250: [
        '/images/materials images/cement/250/e1.png',
        '/images/materials images/cement/250/e2.png',
        '/images/materials images/cement/250/e3.png',
        '/images/materials images/cement/250/e4.png',
        '/images/materials images/cement/250/e5.png',
        '/images/materials images/cement/250/e6.png',
        '/images/materials images/cement/250/e7.png'
      ],
      253: [
        '/images/materials images/cement/253/d1.png',
        '/images/materials images/cement/253/d2.png',
        '/images/materials images/cement/253/d3.png',
        '/images/materials images/cement/253/d4.png',
        '/images/materials images/cement/253/d5.png',
        '/images/materials images/cement/253/d6.png',
        '/images/materials images/cement/253/d7.png',
        '/images/materials images/cement/253/d8.png'
      ],
      // Bricks Dealers
      5: [
        '/images/materials images/bricks/005/f1.png',
        '/images/materials images/bricks/005/f2.png',
        '/images/materials images/bricks/005/f3.png',
        '/images/materials images/bricks/005/f4.png',
        '/images/materials images/bricks/005/f5.png',
        '/images/materials images/bricks/005/f6.png',
        '/images/materials images/bricks/005/f7.png',
        '/images/materials images/bricks/005/f8.png'
      ],
      238: [
        '/images/materials images/bricks/238/g1.png',
        '/images/materials images/bricks/238/g2.png',
        '/images/materials images/bricks/238/g3.png',
        '/images/materials images/bricks/238/g4.png',
        '/images/materials images/bricks/238/g5.png',
        '/images/materials images/bricks/238/g6.png',
        '/images/materials images/bricks/238/g7.png',
        '/images/materials images/bricks/238/g8.png'
      ],
      // Blocks Dealers
      3: [
        '/images/materials images/blocks/003/h1.png',
        '/images/materials images/blocks/003/h2.png',
        '/images/materials images/blocks/003/h3.png',
        '/images/materials images/blocks/003/h4.png',
        '/images/materials images/blocks/003/h5.png',
        '/images/materials images/blocks/003/h6.png',
        '/images/materials images/blocks/003/h7.png',
        '/images/materials images/blocks/003/h8.png'
      ],
      239: [
        '/images/materials images/blocks/239/i1.png',
        '/images/materials images/blocks/239/i2.png',
        '/images/materials images/blocks/239/i3.png',
        '/images/materials images/blocks/239/i4.png',
        '/images/materials images/blocks/239/i5.png',
        '/images/materials images/blocks/239/i6.png',
        '/images/materials images/blocks/239/i7.png',
        '/images/materials images/blocks/239/i8.png'
      ],
      // Sand Dealers
      4: [
        '/images/materials images/sand/004/j1.png',
        '/images/materials images/sand/004/j2.png',
        '/images/materials images/sand/004/j3.png',
        '/images/materials images/sand/004/j4.png'
      ],
      240: [
        '/images/materials images/sand/240/k1.png',
        '/images/materials images/sand/240/k2.png',
        '/images/materials images/sand/240/k3.png',
        '/images/materials images/sand/240/k4.png',
        '/images/materials images/sand/240/k5.png'
      ],
      246: [
        '/images/materials images/sand/246/l1.png',
        '/images/materials images/sand/246/l2.png',
        '/images/materials images/sand/246/l3.png'
      ],
      251: [
        '/images/materials images/sand/251/m1.png',
        '/images/materials images/sand/251/m2.png',
        '/images/materials images/sand/251/m3.png',
        '/images/materials images/sand/251/m4.png'
      ],
      254: [
        '/images/materials images/sand/254/n1.png',
        '/images/materials images/sand/254/n2.png',
        '/images/materials images/sand/254/n3.png',
        '/images/materials images/sand/254/n4.png'
      ],
      // Steel Dealers
      6: [
        '/images/materials images/steel/006/03.png',
        '/images/materials images/steel/006/o1.png',
        '/images/materials images/steel/006/o2.png',
        '/images/materials images/steel/006/o3.png',
        '/images/materials images/steel/006/o4.png',
        '/images/materials images/steel/006/o5.png',
        '/images/materials images/steel/006/o6.png',
        '/images/materials images/steel/006/o7.png',
        '/images/materials images/steel/006/o8.png'
      ],
      241: [
        '/images/materials images/steel/241/p1.png',
        '/images/materials images/steel/241/p2.png',
        '/images/materials images/steel/241/p3.png',
        '/images/materials images/steel/241/p4.png',
        '/images/materials images/steel/241/p5.png'
      ],
      247: [
        '/images/materials images/steel/247/q1.png',
        '/images/materials images/steel/247/q2.png',
        '/images/materials images/steel/247/q3.png',
        '/images/materials images/steel/247/q4.png',
        '/images/materials images/steel/247/q5.png',
        '/images/materials images/steel/247/q6.png',
        '/images/materials images/steel/247/q7.png'
      ],
      // Stone Dust Dealers
      7: [
        '/images/materials images/stone dust/007/r1.png',
        '/images/materials images/stone dust/007/r2.png',
        '/images/materials images/stone dust/007/r33.png',
        '/images/materials images/stone dust/007/r4.png',
        '/images/materials images/stone dust/007/r5.png',
        '/images/materials images/stone dust/007/r6.png'
      ],
      242: [
        '/images/materials images/stone dust/242/s1.png',
        '/images/materials images/stone dust/242/s2.png',
        '/images/materials images/stone dust/242/s3.png',
        '/images/materials images/stone dust/242/s4.png'
      ],
      // Aggregate Dealers
      8: [
        '/images/materials images/aggregate/008/t1.png',
        '/images/materials images/aggregate/008/t2.png',
        '/images/materials images/aggregate/008/t3.png',
        '/images/materials images/aggregate/008/t4.png'
      ],
      243: [
        '/images/materials images/aggregate/243/u1.png',
        '/images/materials images/aggregate/243/u2.png',
        '/images/materials images/aggregate/243/u3.png'
      ],
      248: [
        '/images/materials images/aggregate/248/v1.png',
        '/images/materials images/aggregate/248/v2.png',
        '/images/materials images/aggregate/248/v3.png',
        '/images/materials images/aggregate/248/v4.png'
      ],
      252: [
        '/images/materials images/aggregate/252/w1.png',
        '/images/materials images/aggregate/252/w2.png',
        '/images/materials images/aggregate/252/w3.png',
        '/images/materials images/aggregate/252/w4.png'
      ],
      // Rubblestone Dealers
      9: [
        '/images/materials images/rubblestone/009/x1.png',
        '/images/materials images/rubblestone/009/x2.png',
        '/images/materials images/rubblestone/009/x33.png',
        '/images/materials images/rubblestone/009/x4.png'
      ],
      244: [
        '/images/materials images/rubblestone/244/y1.png',
        '/images/materials images/rubblestone/244/y2.png',
        '/images/materials images/rubblestone/244/y3.png'
      ],
      249: [
        '/images/materials images/rubblestone/249/z1.png',
        '/images/materials images/rubblestone/249/z2.png',
        '/images/materials images/rubblestone/249/z3.png',
        '/images/materials images/rubblestone/249/z4.png'
      ]
    };

    // If we have specific images for this dealer, return them
    const dealerId = typeof dealer.id === 'string' ? parseInt(dealer.id, 10) : dealer.id;
    if (dealerId && dealerImageMap[dealerId]) {
      return dealerImageMap[dealerId].filter(Boolean); // Filter out any empty/undefined values
    }

    // Fallback to the original logic if no specific images are found
    const images = new Set<string>();
    
    // Only try to get product image if we have a valid numeric id
    if (dealer.id) {
      const mainProductImage = getDealerProductImage({
        id: Number(dealer.id),
        category: dealer.category
      });
      if (mainProductImage) images.add(mainProductImage);
    }
    
    if (dealer.image) {
      images.add(dealer.image);
    }
    
    if (images.size === 0) {
      const fallbackImage = getFallbackImage(dealer.category);
      if (fallbackImage) {
        images.add(fallbackImage);
      }
    }
    
    const result = Array.from(images).filter(Boolean); // Filter out any empty/undefined values
    return result.length > 0 ? result : [getFallbackImage(dealer.category)];
  };

  const productImages = dealer ? getProductImages(dealer as Dealer) : [];

  // Handle thumbnail click
  const handleThumbnailClick = (img: string, index: number) => {
    setSelectedImage(img);
    setSelectedImageIndex(index);
  };

  // Handle swipe left/right
  const handleSwipeLeft = useCallback(() => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? productImages.length - 1 : prevIndex - 1;
      setSelectedImage(productImages[newIndex]);
      return newIndex;
    });
  }, [productImages]);

  const handleSwipeRight = useCallback(() => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex(prevIndex => {
      const newIndex = prevIndex === productImages.length - 1 ? 0 : prevIndex + 1;
      setSelectedImage(productImages[newIndex]);
      return newIndex;
    });
  }, [productImages]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeRight, // Note: Swipe left shows next image (right in array)
    onSwipedRight: handleSwipeLeft, // Swipe right shows previous image (left in array)
    trackMouse: true
  });

  useEffect(() => {
    const foundDealer = dealers.find(d => d.id === parseInt(dealerId || '0'));
    if (foundDealer) {
      setDealer(foundDealer);
      // Set the first image from productImages as selected when dealer changes
      const images = getProductImages(foundDealer);
      setSelectedImage(images[0] || foundDealer.image);
      setSelectedImageIndex(0);
    } else {
      // If coming from dealer listing, go back to it with filters
      const state = window.history.state;
      if (state?.usr?.from === 'dealer-listing') {
        const { filters } = state.usr;
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.subcategory) params.set('subcategory', filters.subcategory);
        if (filters.location) params.set('location', filters.location);
        navigate(`/dealers?${params.toString()}`, { replace: true });
      } else {
        navigate('/dealers');
      }
    }
    setIsLoading(false);
  }, [dealerId, navigate]);

  // Handle back button click
  const handleBack = () => {
    const state = window.history.state;
    if (state?.usr?.from === 'dealer-listing') {
      const { filters } = state.usr;
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.subcategory) params.set('subcategory', filters.subcategory);
      if (filters.location) params.set('location', filters.location);
      navigate(`/dealers?${params.toString()}`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleAddToCart = async () => {
    if (!dealer) return;
    
    setIsAddingToCart(true);
    
    try {
      const cartItem = {
        id: `${dealer.id}`,
        name: `${dealer.subcategory || ''} ${dealer.category || 'Product'}`.trim(),
        price: dealer.price,
        quantity: quantity, // Include the selected quantity
        unit: productInfo?.unit || 'unit',
        image: dealer.image,
        dealerName: dealer.name,
        dealerId: `${dealer.id}`
      };
      
      if (isItemInCart(cartItem.id)) {
        // Remove from cart if already in cart
        removeFromCart(cartItem.id);
        toast.success('Removed from cart', {
          description: `${cartItem.name} has been removed from your cart`,
          duration: 3000
        });
      } else {
        // Add to cart if not in cart
        addToCart(cartItem);
        toast.success('Added to cart', {
          description: `${quantity} ${productInfo?.unit || 'unit'} of ${cartItem.name} has been added to your cart`,
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

  const handleBuyNow = () => {
    if (!dealer) return;
    
    // Calculate order details
    const subtotal = dealer.price * quantity;
    const deliveryCharge = subtotal > 1000 ? 0 : 100; // Free delivery for orders above 1000
    const tax = subtotal * 0.18; // 18% tax
    const grandTotal = subtotal + deliveryCharge + tax;
    
    setOrderDetails({
      quantity,
      totalPrice: subtotal,
      deliveryCharge,
      tax,
      grandTotal,
      deliveryAddress: '',
      paymentMethod: 'cod'
    });
    
    setIsBuyNowOpen(true);
  };
  
  const handlePlaceOrder = () => {
    if (!orderDetails.deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }
    
    setIsPlacingOrder(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Order placed:', {
        dealerId,
        ...orderDetails,
        product: dealer?.subcategory || dealer?.category
      });
      
      setIsPlacingOrder(false);
      setOrderPlaced(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsBuyNowOpen(false);
        setOrderPlaced(false);
        setQuantity(1);
      }, 3000);
    }, 2000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContact = () => {
    // Contact logic here
    console.log('Contact dealer:', dealerId);
  };
  
  const getProductInfo = (): ProductInfo => {
    const baseInfo: ProductInfo = {
      name: dealer?.name || 'Product',
      productName: `${dealer?.subcategory || ''} ${dealer?.category || 'Product'}`.trim(),
      price: dealer?.price || 0,
      unit: 'per unit',
      features: [],
      specifications: {
        "Brand": 'Not specified',
        "Material": 'Not specified',
        "Size": 'Not specified',
        "Color": 'Not specified',
        "Minimum Order": "Contact for details"
      },
      description: 'Product information not available',
      otherProducts: []
    };

    if (!dealer) {
      return baseInfo;
    }
    switch(dealer.category.toLowerCase()) {
      case 'cement':
        return {
          ...baseInfo,
          productName: `${dealer.subcategory || ''} Grade Cement`,
          price: dealer.price || 340,
          unit: 'per bag',
          specifications: {
            ...baseInfo.specifications,
            "Grade": dealer.subcategory || 'N/A',
            "Packaging": "50 kg bags",
            "Strength": "43 N/mm²",
            "Setting Time": "30 min (initial)",
            "Minimum Order": "10 bags"
          },
          description: `Premium quality ${dealer.subcategory || ''} grade cement for all your construction needs.`
        };

      case 'bricks':
        return {
          ...baseInfo,
          productName: `${dealer.subcategory || ''} Bricks`,
          price: dealer.price || 8,
          unit: 'per piece',
          specifications: {
            ...baseInfo.specifications,
            "Size": "190mm x 90mm x 90mm",
            "Compressive Strength": "3.5 N/mm²",
            "Water Absorption": "< 20%",
            "Quantity per Truck": "4000 pieces",
            "Minimum Order": "1000 pieces"
          },
          description: `High-quality ${dealer.subcategory || ''} bricks for strong and durable construction.`
        };

      default:
        return baseInfo;
    }
  };
  
  if (isLoading || !dealer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Removed duplicate getProductImages function and its associated image arrays
  const productInfo = getProductInfo();
  const otherProducts = productInfo.otherProducts;

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6">
          {/* Product Info */}
          <div className="bg-white shadow-sm p-1.5 sm:p-2 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              {/* Product Images Gallery */}
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
                        src={selectedImage || getDealerProductImage({
                          id: Number(dealer.id),
                          category: dealer.category
                        })} 
                        alt={productInfo?.productName || 'Product image'}
                        className="w-full h-full object-cover cursor-zoom-in touch-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getFallbackImage(dealer?.category || 'default');
                        }}
                      />
                    </Zoom>
                    
                    {/* Swipe navigation indicators */}
                    {productImages.length > 1 && (
                      <>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowLeft className="h-5 w-5" />
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle wishlist logic here
                    }}
                  >
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                  
                  {/* Zoom Hint */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-3 w-3 mr-1" />
                    Click to zoom
                  </div>
                </div>
                
                {/* Thumbnail Strip */}
                {productImages.length > 1 && (
                  <div className="relative">
                    <div 
                      className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
                      style={{
                        msOverflowStyle: 'none',  // Hide scrollbar in IE and Edge
                        scrollbarWidth: 'none',    // Hide scrollbar in Firefox
                        WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
                        scrollBehavior: 'smooth',  // Smooth scrolling
                        cursor: 'grab'             // Change cursor to indicate draggable
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
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleThumbnailClick(img, idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                            selectedImage === img || (idx === selectedImageIndex)
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getFallbackImage(dealer.category);
                            }}
                            loading="lazy"
                            draggable="false" // Prevent image dragging
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="text-xs text-gray-500 text-center">
                    {`${selectedImageIndex + 1} of ${productImages.length} images`}
                  </div>
                )}
              </div>
              {/* Product Details */}
              <div>
                <div className="mb-1.5">
                  <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{productInfo.productName}</h1>
                  <div className="flex items-center flex-wrap gap-1 text-xs">
                    <span className="text-gray-500">Sold by</span>
                    <span className="font-medium">{dealer.name}</span>
                    <Badge variant="outline" className="h-4 text-[10px] px-1.5 py-0 font-mono bg-gray-100">
                      ID: {String(dealer.id).padStart(3, '0').slice(-3)}
                    </Badge>
                    {dealer.verified && (
                      <Badge variant="outline" className="h-3.5 text-[9px] px-1 py-0">
                        <CheckCircle2 className="h-2 w-2 mr-0.5 text-green-500" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Rating and Price in one line */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <div className="flex -mr-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-2.5 w-2.5 ${i < Math.floor(dealer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {dealer.rating} ({dealer.reviewCount})
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{productInfo.price.toLocaleString()}
                  <span className="text-xs text-gray-500 ml-0.5">/{productInfo.unit}</span>
                </div>
              </div>
              
              {/* Quantity with bulk controls */}
              <div className="mb-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">Quantity</label>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 w-6 rounded-r-none p-0"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </Button>
                    <div className="h-6 w-8 flex items-center justify-center border-t border-b border-gray-300 font-medium text-xs bg-gray-50">
                      {quantity}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 w-6 rounded-l-none p-0"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
                {/* Bulk Quantity Controls - Single Row */}
                <div className="grid grid-cols-6 gap-0.5 mt-1">
                  {[50, 100, 500].map((amount) => (
                    <React.Fragment key={amount}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-5 text-[8px] p-0"
                        onClick={() => setQuantity(prev => prev === 1 ? amount : prev + amount)}
                      >
                        +{amount}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-5 text-[8px] p-0"
                        onClick={() => setQuantity(prev => Math.max(1, prev - amount))}
                        disabled={quantity <= 1}
                      >
                        -{amount}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-1.5 mt-1.5">
                <div className="flex gap-1.5">
                  <Button 
                    size="sm"
                    className={`flex-1 h-7 text-xs py-0 relative ${
                      isItemInCart(`${dealer.id}`) ? 'bg-green-100 hover:bg-green-200 text-green-800' : ''
                    }`}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : isItemInCart(`${dealer.id}`) ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <ShoppingCart className="h-2.5 w-2.5 mr-1" />
                    )}
                    {isItemInCart(`${dealer.id}`) ? 'In Cart' : 'Add to Cart'}
                    {isItemInCart(`${dealer.id}`) && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></span>
                    )}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 h-7 text-xs py-0 bg-orange-500 hover:bg-orange-600 text-white" 
                    onClick={handleContact}
                  >
                    <Phone className="h-2.5 w-2.5 mr-1" />
                    Call
                  </Button>
                </div>
                <Button 
                  size="sm"
                  className="w-full h-7 text-xs py-0 bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => {
                    const cartItem = {
                      id: `${dealer.id}`,
                      name: `${dealer.subcategory || ''} ${dealer.category || 'Product'}`.trim(),
                      price: dealer.price,
                      quantity: quantity,
                      unit: productInfo.unit,
                      image: dealer.image,
                      dealerName: dealer.name,
                      dealerId: `${dealer.id}`
                    };
                    
                    // Navigate to buy-now with the item as state
                    navigate(`/buy-now/${dealerId}`, { 
                      state: { 
                        directBuyItem: cartItem 
                      } 
                    });
                  }}
                >
                  <CreditCard className="h-2.5 w-2.5 mr-1" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        

        
        {/* Delivery & Payment Info */}
        <div className="mt-3 mx-0">
          <Card className="overflow-hidden">
            <CardHeader className="py-2 px-3 sm:px-4">
              <CardTitle className="text-sm font-medium">Delivery & Payment</CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-1 pb-3 sm:px-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Truck className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Delivery</h4>
                    <p className="text-xs text-gray-500">
                      {dealer.deliveryTime || '1-2 Days'} • {dealer.deliveryArea || 'All over India'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Payment Options</h4>
                    <p className="text-xs text-gray-500">
                      Cash on Delivery, UPI, Net Banking, Credit/Debit Cards
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs Section */}
        <div className="mt-3">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-auto max-w-md h-8 text-xs sm:text-sm">
              <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
              <TabsTrigger value="order-process" className="text-xs sm:text-sm">Order & Delivery</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-2">
              <Card className="border-0 shadow-none">
                <CardContent className="p-2 sm:p-3">
                  <div className="space-y-3">
                    {/* Product Description */}
                    <div className="-mt-1">
                      <h3 className="text-sm font-medium mb-1.5">Product Description</h3>
                      <p className="text-xs text-gray-700 leading-snug">{productInfo.description}</p>
                    </div>
                    
                    {/* Key Features */}
                    <div className="border-t pt-2">
                      <h3 className="text-xs font-medium mb-1.5">Key Features</h3>
                      <ul className="space-y-1.5">
                        {productInfo.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Specifications */}
                    <div className="border-t pt-2">
                      <h3 className="text-xs font-medium mb-1.5">Specifications</h3>
                      <div className="space-y-2 text-xs">
                        {Object.entries(productInfo.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium text-right">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="order-process" className="mt-2">
              <Card className="border-0 shadow-none">
                <CardContent className="p-2 sm:p-3 space-y-4">
                  <div>
                    <h3 className="text-xs font-medium mb-1.5">How to Order</h3>
                    <ol className="space-y-1 text-xs text-gray-700 list-decimal list-inside">
                      <li>Add items to cart</li>
                      <li>Proceed to checkout</li>
                      <li>Complete delivery details</li>
                      <li>Make payment</li>
                      <li>Get order confirmation</li>
                    </ol>
                  </div>

                  <div className="pt-2 border-t">
                    <h3 className="text-xs font-medium mb-1.5">Payment Details</h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Payment:</span>
                        <span className="font-medium">50% of order value</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance Payment:</span>
                        <span className="font-medium">50% on delivery</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h3 className="text-xs font-medium mb-1.5">Need Help?</h3>
                    <p className="text-xs text-gray-700 mb-2">
                      Our customer support team is available to assist you with any questions or concerns.
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 text-gray-500 mr-1.5 flex-shrink-0" />
                        <span>+91 XXXXXXXXXX (10:00 AM - 7:00 PM, Mon-Sat)</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3.5 w-3.5 text-gray-500 mr-1.5 flex-shrink-0" />
                        <span>support@example.com</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Response time: Within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        
        {/* About the Seller */}
        <div className="mt-3">
          <Card className="border-0 shadow-none">
            <CardHeader className="py-1.5 px-3">
              <CardTitle className="text-sm font-medium text-gray-800">About the Seller</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left Column - Business Info */}
                <div className="md:w-1/3 space-y-4">
                  <div className="flex flex-col items-center text-center p-3 border rounded-lg">
                    <div className="relative">
                      {dealer.logo ? (
                        <img 
                          src={dealer.logo} 
                          alt={dealer.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                          <span className="text-xl font-medium text-gray-400">
                            {dealer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {dealer.verified && (
                        <div className="absolute top-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{dealer.name}</h3>
                    <p className="text-blue-600 text-xs flex items-center justify-center">
                      <Building2 className="h-3 w-3 mr-1" />
                      {dealer.businessType || 'Construction Supplier'}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-center">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs font-medium">{dealer.rating}</span>
                        <span className="mx-1 text-gray-200">|</span>
                        <span className="text-xs text-gray-600">
                          {dealer.reviewCount || 0} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 p-3 border rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <ShieldCheck className="h-4 w-4 text-green-500 mr-1.5" />
                      Business Verification
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                        <span>Business Registered</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                        <span>GST Verified</span>
                      </div>
                      {dealer.verified && (
                        <div className="flex items-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                          <span>Verified Supplier</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Details */}
                <div className="md:w-2/3 space-y-6">
                  {/* Business Information */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-800">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-1.5 rounded-md mr-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">Business Type</h4>
                          <p className="text-xs font-medium">{dealer.businessType || 'Manufacturer & Supplier'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-1.5 rounded-md mr-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">Year Established</h4>
                          <p className="text-xs font-medium">{dealer.yearEstablished || '2015'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-1.5 rounded-md mr-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">Location</h4>
                          <p className="text-xs font-medium">{dealer.location}</p>
                          <p className="text-[11px] text-gray-500">{dealer.deliveryArea || 'Serves all over India'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-1.5 rounded-md mr-2">
                          <Box className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">Main Products</h4>
                          <p className="text-xs font-medium">
                            {dealer.category} {dealer.subcategory ? `(${dealer.subcategory})` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Business Description */}
                  {dealer.description && (
                    <div className="space-y-1.5">
                      <h3 className="text-base font-medium text-gray-800">Business Description</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {dealer.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Certifications & Standards */}
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-800">Certifications & Standards</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'ISO 9001:2015',
                        'BIS Certified',
                        'ISO 14001:2015',
                        'OHSAS 18001:2007'
                      ].map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-0.5 px-1.5 h-5">
                          <BadgeCheck className="h-3 w-3 mr-1 text-green-500" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Response Information */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">98%</div>
                        <div className="text-xs text-gray-600">Response Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">2h</div>
                        <div className="text-xs text-gray-600">Avg. Response Time</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">24h</div>
                        <div className="text-xs text-gray-600">Max. Response Time</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">95%</div>
                        <div className="text-xs text-gray-600">Order Fulfillment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More from this Dealer */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="mb-5">
            <h2 className="text-lg font-medium text-gray-900">Explore other products available from this seller</h2>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {dealers
              .filter(d => d.id !== dealer?.id && d.name === dealer?.name) // Get other products from same dealer
              .slice(0, visibleProductsCount) // Show products based on visible count
              .map((product) => (
                <Link to={`/dealer/${product.id}`} key={product.id} className="group block h-full" onClick={() => {
                  window.scrollTo(0, 0);
                  window.location.href = `/dealer/${product.id}`; // Force page reload
                }}>
                  <Card className="h-full flex flex-col hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
                    <div className="relative flex-grow">
                      <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <button 
                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm hover:bg-gray-100 transition-colors z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle wishlist logic here
                        }}
                      >
                        <Heart className="h-3 w-3 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-2 flex flex-col h-[120px]">
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-start gap-0.5 mb-0.5">
                          <Badge variant="outline" className="text-[9px] leading-none px-1 py-0.5 border-0 bg-gray-50">
                            {product.category}
                          </Badge>
                          {product.verified && (
                            <Badge variant="outline" className="text-[9px] leading-none px-1 py-0.5 bg-green-50 border-0 text-green-700">
                              <CheckCircle2 className="h-2 w-2 mr-0.5 inline" /> Verified
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
                          {product.subcategory || product.category}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Star className="h-2.5 w-2.5 text-yellow-400 fill-current" />
                            <span className="ml-0.5 text-[10px] font-medium">{product.rating}</span>
                            <span className="text-[8px] text-gray-500 ml-1">
                              ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <p className="text-sm font-bold">
                          ₹{product.price.toFixed(2)}
                          <span className="text-[10px] font-normal text-gray-500 ml-0.5">/{product.unit}</span>
                        </p>
                        <Button size="sm" className="w-full text-[10px] h-6 mt-1">
                          <ShoppingCart className="h-2.5 w-2.5 mr-1" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
          
          {dealers.filter(d => d.id !== dealer.id && d.name === dealer.name).length > visibleProductsCount && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline"
                size="sm"
                className="text-sm text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setVisibleProductsCount(prev => prev + 4)}
              >
                View more products
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Dialog */}
      <Dialog open={isBuyNowOpen} onOpenChange={setIsBuyNowOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {orderPlaced ? 'Order Placed Successfully!' : 'Complete Your Order'}
            </DialogTitle>
          </DialogHeader>
          
          {!orderPlaced ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  value={orderDetails.deliveryAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={orderDetails.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="cod" className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="online"
                      checked={orderDetails.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="online" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Online Payment
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Price ({orderDetails.quantity} {dealer?.unit || 'unit'})</span>
                  <span>₹{orderDetails.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className={orderDetails.deliveryCharge === 0 ? 'text-green-600' : ''}>
                    {orderDetails.deliveryCharge === 0 ? 'FREE' : `₹${orderDetails.deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total Amount</span>
                  <span>₹{orderDetails.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Confirmed!</h3>
              <p className="text-gray-500">Your order has been placed successfully.</p>
              <p className="text-sm text-gray-500 mt-2">Order ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          )}
          
          <DialogFooter>
            {!orderPlaced ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsBuyNowOpen(false)}
                  disabled={isPlacingOrder}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsBuyNowOpen(false)} className="w-full">
                Continue Shopping
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      
    </div>
  );
};

export default DealerProfile2S;
