export interface Dealer {
  id: number | string;
  dealerCode: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  price: number;
  unit: string;
  deliveryTime: string;
  verified: boolean;
  image: string;
  features: string[];
  category: string;
  subcategory: string;
  description?: string;
  dealerName?: string;
  dealerId?: string;
  businessType?: string;
  yearEstablished?: string;
  deliveryArea?: string;
  certifications?: string[];
  responseRate?: number;
  avgResponseTime?: string;
  orderFulfillmentRate?: number;
  logo?: string;
}

export interface Subcategory {
  name: string;
  slug: string;
  image: string;
}

export interface LikedItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  dealerName: string;
  dealerId: string;
}

export interface CartItem {
  id: string;
  quantity?: number;
}

export interface LikedItemsContextType {
  likedItems: LikedItem[];
  addLikedItem: (item: Omit<LikedItem, 'id'> & { id?: string }) => void;
  removeLikedItem: (id: string) => void;
  isLiked: (id: string) => boolean;
}
