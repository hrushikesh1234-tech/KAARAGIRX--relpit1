import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikedItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  dealerName: string;
  dealerId: string;
}

interface LikedItemsContextType {
  likedItems: LikedItem[];
  addLikedItem: (item: Omit<LikedItem, 'id'> & { id?: string }) => void;
  removeLikedItem: (id: string) => void;
  isLiked: (id: string) => boolean;
}

const LikedItemsContext = createContext<LikedItemsContextType | undefined>(undefined);

export const useLikedItems = () => {
  const context = useContext(LikedItemsContext);
  if (!context) {
    throw new Error('useLikedItems must be used within a LikedItemsProvider');
  }
  return context;
};

interface LikedItemsProviderProps {
  children: ReactNode;
}

export const LikedItemsProvider: React.FC<LikedItemsProviderProps> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<LikedItem[]>(() => {
    // Load liked items from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likedItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const saveLikedItems = (items: LikedItem[]) => {
    setLikedItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedItems', JSON.stringify(items));
    }
  };

  const addLikedItem = (item: Omit<LikedItem, 'id'> & { id?: string }) => {
    const id = item.id || `${Date.now()}`;
    if (!likedItems.some(likedItem => likedItem.id === id)) {
      const newItem = { ...item, id };
      saveLikedItems([...likedItems, newItem]);
    }
  };

  const removeLikedItem = (id: string) => {
    saveLikedItems(likedItems.filter(item => item.id !== id));
  };

  const isLiked = (id: string) => {
    return likedItems.some(item => item.id === id);
  };

  return (
    <LikedItemsContext.Provider 
      value={{
        likedItems,
        addLikedItem,
        removeLikedItem,
        isLiked
      }}
    >
      {children}
    </LikedItemsContext.Provider>
  );
};

export default LikedItemsContext;
