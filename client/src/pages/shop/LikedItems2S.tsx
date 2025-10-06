
'use client';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Import icons using require to match project style
import { Heart, ArrowLeft, ShoppingCart, MapPin, Package, Home, ShoppingBag, Truck, Shield, Star } from 'lucide-react';

interface LikedItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  dealerName: string;
  dealerId: string;
}

const LikedItems = () => {
  const { likedItems, removeLikedItem } = useLikedItems();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item: LikedItem) => {
    // Create a cart item without quantity (will be added by the cart context)
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      image: item.image,
      dealerName: item.dealerName,
      dealerId: item.dealerId
    };
    // Add to cart (quantity will be handled by the cart context)
    addToCart(cartItem);
    toast.success('Added to cart');
  };

  const handleViewDetails = (item: LikedItem) => {
    navigate(`/dealer/${item.dealerId}`);
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeLikedItem(itemId);
    toast.success('Removed from saved items');
  };

  if (likedItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 w-full h-16 bg-white flex items-center justify-center border-b">
          <div className="w-full max-w-7xl px-4">
            <p className="text-muted-foreground">Your header toolbar</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto w-full flex items-center justify-center">
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

          {/* Empty State Content */}
          <div className="text-center p-8 max-w-md mx-auto">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love by clicking the heart icon</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Saved Items ({likedItems.length})</h1>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleViewDetails(item)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  aria-label="Remove from saved items"
                >
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Package className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>{item.unit}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span className="line-clamp-1">{item.dealerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">₹{item.price}</span>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(item)}
                    className="text-xs h-8"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default LikedItems;
