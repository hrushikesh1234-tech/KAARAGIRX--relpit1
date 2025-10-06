'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOrder, type ExtendedOrder } from '@/contexts/OrderContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

// Import Lucide icons using require
import { ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle, CheckCircle2 } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus } = useOrder();
  
  // Try to get order from location state first, then from context
  const [order, setOrder] = useState<ExtendedOrder | null>(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!location.state?.order);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = useCallback(async (isAdvancePayment = false) => {
    if (!order) return;
    
    setPaymentSuccess(true);
    setIsProcessing(false);
    
    const updatedOrder: ExtendedOrder = {
      ...order,
      status: 'paid' as const,
      paymentStatus: 'paid' as const,
      isDuePaid: true,
      dueAmount: 0,
      updatedAt: new Date().toISOString()
    };
    
    updateOrderStatus(order.id, 'paid', updatedOrder);
    setOrder(updatedOrder);
    
    // Close the payment modal after a delay
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }, 2000);
  }, [order, updateOrderStatus]);
  
  // If order not in state, try to fetch it from context
  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && id) {
        try {
          if (typeof id === 'string') {
            const orderFromContext = getOrder(id);
            if (orderFromContext) {
              setOrder(orderFromContext);
            } else {
              console.warn(`No order found with id: ${id}`);
            }
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!id) {
        console.warn('No order ID provided');
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, order, getOrder]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium">Order not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/track-order')}
        >
          Back to Orders
        </Button>
      </div>
    );
  }
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> };
      case 'processing':
        return { text: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <Package className="h-3 w-3" /> };
      case 'shipped':
        return { text: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-3 w-3" /> };
      case 'delivered':
        return { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> };
      case 'cancelled':
        return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: <Package className="h-3 w-3" /> };
    }
  };
  
  const statusInfo = getStatusInfo(order.status);
  const orderDate = order.orderDate || order.createdAt || new Date().toISOString();
  const itemImage = order.items?.[0]?.image || '/placeholder-product.jpg';
  const hasBalance = order.isAdvancePaid && !order.isDuePaid && order.dueAmount && order.dueAmount > 0;
  
  // Tracking steps with status and icons
  const trackingSteps = [
    { 
      id: 'pending', 
      label: 'Order Placed', 
      icon: <Package className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    { 
      id: 'processing', 
      label: 'Processing', 
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    { 
      id: 'shipped', 
      label: 'Shipped', 
      icon: <Truck className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    { 
      id: 'out_for_delivery', 
      label: 'Out for Delivery', 
      icon: <Truck className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-green-500'
    },
  ];

  // Get current step index
  const getCurrentStepIndex = () => {
    const statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    return statusOrder.indexOf(order.status) >= 0 ? statusOrder.indexOf(order.status) : 0;
  };
  
  const currentStepIndex = getCurrentStepIndex();
  
  return (
    <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order.id}</CardTitle>
              <CardDescription className="mt-1">
                Placed on {format(new Date(orderDate), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.text}</span>
            </Badge>
          </div>
          
          <div className="mt-8">
            <div className="relative">
              {/* Zigzag line */}
              <div className="absolute left-4 right-4 top-1/2 h-1 bg-gray-200 -translate-y-1/2"></div>
              
              <div className="relative flex justify-between">
                {trackingSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const stepWidth = 100 / (trackingSteps.length - 1);
                  
                  return (
                    <div 
                      key={step.id}
                      className="flex flex-col items-center relative z-10"
                      style={{
                        width: `${stepWidth}%`,
                        left: `${index === 0 ? '0' : index === trackingSteps.length - 1 ? 'auto' : ''}`,
                        right: `${index === trackingSteps.length - 1 ? '0' : ''}`
                      }}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted ? step.color : 'bg-gray-200'
                        } text-white`}
                      >
                        {step.icon}
                      </div>
                      <div className={`text-xs text-center ${
                        isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </div>
                      {isCurrent && (
                        <div className="absolute -bottom-6 text-xs font-medium text-primary">
                          {step.id === 'out_for_delivery' ? 'On the way to you' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Order Summary */}
            <div>
              <h3 className="font-medium mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border">
                    <img 
                      src={itemImage} 
                      alt={order.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{order.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.quantity} {order.unit || 'unit'}{order.quantity !== 1 ? 's' : ''}
                    </p>
                    <p className="font-medium mt-1">₹{order.total?.toFixed(0)}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal?.toFixed(0) || order.total?.toFixed(0)}</span>
                  </div>
                  {order.deliveryCharge && (
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>₹{order.deliveryCharge.toFixed(0)}</span>
                    </div>
                  )}
                  {order.tax && (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{order.tax.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{order.total?.toFixed(0)}</span>
                  </div>
                  
                  {order.isAdvancePaid && (
                    <div className="pt-2">
                      <div className="flex justify-between">
                        <span>Advance Paid</span>
                        <span className="text-green-600">-₹{order.advancePaid?.toFixed(0)}</span>
                      </div>
                      {hasBalance && (
                        <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                          <span>Balance Due</span>
                          <span>₹{order.dueAmount?.toFixed(0)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div>
              <h3 className="font-medium mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Address</p>
                  <p className="font-medium">{order.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{order.phone}</p>
                  {order.contactEmail && <p className="text-sm">{order.contactEmail}</p>}
                </div>
                
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-mono">{order.trackingNumber}</p>
                    {order.carrier && <p className="text-sm">Carrier: {order.carrier}</p>}
                  </div>
                )}
                
                {hasBalance && (
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPaymentModal(true);
                      }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay Balance (₹${order.dueAmount?.toFixed(0)})`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && order && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pay Balance</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paymentSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600">
                    Your payment of ₹{order.dueAmount?.toFixed(0) || '0'} has been processed.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4">
                      <span className="font-medium">Amount to Pay:</span>
                      <span className="text-lg font-bold">
                        ₹{order.dueAmount?.toFixed(0) || '0'}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Order Total</span>
                        <span className="font-medium">
                          ₹{order.total?.toFixed(0) || '0'}
                        </span>
                      </div>
                      
                      {order.advancePaid ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-green-700">Advance Paid</span>
                          <span className="font-medium text-green-700">
                            -₹{order.advancePaid?.toFixed(0) || '0'}
                          </span>
                        </div>
                      ) : null}
                      
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm font-medium">Balance Due</span>
                          <span className="font-bold text-lg">
                            ₹{order.dueAmount?.toFixed(0) || '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={async () => {
                      if (!order) return;
                      
                      setIsProcessing(true);
                      
                      try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        // Update order status
                        const newStatus = order.status === 'out_for_delivery' ? 'delivered' : order.status;
                        await handlePaymentSuccess();
                        
                      } catch (error) {
                        console.error('Payment failed:', error);
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${order.dueAmount?.toFixed(0) || '0'}`}
                  </Button>
                  
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    This is a demo payment. No real transactions will be processed.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
