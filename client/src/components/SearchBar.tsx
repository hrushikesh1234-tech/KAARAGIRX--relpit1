import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

const SearchBar = ({ className = '', compact = false }: SearchBarProps) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [professionalType, setProfessionalType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (professionalType) params.append('type', professionalType);
    if (budget) params.append('budget', budget);
    
    navigate(`/professionals?${params.toString()}`);
  };

  if (compact) {
    return (
      <div className={`bg-white bg-opacity-20 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md ${className}`}>
        <div className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search professionals..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none font-bold text-black" 
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div>
            <select 
              className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none font-bold text-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="kamshet">Kamshet</option>
              <option value="lonavla">Lonavla</option>
              <option value="pune">Pune</option>
            </select>
          </div>
          
          <div>
            <select 
              className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none font-bold text-black"
              value={professionalType}
              onChange={(e) => setProfessionalType(e.target.value)}
            >
              <option value="">All Professionals</option>
              <option value="contractor">Contractors</option>
              <option value="architect">Architects</option>
            </select>
          </div>
          
          <div>
            <button 
              onClick={handleSearch}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-md font-bold transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg shadow-md ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="flex flex-col space-y-3">
          {/* Main search input */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="What are you looking for? e.g. Bungalow Construction" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full py-3 px-4 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none text-sm font-bold text-black" 
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">🔍</span>
            </div>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <select 
                className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-md shadow-sm text-xs font-bold text-black appearance-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
              >
                <option value="">Location</option>
                <option value="kamshet">Kamshet</option>
                <option value="lonavla">Lonavla</option>
                <option value="pune">Pune</option>
              </select>
            </div>
            <div>
              <select 
                className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-md shadow-sm text-xs font-bold text-black appearance-none"
                value={professionalType}
                onChange={(e) => setProfessionalType(e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
              >
                <option value="">Professional</option>
                <option value="contractor">Contractor</option>
                <option value="architect">Architect</option>
              </select>
            </div>
            <div>
              <select 
                className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-md shadow-sm text-xs font-bold text-black appearance-none"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
              >
                <option value="">Budget Range</option>
                <option value="500000-1000000">₹5L - ₹10L</option>
                <option value="1000000-2500000">₹10L - ₹25L</option>
                <option value="2500000-5000000">₹25L - ₹50L</option>
                <option value="5000000-10000000">₹50L - ₹1Cr</option>
                <option value="10000000-50000000">₹1Cr - ₹5Cr</option>
              </select>
            </div>
          </div>

          {/* Search button */}
          <button 
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-md font-bold transition-colors duration-200 text-sm flex items-center justify-center"
          >
            <span className="mr-1">🔍</span>
            Find Professionals
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
