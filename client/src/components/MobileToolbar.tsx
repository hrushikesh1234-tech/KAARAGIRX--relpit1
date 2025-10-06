import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import Lucide icons
import { Home, ShoppingBag, MapPin, Truck, MessageSquare } from 'lucide-react';

const MobileToolbar: React.FC = () => {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-1">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-[#D4AF37]' : 'text-white'}`}>
          <Home width={24} height={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/shop" className={`flex flex-col items-center ${isActive('/shop') ? 'text-[#D4AF37]' : 'text-white'}`}>
          <ShoppingBag width={24} height={24} />
          <span className="text-xs mt-1">Shop</span>
        </Link>
        
        <Link to="/track" className={`flex flex-col items-center ${isActive('/track') ? 'text-[#D4AF37]' : 'text-white'}`}>
          <MapPin width={24} height={24} />
          <span className="text-xs mt-1">Track</span>
        </Link>
        
        <Link to="/onrent" className={`flex flex-col items-center ${isActive('/onrent') ? 'text-[#D4AF37]' : 'text-white'}`}>
          <Truck width={24} height={24} />
          <span className="text-xs mt-1">On Rent</span>
        </Link>
        
        <Link to="/profile-dashboard" className={`flex flex-col items-center ${isActive('/profile-dashboard') ? 'text-[#D4AF37]' : 'text-white'}`}>
          <div className="w-6 h-6 flex items-center justify-center text-lg font-bold">D</div>
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileToolbar;
