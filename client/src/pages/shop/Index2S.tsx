'use client';

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
// Import Lucide icons using require
import { Home, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';

const Index2S = () => {
  // Prevent scrolling on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero/shop-hero-section.png)'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 p-4 text-white max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-text">
              KAARAGIRX
            </span>{' '}
            Materials Hub
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Find the best dealers, suppliers and materials for your construction needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90">
                Visit Shop
              </Button>
            </Link>
            <Link to="/shop/dealers" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-white/10 hover:bg-white/20 border-white/30 backdrop-blur-sm">
                Find Dealers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index2S;
