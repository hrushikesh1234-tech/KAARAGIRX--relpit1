import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentGatewayModal } from '@/components/PaymentGatewayModal';
import { useOrder, type Order, type OrderStatus, type OrderItem } from '@/contexts/OrderContext';

// Using Order and OrderItem types from OrderContext

interface LocationState {
  order: Order;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
  dealerName?: string;
  dealerPhone?: string;
  productName?: string;
  category?: string;
  subcategory?: string;
  quantity?: number;
  unit?: string;
  price?: number;
  total?: number;
  deliveryCharge?: number;
  tax?: number;
  subtotal?: number;
}

const TrackOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState | undefined;

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVerified, setIsVerified] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!locationState?.order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-4">It seems you've reached this page directly without an active order.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const { addOrder, updateOrderStatus, getOrder } = useOrder();

  // Set up order data from location state
  useEffect(() => {
    if (locationState?.order) {
      // Check if this order already exists in our context
      const foundOrder = getOrder(locationState.order.id);
      
      // Create order data with proper type safety
      const orderData: Order = foundOrder ? {
        ...foundOrder,
        // Ensure all required fields are present
        id: foundOrder.id,
        status: foundOrder.status || 'pending',
        productName: foundOrder.productName || 'Product',
        quantity: foundOrder.quantity || 1,
        unit: foundOrder.unit || 'piece',
        price: foundOrder.price || 0,
        total: foundOrder.total || 0,
        phone: foundOrder.phone || locationState.phone || '',
        address: foundOrder.address || locationState.address || '',
        orderDate: foundOrder.orderDate || new Date().toISOString(),
        items: foundOrder.items || []
      } : {
        // Create new order from location state
        ...locationState.order,
        id: locationState.order.id || Date.now().toString(),
        status: 'pending',
        productName: locationState.order.productName || 'Product',
        quantity: locationState.order.quantity || 1,
        unit: locationState.order.unit || 'piece',
        price: locationState.order.price || 0,
        total: locationState.order.total || 0,
        phone: locationState.phone || '',
        address: locationState.address || '',
        orderDate: new Date().toISOString(),
        items: locationState.order.items || []
      };

      // Add the order to the context if it doesn't exist
      const existingOrder = getOrder(orderData.id);
      if (!existingOrder) {
        addOrder(orderData);
      }
      
      setOrder(orderData);

      // Simulate order verification after 30 seconds
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            verifyOrder();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIsLoading(false);

      return () => clearInterval(timer);
    } else {
      setIsLoading(false);
    }
  }, [locationState]);

  const verifyOrder = () => {
    setIsVerified(true);
    setOrder((prev) => {
      if (!prev) return null;
      const updatedOrder = {
        ...prev,
        status: 'verified' as const,
      };
      // Update the order in the context
      updateOrderStatus(updatedOrder.id, 'verified');
      return updatedOrder;
    });
    // In a real app, you would update the order status in your backend
  };

  const handlePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (isAdvancePayment = true) => {
    setPaymentSuccess(true);
    setOrder((prev) => {
      if (!prev) return null;
      
      let updatedOrder;
      
      if (isAdvancePayment) {
        // For advance payment (30%)
        const advancePaid = Math.round(prev.total * 0.3);
        updatedOrder = {
          ...prev,
          status: 'paid' as const,
          advancePaid,
          dueAmount: prev.total - advancePaid,
          isAdvancePaid: true
        };
      } else {
        // For due payment (remaining 70%)
        updatedOrder = {
          ...prev,
          status: 'paid' as const,
          dueAmount: 0,
          isDuePaid: true
        };
      }
      
      // Save the updated order to our context
      updateOrderStatus(updatedOrder.id, 'paid');
      
      // Ensure the order is saved before navigating
      const saveOrder = async () => {
        try {
          // Add a small delay to ensure the order is saved to context
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Navigate to TrackOrder-toolbar page with the updated order
          navigate('/track-order', { 
            state: { 
              order: updatedOrder,
              paymentSuccess: true,
              timestamp: Date.now() // Add timestamp to force re-render
            },
            replace: true // Replace current entry in history
          });
        } catch (error) {
          console.error('Error navigating to order tracking:', error);
        }
      };
      
      saveOrder();
      
      return updatedOrder;
    });
    setShowPaymentModal(false);
  };
  
  const handleDuePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const getStatusSteps = () => {
    if (!order) return [];

    const statuses = [
      { id: 'pending', label: 'Order Received', icon: <Clock className="h-5 w-5" /> },
      { id: 'verified', label: 'Order Verified', icon: <CheckCircle2 className="h-5 w-5" /> },
      { id: 'paid', label: 'Payment Received', icon: <CheckCircle2 className="h-5 w-5" /> },
      { id: 'processing', label: 'Processing', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
      { id: 'shipped', label: 'Shipped', icon: <ArrowLeft className="h-5 w-5" /> },
      { id: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="h-5 w-5" /> },
    ];

    const currentStatusIndex = statuses.findIndex((s) => s.id === order.status);

    return statuses.map((status, index) => ({
      ...status,
      completed: index <= currentStatusIndex,
      current: index === currentStatusIndex,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
          <div className="bg-white">
            <div className="p-4 sm:p-6">
              {/* Order Status */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Order #{order.id}</h2>
                <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
                  {order.status === 'pending' && (
                    <>
                      <Clock className="h-4 w-4" />
                      <span>Your order is being processed</span>
                    </>
                  )}
                  {order.status === 'verified' && (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Your order has been verified</span>
                    </>
                  )}
                  {order.status === 'paid' && (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Payment received. Your order is being processed.</span>
                    </>
                  )}
                </div>
              </div>

              {/* Verification Messages */}
              {order.status === 'pending' && (
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Your buy request will be verified by our team by calling you in {timeLeft} seconds on <span className="font-medium">{order.phone}</span>. 
                        Please receive the call and confirm your order. After verification, you will see the payment option here.
                      </p>
                      <p className="mt-2 text-sm text-blue-700">
                        <strong>Note:</strong> You need to pay 30% in advance and the remaining 70% after the order is delivered.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'verified' && (
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Your order has been verified. Please proceed with the payment to confirm your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between">
                            <div className="flex items-start space-x-3">
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
                              <div>
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {item.dealerName || 'Seller'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{item.quantity} {item.unit} × ₹{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product</span>
                        <div className="text-right">
                          <div className="font-medium">
                            {order.productName}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Sold by</span>
                        <span>{order.dealerName || 'Seller'}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600">Quantity</span>
                        <span>{order.quantity} {order.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per unit</span>
                        <span>₹{order.price.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 space-y-2">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order.subtotal?.toLocaleString() || '0'}</span>
                    </div>

                    {/* Delivery Charge */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span>₹{order.deliveryCharge?.toLocaleString() || '0'}</span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span>₹{order.tax?.toLocaleString() || '0'}</span>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t pt-3 mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Total Amount</span>
                        <span>₹{order.total?.toLocaleString() || '0'}</span>
                      </div>
                      
                      {/* Payment Status Sections */}
                      {order.isAdvancePaid && (
                        <>
                          <div className="flex justify-between border-t pt-2">
                            <span>Advance Paid (30%)</span>
                            <span className="text-green-600">- ₹{Math.round((order.total || 0) * 0.3).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Due Amount</span>
                            <span className="text-red-600">₹{Math.round((order.total || 0) * 0.7).toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      
                      {!order.isAdvancePaid && !order.isDuePaid && (
                        <div className="flex justify-between font-semibold">
                          <span>Total Payable</span>
                          <span className="text-green-600">₹{order.total?.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {order.isDuePaid && (
                        <div className="flex justify-between font-semibold text-green-600">
                          <span>Paid in Full</span>
                          <span>₹{order.total?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Delivery Information</h2>
                <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Contact</span>
                    <span>{order.phone}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="text-right">{order.address}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600">Order Date</span>
                <span>{new Date(order.orderDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
              {order.estimatedDelivery && (
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</span>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="p-6 border-t">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {getStatusSteps().map((step, index) => (
                    <div key={step.id} className="relative flex items-start">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : step.current ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className={`text-sm font-medium ${
                          step.completed ? 'text-green-600' : step.current ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </h3>
                        {step.current && (
                          <p className="text-sm text-gray-500 mt-1">
                            {step.id === 'pending' && 'We have received your order and it\'s being processed.'}
                            {step.id === 'verified' && 'Your order has been verified and is ready for payment.'}
                            {step.id === 'paid' && 'Payment received. Your order is being processed.'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {showPaymentModal && order && (
              <PaymentGatewayModal
                onClose={() => setShowPaymentModal(false)}
                amount={order.isAdvancePaid ? Math.round((order.total || 0) * 0.7) : Math.round((order.total || 0) * 0.3)}
                onSuccess={() => handlePaymentSuccess(!order.isAdvancePaid)}
              />
            )}

            {/* Verification messages moved above Order Summary */}

            {/* Fixed Payment Button at Bottom */}
            {/* Payment Button - Shows different states based on payment status */}
            {(order.status === 'verified' || order.isAdvancePaid) && (
              <div className="fixed bottom-16 left-0 right-0 bg-white border-t py-3 px-4 shadow-lg">
                <div className="max-w-5xl mx-auto">
                  {!order.isAdvancePaid ? (
                    // Initial payment button (30% advance)
                    <>
                      <Button 
                        onClick={handlePaymentClick}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                        disabled={isPaying}
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay 30% Advance (₹${Math.round((order.total || 0) * 0.3).toLocaleString()})`
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Pay 30% now and the remaining amount at delivery
                      </p>
                    </>
                  ) : !order.isDuePaid ? (
                    // Due payment button (remaining 70%)
                    <>
                      <Button
                        className="w-full py-6 text-lg font-medium bg-green-600 hover:bg-green-700"
                        disabled={isPaying}
                        onClick={handleDuePaymentClick}
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay Remaining ₹${Math.round((order.total || 0) * 0.7).toLocaleString()}`
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Pay the remaining amount to complete your order
                      </p>
                    </>
                  ) : (
                    // Payment complete
                    <div className="text-center py-2">
                      <div className="inline-flex items-center gap-2 text-green-600 font-medium">
                        <CheckCircle2 className="h-5 w-5" />
                        Payment Completed
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paymentSuccess && (
              <div className="p-6 border-t">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Payment successful! Your order has been confirmed and is being processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default TrackOrder;
