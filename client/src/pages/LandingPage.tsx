import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import { useFeaturedProfessionals } from "../hooks/useProfessionals";
import GlowingCard from "../components/animations/GlowingCard";

// Replaced lucide-react icons with emoji placeholders
const Search = ({ className = '' }: { className?: string }) => (
  <span className={className}>🔍</span>
);

const ArrowRight = ({ className = '' }: { className?: string }) => (
  <span className={className}>→</span>
);

const Shield = ({ className = '' }: { className?: string }) => (
  <span className={className}>🛡️</span>
);

const Contact = ({ className = '' }: { className?: string }) => (
  <span className={className}>👤</span>
);

const DollarSign = ({ className = '' }: { className?: string }) => (
  <span className={className}>💰</span>
);

const Building2 = ({ className = '' }: { className?: string }) => (
  <span className={className}>🏢</span>
);

const CheckCircle2 = ({ className = '' }: { className?: string }) => (
  <span className={className}>✅</span>
);

const Menu = ({ className = '' }: { className?: string }) => (
  <span className={className}>☰</span>
);

const X = ({ className = '' }: { className?: string }) => (
  <span className={className}>✕</span>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [profession, setProfession] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: featuredContractors, isLoading: loadingContractors } = useFeaturedProfessionals("contractor", 3);
  const { data: featuredArchitects, isLoading: loadingArchitects } = useFeaturedProfessionals("architect", 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to professionals page with search params
    navigate(`/professionals?search=${searchTerm}${profession ? `&profession=${profession}` : ''}`);
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Navigation - Craft.do style */}
      <div className="md:hidden bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="font-bold text-xl text-blue-600">Pune</Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100">
            <Link to="/professionals" className="block py-2 text-gray-700 hover:text-blue-600">
              Find Professionals
            </Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600">
              About Us
            </Link>
            <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="block py-2 px-4 bg-blue-600 text-white rounded-lg text-center">
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl text-blue-600">Pune</Link>
            <div className="flex space-x-8">
              <Link to="/professionals" className="text-gray-700 hover:text-blue-600">
                Find Professionals
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                About Us
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Keeping the original background image */}
      <div className="hero-bg min-h-[500px] md:h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/60">
        <div className="text-center text-white px-4 max-w-4xl mx-auto py-16 md:py-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">Find the Best Contractor for Your Dream Project</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">Connect with trusted local contractors and architects in Pune for your construction needs</p>
          
          {/* Search Bar - Clean and minimal */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md p-3 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="What are you looking for?" 
                    className="w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none rounded-lg text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:w-1/4">
                <select 
                  className="w-full px-4 py-3 border-0 focus:ring-0 focus:outline-none rounded-lg text-gray-600 bg-gray-50"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="">All Professionals</option>
                  <option value="contractor">Contractors</option>
                  <option value="architect">Architects</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Why Choose Us Section - Craft.do inspired */}
      <div className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose KARAGIRX Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <Shield className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900">Verified Professionals</h3>
              <p className="text-gray-600">All contractors and architects on our platform are thoroughly vetted and verified.</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <Contact className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900">Dedicated Support</h3>
              <p className="text-gray-600">Our team is available to help you connect with the right professional for your project.</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <DollarSign className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600">Get clear quotes and budgets upfront with no hidden fees or surprises.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Contractors Section - Clean design */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Contractors</h2>
            <Link to="/professionals?profession=contractor" className="text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors text-sm md:text-base">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loadingContractors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 md:p-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredContractors && featuredContractors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredContractors.map(contractor => (
                <GlowingCard key={contractor.id} className="rounded-xl overflow-hidden">
                  <ProfessionalCard professional={contractor} />
                </GlowingCard>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No featured contractors available.</p>
          )}
        </div>
      </div>
      
      {/* Featured Architects Section */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Architects</h2>
            <Link to="/professionals?profession=architect" className="text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors text-sm md:text-base">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loadingArchitects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 md:p-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredArchitects && featuredArchitects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredArchitects.map(architect => (
                <GlowingCard key={architect.id} className="rounded-xl overflow-hidden">
                  <ProfessionalCard professional={architect} />
                </GlowingCard>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No featured architects available.</p>
          )}
        </div>
      </div>
      
      {/* CTA Section - Craft.do inspired */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-xl md:rounded-2xl overflow-hidden">
            <div className="px-5 py-8 md:p-12 md:flex items-center justify-between">
              <div className="md:max-w-2xl mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Ready to start your project?</h2>
                <p className="text-blue-100 text-base md:text-lg mb-5 md:mb-6">
                  Connect with the best professionals in Pune today
                </p>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm md:text-base">Access to verified contractors and architects</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm md:text-base">Get multiple quotes for your project</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-200 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 text-sm md:text-base">Dedicated support throughout your project</p>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right mt-6 md:mt-0 md:ml-6">
                <Link to="/register" className="inline-block bg-white text-blue-600 font-medium px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-blue-50 transition duration-200">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
