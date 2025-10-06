import { createContext, useContext, useState, ReactNode } from 'react';

export type OrderStatus = 'pending' | 'verified' | 'paid' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'partially_paid' | 'paid';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  dealerName?: string;
  dealerId?: string;
}

// Base Order interface with common fields
export interface Order {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  status: OrderStatus;
  phone: string;
  address: string;
  orderDate: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  // Payment related fields
  paymentStatus?: PaymentStatus;
  dueAmount?: number;
  isAdvancePaid?: boolean;
  isDuePaid?: boolean;
  advancePaid?: number;
  // Optional fields with defaults in ExtendedOrder
  orderNumber?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  carrier?: string;
  // Additional fields for order details
  dealerName?: string;
  subtotal?: number;
  deliveryCharge?: number;
  tax?: number;
  estimatedDelivery?: string;
}

// ExtendedOrder includes all fields from Order plus additional ones
export interface ExtendedOrder extends Order {
  orderNumber: string;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  trackingNumber: string;
  carrier: string;
  advancePaid: number;
  isAdvancePaid: boolean;
  isDuePaid: boolean;
  dueAmount: number;
  contactEmail?: string;
  contactPhone?: string;
  estimatedDelivery?: string;
  deliveryCharge?: number;
  tax?: number;
  subtotal?: number;
  dealerName?: string;
  dealerPhone?: string;
}

interface OrderContextType {
  orders: ExtendedOrder[];
  addOrder: (order: Partial<ExtendedOrder>) => ExtendedOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, updates?: Partial<ExtendedOrder>) => void;
  getOrder: (orderId: string) => ExtendedOrder | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);

  const addOrder = (order: Partial<ExtendedOrder>): ExtendedOrder => {
    const now = new Date().toISOString();
    const defaultOrder: Partial<ExtendedOrder> = {
      id: Date.now().toString(),
      status: 'pending',
      orderDate: now,
      orderNumber: `ORD-${Date.now()}`,
      advancePaid: 0,
      dueAmount: 0,
      isAdvancePaid: false,
      isDuePaid: false,
      paymentStatus: 'pending',
      items: [],
      createdAt: now,
      updatedAt: now,
      phone: '',
      address: '',
      productName: '',
      quantity: 1,
      unit: 'unit',
      price: 0,
      total: 0,
      shippingAddress: '',
      trackingNumber: '',
      carrier: ''
    };

    const newOrder: ExtendedOrder = {
      ...defaultOrder,
      ...order,
      // Ensure required fields are set
      id: order.id || defaultOrder.id!,
      orderNumber: order.orderNumber || defaultOrder.orderNumber!,
      status: order.status || defaultOrder.status!,
      paymentStatus: order.paymentStatus || defaultOrder.paymentStatus!,
      // Ensure items is always an array
      items: order.items || [],
      // Handle shipping info
      shippingAddress: order.shippingAddress || '',
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || '',
      // Ensure dates are properly set
      createdAt: order.createdAt || now,
      updatedAt: now
    } as ExtendedOrder;

    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, updates: Partial<ExtendedOrder> = {}) => {
    setOrders(prev => {
      // Check if order exists
      const orderIndex = prev.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        console.log(`Order with ID ${orderId} not found`);
        return prev;
      }
      
      const existingOrder = prev[orderIndex];
      const now = new Date().toISOString();
      
      // Create the updated order with all required fields
      const updatedOrder: ExtendedOrder = { 
        ...existingOrder,
        ...updates,
        // Ensure required fields are always set
        id: existingOrder.id,
        status: status || existingOrder.status,
        orderNumber: updates.orderNumber || existingOrder.orderNumber,
        paymentStatus: updates.paymentStatus || existingOrder.paymentStatus,
        // Handle payment related fields with defaults
        advancePaid: updates.advancePaid ?? existingOrder.advancePaid,
        dueAmount: updates.dueAmount ?? existingOrder.dueAmount,
        isAdvancePaid: updates.isAdvancePaid ?? existingOrder.isAdvancePaid,
        isDuePaid: updates.isDuePaid ?? existingOrder.isDuePaid,
        // Ensure items is always an array
        items: updates.items || existingOrder.items || [],
        // Update timestamps
        updatedAt: now,
        // Handle shipping info
        shippingAddress: updates.shippingAddress ?? existingOrder.shippingAddress,
        trackingNumber: updates.trackingNumber ?? existingOrder.trackingNumber,
        carrier: updates.carrier ?? existingOrder.carrier
      };

      // Sync payment related fields
      if (updates.paymentStatus === 'paid' || updates.isDuePaid) {
        updatedOrder.isDuePaid = true;
        updatedOrder.isAdvancePaid = true;
        updatedOrder.paymentStatus = 'paid';
      } else if (updates.paymentStatus === 'partially_paid' || updates.isAdvancePaid) {
        updatedOrder.paymentStatus = 'partially_paid';
      }

      // Check if any relevant fields have actually changed
      const relevantFields: (keyof ExtendedOrder)[] = [
        'status', 'advancePaid', 'dueAmount', 'isAdvancePaid', 
        'isDuePaid', 'paymentStatus', 'trackingNumber', 'carrier',
        'shippingAddress', 'items'
      ];
      
      const hasChanges = relevantFields.some(field => 
        JSON.stringify(existingOrder[field]) !== JSON.stringify(updatedOrder[field])
      );

      if (!hasChanges) {
        console.log('No changes detected, skipping update');
        return prev;
      }

      console.log('Updating order:', orderId, 'with changes:', {
        from: relevantFields.reduce((acc, field) => ({
          ...acc,
          [field]: existingOrder[field]
        }), {}),
        to: relevantFields.reduce((acc, field) => ({
          ...acc,
          [field]: updatedOrder[field]
        }), {})
      });

      // Create new array with updated order
      const newOrders = [...prev];
      newOrders[orderIndex] = updatedOrder;
      return newOrders;
    });
  };

  const getOrder = (orderId: string): ExtendedOrder | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
