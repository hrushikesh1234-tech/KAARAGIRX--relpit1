import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Import Lucide icons using require
import { ArrowLeft, Loader2, MapPin, Package, Truck, ShoppingCart } from 'lucide-react';
import { dealers } from "@/data/dealers";
import { Dealer } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface DirectBuyItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  dealerName: string;
  dealerId: string;
}

interface LocationState {
  directBuyItem?: DirectBuyItem;
}

const BuyNowRequest = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getCartTotal, getItemCount, addToCart } = useCart();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<DirectBuyItem | null>(null);
  
  // Check for direct buy item in location state
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.directBuyItem) {
      setDirectBuyItem(state.directBuyItem);
    }
    
    // Ensure the page loads at the top
    window.scrollTo(0, 0);
  }, [location.state]);
  
  // Calculate order summary values
  const getOrderSummary = () => {
    if (directBuyItem) {
      const subtotal = directBuyItem.price * directBuyItem.quantity;
      const deliveryCharge = subtotal >= 5000 ? 0 : 100;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + deliveryCharge + tax;
      return { subtotal, deliveryCharge, tax, total, itemCount: directBuyItem.quantity };
    } else {
      const subtotal = getCartTotal();
      const deliveryCharge = subtotal >= 5000 ? 0 : 100;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + deliveryCharge + tax;
      const itemCount = getItemCount();
      return { subtotal, deliveryCharge, tax, total, itemCount };
    }
  };
  
  const { subtotal, deliveryCharge, tax, total, itemCount } = getOrderSummary();
  const isCartEmpty = itemCount === 0 && !directBuyItem;
  
  // Form state with validation
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });
  
  const [errors] = useState<Record<string, string>>({});

  useEffect(() => {
    const foundDealer = dealers.find(d => d.id === parseInt(dealerId || '0'));
    if (foundDealer) {
      setDealer(foundDealer);
    } else {
      navigate('/dealers');
    }
    setIsLoading(false);
  }, [dealerId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!dealer) {
      console.error('No dealer data available');
      setIsSubmitting(false);
      return;
    }
    
    // Prepare order data with individual cart items or direct buy item
    const orderData = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      productName: directBuyItem 
        ? directBuyItem.name 
        : (items.length === 1 ? items[0].name : `${items.length} Items`),
      quantity: directBuyItem ? directBuyItem.quantity : getItemCount(),
      unit: directBuyItem ? directBuyItem.unit : 'items',
      price: directBuyItem 
        ? parseFloat(directBuyItem.price.toString()) 
        : (items.length === 1 ? parseFloat(items[0].price.toString()) : parseFloat(subtotal.toFixed(2))),
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      dealerName: dealer.name,
      dealerPhone: dealer.phone,
      deliveryCharge: parseFloat(deliveryCharge.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      items: directBuyItem 
        ? [{
            id: directBuyItem.id,
            name: directBuyItem.name,
            price: parseFloat(directBuyItem.price.toString()),
            quantity: directBuyItem.quantity,
            unit: directBuyItem.unit,
            image: directBuyItem.image,
            dealerName: directBuyItem.dealerName,
            dealerId: directBuyItem.dealerId
          }]
        : items.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price.toString()),
            quantity: item.quantity,
            unit: item.unit,
            image: item.image,
            dealerName: item.dealerName,
            dealerId: item.dealerId
          }))
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Navigate to track order page with order data (track-order-old renders TrackOrder2S)
      navigate('/track-order-old', { 
        state: { 
          order: orderData,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          notes: formData.notes,
          dealerName: dealer.name,
          dealerPhone: dealer.phone,
          productName: orderData.productName,
          quantity: orderData.quantity,
          unit: orderData.unit,
          price: orderData.price,
          total: orderData.total,
          deliveryCharge: orderData.deliveryCharge,
          tax: orderData.tax,
          subtotal: orderData.subtotal
        } 
      });
    }, 1500);
  };

  if (isLoading || !dealer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  


  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto w-full pt-4">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-2 ml-1 h-8 px-2 text-xs"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back to {dealer?.subcategory ? `${dealer.subcategory} Dealers` : 'Dealers'}
          </Button>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="md:flex">
              {/* Order Summary */}
              <div className="md:w-2/5 border-b md:border-b-0 md:border-r p-4 bg-gray-50">
                <h2 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-blue-600" />
                  Order Summary ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
                </h2>
                
                {/* Cart Items */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
                  {/* Show direct buy item or cart items */}
                  {directBuyItem ? (
                    <div className="flex space-x-3 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={directBuyItem.image || '/placeholder-product.jpg'} 
                          alt={directBuyItem.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">{directBuyItem.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">₹{directBuyItem.price.toLocaleString()}/{directBuyItem.unit}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            ₹{(directBuyItem.price * directBuyItem.quantity).toLocaleString()}
                          </span>
                          <div className="text-sm text-gray-500">
                            x {directBuyItem.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.id} className="flex space-x-3 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image || '/placeholder-product.jpg'} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                          <p className="text-xs text-gray-500 mb-1">₹{item.price.toLocaleString()}/{item.unit}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <div className="text-sm text-gray-500">
                              x {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No items in cart
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 text-sm pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                      {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
                    </span>
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
                </div>

                {/* Delivery Form */}
                <div className="mt-6">
                </div>
              </div>

              {/* Order Form */}
              <div className="md:w-3/5 p-4">
                {isSubmitting ? (
                  <div className="py-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Your Order</h3>
                    <p className="text-gray-600 mb-6">Please wait while we process your order...</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-blue-600" />
                      Delivery Information
                    </h2>
                    
                    <form id="order-form" className="space-y-6 md:pb-24" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-sm font-normal">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-9 text-sm"
                            required 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-sm font-normal">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-9 text-sm"
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-sm font-normal">Delivery Address</Label>
                        <Textarea 
                          id="address" 
                          name="address" 
                          rows={2}
                          value={formData.address}
                          onChange={handleInputChange}
                          className="text-sm min-h-[72px]"
                          required 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-sm font-normal">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={formData.city}
                            onChange={handleInputChange}
                            className="h-9 text-sm"
                            required 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="pincode" className="text-sm font-normal">Pincode</Label>
                          <Input 
                            id="pincode" 
                            name="pincode" 
                            type="number"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="h-9 text-sm"
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-sm font-normal">Additional Notes (Optional)</Label>
                        <Textarea 
                          id="notes" 
                          name="notes" 
                          rows={2}
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="text-sm min-h-[72px]"
                          placeholder="Any special instructions for delivery..."
                        />
                      </div>
                      
                      {/* Mobile submit button removed - using sticky bottom button only */}
                    </form>
                    
                    {/* Sticky Send Button with extra padding and elevation */}
                    <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 -mx-6 -mb-6 mt-6 pb-12 z-50">
                      <Button 
                        id="send-request-button"
                        type="submit" 
                        form="order-form"
                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium"
                        disabled={isSubmitting || isCartEmpty}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : 'Send Buy Request'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowRequest;
