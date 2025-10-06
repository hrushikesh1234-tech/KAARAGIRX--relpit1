import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// Icons replaced with text for compatibility
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  
  // Simplified header without authentication for initial load
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary" : "hover:text-primary";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <span className="mr-2">🏢</span>
          <span>Kamshet</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className={`font-medium transition ${isActive("/")}`}>Home</Link>
          <Link to="/professionals" className={`font-medium transition ${isActive("/professionals")}`}>Find Professionals</Link>
          <Link to="/about" className={`font-medium transition ${isActive("/about")}`}>About Us</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-100 transition">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary-dark transition">
            Register
          </Link>
          <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
            ☰
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />}
    </header>
  );
};

export default Header;
