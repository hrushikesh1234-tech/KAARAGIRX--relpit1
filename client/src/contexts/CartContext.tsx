import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  dealerName: string;
  dealerId: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isItemInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        const updatedQuantity = (existingItem.quantity || 0) + (item.quantity || 1);
        const updatedItems = prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: updatedQuantity } : i
        );
        
        console.log('Updated existing item quantity:', {
          itemId: item.id,
          newQuantity: updatedQuantity,
          cartTotal: getCartTotal()
        });
        
        return updatedItems;
      }
      
      const newItem = { ...item, quantity: item.quantity || 1 };
      console.log('Added new item to cart:', {
        item: newItem,
        cartTotal: getCartTotal()
      });
      
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number | string) => {
    // Ensure quantity is a number
    const newQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : Math.floor(Number(quantity));
    
    if (isNaN(newQuantity) || newQuantity < 1) return;
    
    setItems(prevItems => {
      const updated = prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      
      // Log the update for debugging
      console.log('Updating quantity:', {
        id,
        newQuantity,
        item: updated.find(i => i.id === id),
        cartTotal: getCartTotal()
      });
      
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = (): number => {
    return items.reduce((total: number, item: CartItem) => {
      try {
        // Safely parse price and quantity
        const priceStr = item.price?.toString() || '0';
        const quantityStr = item.quantity?.toString() || '0';
        
        const itemPrice = parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
        const itemQuantity = Math.max(0, Math.floor(parseFloat(quantityStr)));
        
        if (isNaN(itemPrice) || isNaN(itemQuantity)) {
          console.warn('Invalid price or quantity:', { item });
          return total;
        }
        
        const itemTotal = itemPrice * itemQuantity;
        
        // Log each item's calculation for debugging
        console.log('Cart item calculation:', {
          name: item.name,
          price: itemPrice,
          quantity: itemQuantity,
          itemTotal,
          runningTotal: total + itemTotal
        });
        
        return total + itemTotal;
      } catch (error) {
        console.error('Error calculating cart total:', error);
        return total;
      }
    }, 0);
  };

  const getItemCount = (): number => {
    return items.reduce((count: number, item: CartItem) => {
      try {
        const quantityStr = item.quantity?.toString() || '0';
        const quantity = Math.max(0, Math.floor(parseFloat(quantityStr)));
        return isNaN(quantity) ? count : count + quantity;
      } catch (error) {
        console.error('Error calculating item count:', error);
        return count;
      }
    }, 0);
  };

  const isItemInCart = (id: string) => {
    return items.some(item => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
