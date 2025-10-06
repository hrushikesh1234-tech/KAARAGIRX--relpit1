import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Package, Plus, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal, getItemCount } = useCart();

  const subtotal = getCartTotal();
  const deliveryCharge = 0; // Free delivery
  const tax = Math.round(subtotal * 0.18); // 18% tax
  const total = subtotal + deliveryCharge + tax;

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">My Cart ({getItemCount()})</h1>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.3c-.2.4-.3.8-.3 1.3C4 19.6 5.4 21 7 21h12m-7-8h.01M16 21a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="text-gray-500 mt-1">Looks like you haven't added anything to your cart yet</p>
              <Button 
                className="mt-6 bg-green-600 hover:bg-green-700" 
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow mb-3">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-start space-x-3">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <Package className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="pr-2">
                              <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Sold by: {item.dealerName}
                                <span className="ml-2 text-green-600 font-medium">
                                  ₹{item.price.toFixed(2)}/pc
                                </span>
                              </p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1 -mr-1"
                              aria-label="Remove item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Price */}
                      <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-base font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div>
                        <div className="font-medium text-sm mb-1">Quantity</div>
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-fit">
                          <button 
                            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 py-1.5 text-sm w-12 text-center bg-white font-medium text-gray-800 border-x border-gray-100">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Bulk Buttons */}
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Add more quantity:</div>
                          <div className="flex flex-wrap gap-1">
                            {[50, 100, 500, 1000].map((amount) => (
                              <button
                                key={`add-${amount}`}
                                onClick={() => updateQuantity(item.id, item.quantity + amount)}
                                className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-green-50 hover:border-green-200 transition-colors bg-white"
                              >
                                +{amount}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Reduce quantity:</div>
                          <div className="flex flex-wrap gap-1">
                            {[50, 100, 500, 1000].map((amount) => (
                              <button
                                key={`sub-${amount}`}
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - amount))}
                                className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-red-50 hover:border-red-200 transition-colors bg-white"
                                disabled={item.quantity <= 1}
                              >
                                -{amount}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="font-medium text-lg mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button 
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 h-12 text-base font-medium"
                    onClick={() => {
                      const dealerId = items[0]?.dealerId || 'default';
                      navigate(`/buy-now/${dealerId}`);
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky Footer Toolbar */}
      <div className="sticky bottom-0 z-10 w-full h-16 bg-white flex items-center justify-center border-t">
        <div className="w-full max-w-7xl px-4">
          <p className="text-muted-foreground">Your footer toolbar</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
