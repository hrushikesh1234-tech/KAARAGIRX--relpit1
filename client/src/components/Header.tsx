import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare } from "lucide-react";
// Emoji placeholders
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import ProfilePicture from "./ProfilePicture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { notifications = [] } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [unreadMessages, setUnreadMessages] = useState(3);
  
  // Helper function to check if we're on a specific page
  const isActivePage = (path: string, param?: string) => {
    if (!path) return false;
    const isPathMatch = location.pathname === path || location.pathname.startsWith(path + '/');
    if (!param) return isPathMatch;
    
    // Check for specific URL parameter
    const searchParams = new URLSearchParams(location.search);
    return isPathMatch && searchParams.has(param);
  };
  
  // Helper function to scroll to top when navigating
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const href = target.getAttribute('href') || target.closest('a')?.getAttribute('href');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (href && href !== window.location.pathname) {
      navigate(href);
    }
  };
  
  // This would normally fetch from an API
  useEffect(() => {
    // Simulate fetching unread counts from API
    // In a real application, you would fetch these from your backend
    // Example: fetchUnreadCounts().then(data => {
    //   setUnreadMessages(data.messages);
    //   setUnreadNotifications(data.notifications);
    // });
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleMobileNavClick = (e: React.MouseEvent) => {
    closeMobileMenu();
    scrollToTop(e);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex h-16 items-center justify-between">
          {/* Left section: Logo and Main Navigation */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="cursor-pointer mr-8">
              <img src="/images/karagirx-logo.png" alt="KARAGIRX" className="h-12 md:h-16 lg:h-24" style={{ transform: 'scaleX(1.2)' }} />
            </Link>
            
            {/* Main Navigation */}
            <nav className="flex items-center space-x-8 ml-4">
              <Link to="/" onClick={scrollToTop} className={`flex items-center text-white hover:text-[#3b82f6] font-medium text-sm ${isActivePage('/') ? "text-[#3b82f6]" : ""}`}>
                <span className="mr-1.5">🏠</span>
                <span>Home</span>
              </Link>
              <Link to="/shop" onClick={scrollToTop} className={`flex items-center text-white hover:text-[#3b82f6] font-medium text-sm ${isActivePage('/shop') ? "text-[#3b82f6]" : ""}`}>
                <span className="mr-1.5">🛍️</span>
                <span>Shop</span>
              </Link>
              <Link to="/track" onClick={scrollToTop} className={`flex items-center text-white hover:text-[#3b82f6] font-medium text-sm ${isActivePage('/track') ? "text-[#3b82f6]" : ""}`}>
                <span className="mr-1.5">📍</span>
                <span>Track</span>
              </Link>
              <Link to="/onrent" onClick={scrollToTop} className={`flex items-center text-white hover:text-[#3b82f6] font-medium text-sm ${isActivePage('/onrent') ? "text-[#3b82f6]" : ""}`}>
                <span className="mr-1.5">🚚</span>
                <span>On Rent</span>
              </Link>
              <Link to="/professionals" onClick={scrollToTop} className={`flex items-center text-white hover:text-[#3b82f6] font-medium text-sm ${isActivePage('/professionals') ? "text-[#3b82f6]" : ""}`}>
                <span className="mr-1.5">👥</span>
                <span>Professionals</span>
              </Link>
              <Link to="/about" onClick={scrollToTop} className={`flex items-center text-white hover:text-[#3b82f6] font-medium text-sm ${isActivePage('/about') ? "text-[#3b82f6]" : ""}`}>
                <span className="mr-1.5">👥</span>
                <span>About Us</span>
              </Link>
            </nav>
          </div>
          
          {/* Right section: Search, Auth, and User Actions */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative w-64 lg:w-80">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-800 text-white rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <span>🔍</span>
              </button>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-5">
                {/* Dashboard Link */}
                <Link to="/dashboard/projects" onClick={scrollToTop} className="flex items-center text-white hover:text-[#3b82f6] font-medium text-sm">
                  <span>Dashboard</span>
                </Link>
                
                {/* Bookmarked Link */}
                <Link to="/bookmarked" onClick={scrollToTop} className="flex items-center text-white hover:text-[#3b82f6] font-medium text-sm">
                  <span className="mr-1.5">🔖</span>
                  <span>Bookmarked</span>
                </Link>
                
                {/* Message Button with Count Indicator */}
                <Link to="/dashboard/messages" onClick={scrollToTop} className="relative p-1">
                  <div className="relative">
                    <button className="text-white hover:text-[#3b82f6] transition-colors">
                      <span>💬</span>
                    </button>
                    {unreadMessages > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Notification Bell with Count Indicator */}
                <Link to="/notifications" onClick={scrollToTop} className="relative p-1 group">
                  <div className="relative">
                    <button className={cn(
                      "text-white transition-colors hover:text-[#3b82f6]",
                      "relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800/50"
                    )}>
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </span>
                      )}
                    </button>
                  </div>
                </Link>
                
                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 rounded-full hover:bg-gray-800 p-1.5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                        {user?.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.fullName || 'User'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName || 'user'}`;
                            }}
                          />
                        ) : (
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'user'}`}
                            alt={user?.fullName || 'User'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="font-medium">{user?.fullName}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/profile" className="flex items-center w-full" onClick={scrollToTop}>
                        <span className="mr-2">👤</span>
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/dashboard" className="flex items-center w-full" onClick={scrollToTop}>
                        <span className="mr-2">💼</span>
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/messages" className="flex items-center w-full" onClick={scrollToTop}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span>Messages</span>
                        {unreadMessages > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadMessages > 9 ? '9+' : unreadMessages}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                      <span className="mr-2">🚪</span>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" onClick={scrollToTop} className="text-white hover:text-[#3b82f6] font-medium text-sm">
                  Login
                </Link>
                <Link to="/register?type=professional" onClick={scrollToTop}>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                    Register as Professional
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="flex md:hidden h-16 items-center justify-between">
          {/* Left: Profile Icon */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.fullName || 'User'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName || 'user'}`;
                    }}
                  />
                ) : (
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'user'}`}
                    alt={user?.fullName || 'User'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Center: Logo (adjusted size and position) */}
          <div className="cursor-default ml-0">
            <img src="/images/karagirx-logo.png" alt="KARAGIRX" className="h-32 py-1" style={{ transform: 'scaleX(1.44)' }} />
          </div>
          
          {/* Right: Mobile Icons */}
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                {/* Bookmark Button */}
                <Link to="/bookmarked" onClick={scrollToTop} className="relative p-1">
                  <div className="relative">
                    <button className="text-white hover:text-[#D4AF37] transition-colors flex items-center justify-center w-6 h-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                      </svg>
                    </button>
                  </div>
                </Link>
                
                {/* Message Button with Count Indicator */}
                <Link to="/messages" onClick={scrollToTop} className="relative p-1">
                  <div className="relative">
                    <button className="text-white hover:text-[#D4AF37] transition-colors flex items-center justify-center w-6 h-6">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    {unreadMessages > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Notification Bell with Count Indicator */}
                <Link to="/notifications" onClick={scrollToTop} className="relative p-1">
                  <div className="relative">
                    <button className="text-white hover:text-[#D4AF37] transition-colors flex items-center justify-center w-6 h-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                      </svg>
                    </button>
                    {unreadCount > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu} 
              className="text-white hover:text-[#3b82f6] p-0.5 ml-1"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={handleMobileNavClick} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                Home
              </Link>
              <Link to="/professionals" onClick={handleMobileNavClick} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                Professionals
              </Link>
              <Link to="/about" onClick={handleMobileNavClick} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                About Us
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/projects" onClick={(e) => { setMobileMenuOpen(false); scrollToTop(e); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                    Dashboard
                  </Link>
                  <Link to="/bookmarked" onClick={(e) => { setMobileMenuOpen(false); scrollToTop(e); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                    Bookmarked
                  </Link>
                  <Link to="/profile" onClick={(e) => { setMobileMenuOpen(false); scrollToTop(e); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-400 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <Link to="/login" onClick={(e) => { setMobileMenuOpen(false); scrollToTop(e); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#3b82f6] hover:bg-gray-800">
                    Login
                  </Link>
                </div>
              )}
              
              {!isAuthenticated && (
                <Link 
                  to="/register?type=professional"
                  onClick={(e) => { setMobileMenuOpen(false); scrollToTop(e); }}
                  className="block px-4 py-3 rounded-md text-base font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 mt-2 shadow-md"
                >
                  Register as Professional
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
