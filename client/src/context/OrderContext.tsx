import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type OrderStatus = 'pending' | 'verified' | 'paid' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

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
  estimatedDelivery?: string;
  deliveryCharge?: number;
  tax?: number;
  subtotal?: number;
  advancePaid?: number;
  dueAmount?: number;
  isAdvancePaid?: boolean;
  isDuePaid?: boolean;
  items?: OrderItem[];
  dealerName?: string;
  dealerPhone?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load orders from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('userOrders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
    return [];
  });

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userOrders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prevOrders => {
      // Check if order already exists
      const exists = prevOrders.some(o => o.id === order.id);
      if (exists) {
        return prevOrders.map(o => o.id === order.id ? { ...o, ...order } : o);
      }
      return [...prevOrders, order];
    });
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
