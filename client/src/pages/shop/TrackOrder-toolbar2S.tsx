import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiClock, 
  FiCheckCircle, 
  FiX, 
  FiPackage, 
  FiTruck, 
  FiLoader, 
  FiCheck, 
  FiAlertCircle, 
  FiSearch,
  FiArrowLeft,
  FiArrowRight,
  FiDollarSign,
  FiCreditCard
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder, type Order, type OrderStatus, type OrderItem, type ExtendedOrder, type PaymentStatus } from "@/contexts/OrderContext";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Package, Package as PackageIcon, CheckCircle, Clock, X as XIcon, XCircle, Truck, Loader2, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

type TabType = 'current' | 'history';
type PaymentType = 'advance' | 'full';

interface StatusInfo {
  text: string;
  color: string;
  icon: React.ReactNode;
  progress: number;
}

// Helper function to format order date
const formatOrderDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to get status information
const getStatusInfo = (status: OrderStatus): StatusInfo => {
  switch (status) {
    case 'pending':
      return {
        text: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-4 w-4" />,
        progress: 25,
      };
    case 'processing':
      return {
        text: 'Processing',
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="h-4 w-4" />,
        progress: 50,
      };
    case 'shipped':
      return {
        text: 'Shipped',
        color: 'bg-indigo-100 text-indigo-800',
        icon: <Truck className="h-4 w-4" />,
        progress: 75,
      };
    case 'delivered':
      return {
        text: 'Delivered',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-4 w-4" />,
        progress: 100,
      };
    case 'cancelled':
      return {
        text: 'Cancelled',
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-4 w-4" />,
        progress: 0,
      };
    case 'verified':
    case 'paid':
    default:
      return {
        text: status.charAt(0).toUpperCase() + status.slice(1),
        color: 'bg-gray-100 text-gray-800',
        icon: <Clock className="h-4 w-4" />,
        progress: 0,
      };
  }
};

// Order Details Component
interface OrderDetailsProps {
  order: ExtendedOrder;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const statusInfo = getStatusInfo(order.status);
  const orderTotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const hasBalance = orderTotal > 0 && order.paymentStatus !== 'paid';
  const productName = order.items?.[0]?.name || 'Product';
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
        <span className="text-sm font-medium">{statusInfo.text}</span>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">{productName}</h3>
        <div className="mt-1 text-sm text-gray-500">
          Order #{order.id} • {formatOrderDate(order.orderDate)}
        </div>
        
        {order.shippingAddress && (
          <div className="mt-2 text-sm">
            <div className="text-gray-500">Delivery to:</div>
            <div>{order.shippingAddress}</div>
          </div>
        )}
        
        {hasBalance && (
          <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 text-sm rounded">
            <FiAlertCircle className="inline mr-1" />
            Balance of ₹{orderTotal.toFixed(2)} pending
          </div>
        )}
      </div>
    </div>
  );
};

// Main TrackOrderToolbar Component
interface TrackOrderToolbarProps {}

type TimerInfo = {
  startTime: number;
  elapsed: number;
};

const TrackOrderToolbar: React.FC<TrackOrderToolbarProps> = (): JSX.Element => {
  // Router hooks and context
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders = [], addOrder, updateOrderStatus, getOrder } = useOrder();
  
  // State management - consolidated to avoid duplicates
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [localOrders, setLocalOrders] = useState<ExtendedOrder[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderTimers, setOrderTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const timerRefs = useRef<Record<string, number>>({});
  
  // Payment related state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<ExtendedOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  
  // Constants
  const TOTAL_TIMER_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds
  const STATUS_UPDATE_INTERVAL = 30 * 1000; // 30 seconds

  // Handle incoming order from navigation state (e.g., after payment)
  useEffect(() => {
    if (location.state?.order) {
      const incomingOrder = location.state.order as ExtendedOrder;
      
      // Always update the order in context to ensure we have the latest data
      const existingOrder = getOrder(incomingOrder.id);
      if (existingOrder) {
        // Merge the existing order with the incoming updates
        const updatedOrder: ExtendedOrder = { 
          ...existingOrder, 
          ...incomingOrder,
          paymentStatus: incomingOrder.paymentStatus || 'pending'
        };
        // Only update the status and payment status which are part of the base Order type
        updateOrderStatus(incomingOrder.id, updatedOrder.status, {
          paymentStatus: updatedOrder.paymentStatus
        });
        
        // Update the extended fields in the local state
        setSelectedOrder(updatedOrder);
      } else {
        // Add the order to context if it doesn't exist
        const newOrder: ExtendedOrder = {
          ...incomingOrder,
          paymentStatus: incomingOrder.paymentStatus || 'pending',
          orderNumber: incomingOrder.orderNumber || `ORD-${Date.now()}`,
          shippingAddress: incomingOrder.shippingAddress || '',
          trackingNumber: incomingOrder.trackingNumber || '',
          carrier: incomingOrder.carrier || ''
        };
        addOrder(newOrder);
        setSelectedOrder(newOrder);
      }
      
      // Show success message if redirected after payment
      if (location.state.paymentSuccess) {
        setShowSuccess(true);
        // Hide success message after 5 seconds
        const timer = setTimeout(() => setShowSuccess(false), 5000);
        return () => clearTimeout(timer);
      }
    }
    setIsInitialized(true);
  }, [location.state, addOrder, updateOrderStatus, getOrder]);

  // Set the selected order when orders change and we have a selected order
  useEffect(() => {
    if (selectedOrder && isInitialized) {
      const updatedOrder = getOrder(selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder as ExtendedOrder);
      }
    }
  }, [orders, selectedOrder, isInitialized, getOrder]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      Object.values(orderTimers).forEach(timer => clearTimeout(timer));
    };
  }, [orderTimers]);

  // Start timer when order is fully paid
  const startOrderTimer = useCallback((orderId: string) => {
    // Clear existing timer if any
    if (orderTimers[orderId]) {
      clearTimeout(orderTimers[orderId]);
    }

    // Set new timer
    const timer = setTimeout(() => {
      // Move to history by updating the order status
      const order = orders.find(o => o.id === orderId);
      if (order) {
        updateOrderStatus(orderId, 'delivered');
      }
      
      // Clean up timer
      setOrderTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[orderId];
        return newTimers;
      });
    }, 60000); // 60 seconds

    setOrderTimers(prev => ({
      ...prev,
      [orderId]: timer
    }));
  }, [orders, updateOrderStatus, orderTimers]);

  // Filter and sort orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    // First, ensure we have a unique list of orders by ID with the most recent version of each order
    const uniqueOrders = Array.from(
      new Map(orders.map(order => [order.id, order]))
        .values()
    ) as ExtendedOrder[];
    
    const result = uniqueOrders.filter((order) => {
      if (!order) return false;
      
      // For current tab: show orders that are in progress OR have an advance payment but not fully paid
      let showInTab = false;
      
      if (activeTab === 'current') {
        // Show in current if:
        // 1. Order is in progress status and not fully paid, OR
        // 2. Has advance payment but not fully paid, OR
        // 3. Has a balance due
        showInTab = (
          (['pending', 'processing', 'shipped', 'paid', 'out_for_delivery'].includes(order.status) && 
           !order.isDuePaid) ||
          (order.isAdvancePaid && !order.isDuePaid) ||
          (order.dueAmount && order.dueAmount > 0) ||
          (order.status === 'paid' && !order.isDuePaid)
        );
      } else if (activeTab === 'history') {
        // Show in history if order is delivered, cancelled, or fully paid
        showInTab = ['delivered', 'cancelled'].includes(order.status) || 
                   (order.isAdvancePaid && order.isDuePaid && order.status !== 'pending');
      }
      
      // Apply search filter if search query exists
      if (searchQuery && searchQuery.trim() !== '') {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          (order.orderNumber?.toLowerCase() || '').includes(searchLower) ||
          (order.productName?.toLowerCase() || '').includes(searchLower) ||
          (order.id?.toLowerCase() || '').includes(searchLower);
        return showInTab && matchesSearch;
      }
      
      return showInTab;
    }).sort((a, b) => {
      const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
      const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
      return dateB - dateA; // Newest first
    });
    
    return result;
  }, [orders, activeTab, searchQuery]);

  // Handle page refresh after payment redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromPayment = params.get('fromPayment');
    
    if (fromPayment === 'true') {
      // Clean up the URL
      params.delete('fromPayment');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      
      // Force a refresh to get latest data
      window.location.reload();
    }
  }, [window.location.search, navigate]);
  
  // Handle incoming order from navigation state (e.g., after payment)
  useEffect(() => {
    if (location.state?.order) {
      const incomingOrder = location.state.order as ExtendedOrder;
      
      // Always update the order in context to ensure we have the latest data
      const existingOrder = getOrder(incomingOrder.id);
      if (existingOrder) {
        // Merge the existing order with the incoming updates
        const updatedOrder: ExtendedOrder = { 
          ...existingOrder, 
          ...incomingOrder,
          paymentStatus: incomingOrder.paymentStatus || 'pending'
        };
        // Only update the status and payment status which are part of the base Order type
        updateOrderStatus(incomingOrder.id, updatedOrder.status, {
          paymentStatus: updatedOrder.paymentStatus
        });
        
        // Update the extended fields in the local state
        setSelectedOrder(updatedOrder);
      } else {
        // Add the order to context if it doesn't exist
        const newOrder: ExtendedOrder = {
          ...incomingOrder,
          paymentStatus: incomingOrder.paymentStatus || 'pending',
          orderNumber: incomingOrder.orderNumber || `ORD-${Date.now()}`,
          shippingAddress: incomingOrder.shippingAddress || '',
          trackingNumber: incomingOrder.trackingNumber || '',
          carrier: incomingOrder.carrier || ''
        };
        addOrder(newOrder);
        setSelectedOrder(newOrder);
      }
      
      // Show success message if redirected after payment
      if (location.state.paymentSuccess) {
        setShowSuccess(true);
        // Hide success message after 5 seconds
        const timer = setTimeout(() => setShowSuccess(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [location.state, getOrder, updateOrderStatus, setSelectedOrder, addOrder]);

  // Auto-select the first order when filtered orders change
  useEffect(() => {
    if (filteredOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(filteredOrders[0]);
    } else if (filteredOrders.length === 0) {
      setSelectedOrder(null);
    }
  }, [filteredOrders, selectedOrder]);

  // Handle pay balance click
  const handlePayBalance = useCallback((e: React.MouseEvent, order: ExtendedOrder) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!order.dueAmount || order.dueAmount <= 0) {
      console.warn('No due amount to pay');
      return;
    }
    
    setCurrentOrder(order);
    setShowPaymentModal(true);
  }, []);
  
  // Handle payment success
  const handlePaymentSuccess = useCallback(() => {
    if (!currentOrder) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the order to mark due as paid
      const updates: Partial<ExtendedOrder> = {
        isDuePaid: true,
        dueAmount: 0,
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date().toISOString()
      };
      
      // Update the order in context
      updateOrderStatus(currentOrder.id, updates.status || 'processing', updates);
      
      // Close the modal and reset state
      setShowPaymentModal(false);
      setCurrentOrder(null);
      setIsProcessing(false);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
      // Refresh the orders list
      window.location.reload();
    }, 2000);
  }, [currentOrder, updateOrderStatus]);

  // Handle order click - navigates to order details
  const handleOrderClick = useCallback((order: ExtendedOrder) => {
    setSelectedOrder(order);
    navigate(`/order/${order.id}`, { 
      state: { 
        order,
        _timestamp: Date.now()
      } 
    });
  }, [navigate]);

  // Handle payment
  const handlePayment = useCallback(async (order: ExtendedOrder, paymentType: 'advance' | 'full') => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const isFullPayment = paymentType === 'full';
      const paymentAmount = isFullPayment 
        ? (order.dueAmount || 0) 
        : Math.ceil((order.total || 0) * 0.3); // 30% advance

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare order updates
      const updates: Partial<ExtendedOrder> = {
        isAdvancePaid: true,
        advancePaid: paymentAmount,
        dueAmount: isFullPayment ? 0 : (order.total || 0) - paymentAmount,
        isDuePaid: isFullPayment,
        paymentStatus: isFullPayment ? 'paid' : 'partially_paid',
        status: isFullPayment ? 'processing' : 'pending',
        updatedAt: new Date().toISOString()
      };
      
      // Update the order in context
      updateOrderStatus(order.id, updates.status || 'pending', updates);
      
      // Get the updated order to ensure we have the latest data
      const updatedOrder = {
        ...order,
        ...updates
      };
      
      // If this was a full payment, start the delivery process
      if (isFullPayment) {
        startOrderTimer(order.id);
      }
      
      setPaymentSuccess(true);
      setShowSuccess(true);
      
      // Close payment modal
      setShowPaymentModal(false);
      
      // Navigate to track orders with a timestamp to prevent caching
      navigate(`/track-orders?fromPayment=true&t=${Date.now()}`, {
        replace: true,
        state: { refresh: true }
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error state
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, updateOrderStatus, startOrderTimer, navigate]);

  // Helper function to convert Order to ExtendedOrder with proper defaults
  const toExtendedOrder = useCallback((order: Order): ExtendedOrder => {
    return {
      ...order,
      // Ensure all required ExtendedOrder fields have defaults
      orderNumber: order.orderNumber || `ORD-${order.id || Date.now()}`,
      paymentStatus: order.paymentStatus || 'pending',
      shippingAddress: order.shippingAddress || '',
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || '',
      dueAmount: order.dueAmount || 0,
      isAdvancePaid: order.isAdvancePaid || false,
      isDuePaid: order.isDuePaid || false,
      advancePaid: order.advancePaid || 0,
      // Ensure items is always an array
      items: order.items || []
    };
  }, []);

  // Handle payment redirect and refresh data
  useEffect(() => {
    let isMounted = true;
    
    const processPaymentRedirect = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const fromPayment = params.get('fromPayment');
        const orderId = params.get('orderId');
        
        if (fromPayment === 'true' && orderId) {
          // Clean up the URL without causing a reload
          const newParams = new URLSearchParams(params);
          newParams.delete('fromPayment');
          const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
          window.history.replaceState({ ...window.history.state, refresh: true }, '', newUrl);
          
          // Add a small delay to ensure the URL is updated before proceeding
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Fetch the latest order data
          if (getOrder) {
            const order = getOrder(orderId);
            if (order && isMounted) {
              const extendedOrder = toExtendedOrder(order);
              
              // Update local orders state
              setLocalOrders(prevOrders => {
                const existingIndex = prevOrders.findIndex(o => o.id === orderId);
                if (existingIndex >= 0) {
                  const updatedOrders = [...prevOrders];
                  updatedOrders[existingIndex] = extendedOrder;
                  return updatedOrders;
                }
                return [...prevOrders, extendedOrder];
              });
              
              // Update selected order
              setSelectedOrder(extendedOrder);
              
              // Show success message
              setShowSuccess(true);
              setTimeout(() => {
                if (isMounted) setShowSuccess(false);
              }, 5000);
            }
          }
        }
      } catch (error) {
        console.error('Error processing payment redirect:', error);
      }
    };
    
    processPaymentRedirect();
    
    return () => {
      isMounted = false;
    };
  }, [navigate, getOrder, toExtendedOrder]);

  // Track if we've processed the current order to prevent duplicate processing
  const processedOrderIdRef = useRef<string | null>(null);

  // Handle incoming order from navigation state (e.g., after payment)
  useEffect(() => {
    let isMounted = true;
    let cleanupTimer: ReturnType<typeof setTimeout> | null = null;
    
    const handleIncomingOrder = async () => {
      if (!location.state?.order) return;
      
      const incomingOrder = location.state.order as ExtendedOrder;
      
      // Skip if we've already processed this order
      if (processedOrderIdRef.current === incomingOrder.id) {
        console.log('Skipping already processed order:', incomingOrder.id);
        return;
      }
      
      console.log('Processing incoming order:', incomingOrder.id);
      processedOrderIdRef.current = incomingOrder.id;
      
      try {
        // Get existing order if it exists
        const existingOrder = await getOrder(incomingOrder.id);
        
        // Create updated order with all necessary fields
        const now = new Date().toISOString();
        const defaultQuantity = incomingOrder.quantity || 1;
        const defaultPrice = incomingOrder.price || 0;
        const defaultUnit = incomingOrder.unit || 'unit';
        const defaultProductName = incomingOrder.productName || 'Product';
        
        // Create a minimal update object with only the fields we want to update
        const updateData: Partial<ExtendedOrder> = {
          status: incomingOrder.status || 'processing',
          paymentStatus: (incomingOrder.paymentStatus || (incomingOrder.isDuePaid ? 'paid' : 'pending')) as PaymentStatus,
          dueAmount: incomingOrder.dueAmount || 0,
          advancePaid: incomingOrder.advancePaid || 0,
          isAdvancePaid: incomingOrder.isAdvancePaid ?? false,
          isDuePaid: incomingOrder.isDuePaid ?? false,
          updatedAt: now
        };
        
        if (!isMounted) return;
        
        if (existingOrder) {
          // Only update if there are actual changes
          const relevantFields: (keyof typeof updateData)[] = [
            'status', 'paymentStatus', 'dueAmount', 'advancePaid', 
            'isAdvancePaid', 'isDuePaid'
          ];
          
          const hasChanges = relevantFields.some(field => {
            const existingValue = existingOrder[field as keyof Order];
            const newValue = updateData[field];
            return JSON.stringify(existingValue) !== JSON.stringify(newValue);
          });
          
          if (hasChanges) {
            console.log('Updating order with changes:', { orderId: incomingOrder.id, updateData });
            await updateOrderStatus(incomingOrder.id, updateData.status || 'processing', updateData);
          } else {
            console.log('No changes needed for order:', incomingOrder.id);
          }
        } else {
          // Create a complete new order
          const newOrder: Omit<ExtendedOrder, 'id'> & { id: string } = {
            id: incomingOrder.id || `order-${Date.now()}`,
            productName: defaultProductName,
            quantity: defaultQuantity,
            unit: defaultUnit,
            price: defaultPrice,
            total: incomingOrder.total || (defaultPrice * defaultQuantity),
            status: 'processing',
            phone: incomingOrder.phone || '',
            address: incomingOrder.address || '',
            orderDate: incomingOrder.orderDate || now,
            orderNumber: `ORD-${Date.now()}`,
            paymentStatus: 'pending',
            shippingAddress: '',
            trackingNumber: '',
            carrier: '',
            dueAmount: incomingOrder.dueAmount || 0,
            isAdvancePaid: incomingOrder.isAdvancePaid ?? false,
            isDuePaid: incomingOrder.isDuePaid ?? false,
            advancePaid: incomingOrder.advancePaid || 0,
            items: incomingOrder.items?.length ? incomingOrder.items : [{
              id: `item-${Date.now()}`,
              name: defaultProductName,
              price: defaultPrice,
              quantity: defaultQuantity,
              unit: defaultUnit,
              image: ''
            }] as OrderItem[],
            createdAt: now,
            updatedAt: now
          };
          
          console.log('Adding new order:', newOrder.id);
          await addOrder(newOrder);
          setSelectedOrder(newOrder);
        }
        
        // Show success message if redirected after payment
        if ('paymentSuccess' in location.state && location.state.paymentSuccess) {
          console.log('Showing payment success message');
          setShowSuccess(true);
          // Clear the state to prevent duplicate processing
          window.history.replaceState({}, document.title);
          // Hide success message after 5 seconds
          cleanupTimer = setTimeout(() => {
            if (isMounted) setShowSuccess(false);
          }, 5000);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error processing order:', errorMessage);
      }
    };

    // Only process if we have an order in the state
    if (location.state?.order) {
      console.log('Triggering handleIncomingOrder');
      handleIncomingOrder().catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in handleIncomingOrder:', errorMessage);
      });
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (cleanupTimer) {
        clearTimeout(cleanupTimer);
      }
    };
  }, [location.state?.order?.id]); // Only depend on the order ID to prevent unnecessary runs

  const renderPaymentModal = useCallback(() => {
    if (!currentOrder) return null;
    // ... (rest of the code remains the same)
    
    // Create a new object with all required fields
    const orderWithDefaults: ExtendedOrder = {
      // Required base Order fields (from Order interface)
      ...currentOrder,
      
      // Required ExtendedOrder fields (overriding any from currentOrder)
      orderNumber: currentOrder.orderNumber || `ORD-${currentOrder.id || Date.now()}`,
      paymentStatus: (currentOrder.paymentStatus as PaymentStatus) || 'pending',
      
      // Ensure required fields have defaults
      dueAmount: currentOrder.dueAmount ?? 0,
      isAdvancePaid: currentOrder.isAdvancePaid ?? false,
      isDuePaid: currentOrder.isDuePaid ?? false,
      advancePaid: currentOrder.advancePaid ?? 0,
      items: Array.isArray(currentOrder.items) ? currentOrder.items : [],
      
      // Optional fields with defaults
      shippingAddress: currentOrder.shippingAddress ?? '',
      trackingNumber: currentOrder.trackingNumber ?? '',
      carrier: currentOrder.carrier ?? ''
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Complete Payment</h3>
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <p>Order: {orderWithDefaults.orderNumber}</p>
            <p>Amount: ₹{orderWithDefaults.dueAmount?.toFixed(2) || '0.00'}</p>
            <Button 
              className="w-full" 
              onClick={() => handlePayment(orderWithDefaults, 'full')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </div>
      </div>
    );
  }, [currentOrder, isProcessing, handlePayment]);

  const renderOrderItem = useCallback((order: ExtendedOrder) => {
    try {
      const orderDate = order.orderDate || order.createdAt || new Date().toISOString();
      const orderTotal = order.total || order.price * (order.quantity || 1);
      const productName = order.productName || 'Custom Order';
      const itemImage = order.items?.[0]?.image || '/placeholder-product.jpg';
      const hasBalance = order.isAdvancePaid && !order.isDuePaid && order.dueAmount && order.dueAmount > 0;
      const statusInfo = getStatusInfo(order.status);
      const paidPercentage = order.isAdvancePaid 
        ? order.isDuePaid 
          ? 100 
          : Math.round(((order.advancePaid || 0) / orderTotal) * 100)
        : 0;

      return (
        <div
          key={order.id}
          className={`group relative mb-4 mx-2 sm:mx-0 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            selectedOrder?.id === order.id 
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => handleOrderClick(order)}
        >
          {/* Status indicator dot - Top left */}
          <div 
            className={`absolute top-3 left-3 w-2 h-2 rounded-full ${
              order.status === 'delivered' ? 'bg-green-500' : 
              order.status === 'shipped' ? 'bg-blue-500' : 
              order.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-400'
            }`}
          />
          
          {/* Payment status badge - Top right */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline" 
              className={`${hasBalance ? 'bg-amber-100 text-amber-800 border-amber-200' : statusInfo.color} border-opacity-50`}
            >
              {hasBalance ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Payment Pending</span>
                </>
              ) : (
                <>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.text}</span>
                </>
              )}
            </Badge>
          </div>
          
          {/* Product Image - Large size, slightly moved down */}
          <div className="absolute top-10 right-3 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border bg-muted/50">
            <img 
              src={itemImage} 
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.jpg';
              }}
            />
          </div>
          
          <div className="pr-14">
            <div className="flex flex-col">
              <div className="min-w-0">
                <h3 className="font-medium text-foreground text-base">Order #{order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatOrderDate(orderDate)}
                </p>
              </div>
              
              <div className="mt-2">
                <p className="font-medium text-foreground truncate">{productName}</p>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p>
                    {order.quantity} {order.unit || 'unit'}{order.quantity !== 1 ? 's' : ''}
                    {order.price && (
                      <span className="ml-2 text-foreground">
                        (₹{Math.round(order.price)} × {order.quantity})
                      </span>
                    )}
                  </p>
                  {hasBalance && order.dueAmount && activeTab === 'current' && (
                    <p className="text-orange-500 font-medium">
                      Balance Due: ₹{Math.round(order.dueAmount)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-border/50">
                {/* Payment Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Payment Progress</span>
                    <span className="font-medium">
                      {order.isDuePaid ? '100%' : '30%'} Paid
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        order.isDuePaid ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{
                        width: order.isDuePaid ? '100%' : '30%',
                        transition: 'width 0.3s ease-in-out'
                      }}
                    />
                  </div>
                </div>

                {/* Payment Breakdown - Always show total amount */}
                <div className="mt-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">₹{Math.round(orderTotal)}</span>
                  </div>
                  
                  {/* Show advance paid if any payment has been made */}
                  {order.isAdvancePaid && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {order.isDuePaid ? 'Total Paid' : 'Advance Paid (30%)'}:
                      </span>
                      <span className={order.isDuePaid ? 'text-green-500 font-medium' : 'text-blue-500 font-medium'}>
                        ₹{Math.round(order.isDuePaid ? orderTotal : (orderTotal * 0.3))}
                      </span>
                    </div>
                  )}
                  
                  {/* Show balance due if there is any */}
                  {!order.isDuePaid && order.dueAmount && order.dueAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance Due (70%):</span>
                      <span className="text-orange-500 font-medium">
                        ₹{Math.round(order.dueAmount)}
                      </span>
                    </div>
                  )}
                  
                  {/* Show fully paid message if applicable */}
                  {order.isDuePaid && (
                    <div className="flex justify-between text-green-500 font-medium pt-1 border-t border-border/50 mt-2">
                      <span>Payment Status:</span>
                      <span>Fully Paid</span>
                    </div>
                  )}
                </div>
                
                {/* Pay Button */}
                {hasBalance && activeTab === 'current' ? (
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-3 text-sm sm:text-inherit"
                    onClick={(e) => handlePayBalance(e, order)}
                  >
                    Pay Due Amount (₹{Math.round(order.dueAmount)})
                  </Button>
                ) : (
                  <div className="text-center text-sm text-green-600 py-2 mt-1">
                    {order.isAdvancePaid && order.isDuePaid ? 'Fully Paid' : 'Payment Received'}
                  </div>
                )}
                </div>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-md bg-primary/0 group-hover:bg-primary/5 transition-colors" />
          </div>
        );
      } catch (error) {
      console.error('Error rendering order item:', error);
      return null;
    }
  }, [activeTab, handlePayBalance, handleOrderClick]);

  // Render the main component
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl relative">
      {showPaymentModal && currentOrder && renderPaymentModal()}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        <div className="w-full md:w-64">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <Tabs defaultValue="current" onValueChange={(value) => setActiveTab(value as TabType)} className="mb-6">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="mt-6">
            {showSuccess && (
              <div className="mb-3 p-2 text-sm bg-green-100 text-green-700 rounded-md">
                Payment successful! Your order has been updated.
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {Array.from(new Set(filteredOrders.map(order => order.id)))
                .map(orderId => {
                  const order = filteredOrders.find(o => o.id === orderId);
                  return order ? renderOrderItem(order) : null;
                })
                .filter(Boolean) // Remove any null entries
              }
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg">No {activeTab === 'current' ? 'current' : 'past'} orders found</p>
              <p className="text-sm mt-1">
                {activeTab === 'current' 
                  ? 'Your current orders will appear here' 
                  : 'Your order history will appear here'}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  </div>
);
}
export default TrackOrderToolbar;
