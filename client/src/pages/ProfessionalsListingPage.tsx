import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SearchBar from "@/components/SearchBar";
import ProfessionalCard from "@/components/professionals/ProfessionalCard";
import { Professional } from "@/lib/types";

// Price ranges for professionals
const priceRanges: {[key: number]: string} = {
  1: '₹2,500 - ₹3,500/sqft',
  2: '₹2,800 - ₹3,800/sqft',
  3: '₹3,000 - ₹4,000/sqft',
  4: '₹80 - ₹120/sqft',
  5: '₹100 - ₹150/sqft',
  6: '₹90 - ₹130/sqft',
  7: '₹2,700 - ₹3,700/sqft',
  8: '₹2,900 - ₹3,900/sqft',
  9: '₹3,200 - ₹4,200/sqft',
  10: '₹2,600 - ₹3,600/sqft',
  11: '₹85 - ₹125/sqft',
  12: '₹95 - ₹135/sqft',
  13: '₹110 - ₹160/sqft',
  14: '₹120 - ₹170/sqft',
  15: '₹105 - ₹155/sqft',
  16: '₹3,100 - ₹4,100/sqft',
  17: '₹3,300 - ₹4,300/sqft',
  18: '₹2,400 - ₹3,400/sqft',
  19: '₹115 - ₹165/sqft',
  20: '₹90 - ₹140/sqft'
};

// Sample portfolio images for each professional
const portfolioImageMap: {[key: number]: string[]} = {
  1: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop'
  ],
  2: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752584-5ec6fe7d2d7e?w=400&h=300&fit=crop'
  ],
  3: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
  ],
  4: [
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=400&h=300&fit=crop'
  ],
  5: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop'
  ],
  6: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752584-5ec6fe7d2d7e?w=400&h=300&fit=crop'
  ],
  7: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
  ],
  8: [
    'https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752734-2a0cd53cbd6a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&h=300&fit=crop'
  ],
  9: [
    'https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753543-9c6a433345a5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
  ],
  10: [
    'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop'
  ],
  11: [
    'https://images.unsplash.com/photo-1600607687968-501f1887dd3c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472498-8a62ff29eeab?w=400&h=300&fit=crop'
  ],
  12: [
    'https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600575598562-6bad3150bc66?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753223-3d98e911994f?w=400&h=300&fit=crop'
  ],
  13: [
    'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752291-e0ff51f91f29?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
  ],
  14: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472498-8a62ff29eeab?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop'
  ],
  15: [
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752734-2a0cd53cbd6a?w=400&h=300&fit=crop'
  ],
  16: [
    'https://images.unsplash.com/photo-1600573472602-5a5296743a69?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600575598562-6bad3150bc66?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
  ],
  17: [
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753223-3d98e911994f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=400&h=300&fit=crop'
  ],
  18: [
    'https://images.unsplash.com/photo-1600607687968-501f1887dd3c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472498-8a62ff29eeab?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
  ],
  19: [
    'https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753543-9c6a433345a5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
  ],
  20: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop'
  ]
};

// Mock data from proListingPage project, converted to match the Professional interface
const mockProfessionals: Professional[] = [
  // Contractors
  {
    id: 1,
    userId: 101,
    companyName: 'BuildRight Contractors',
    address: 'Kamshet Main Road',
    pincode: '410405',
    phone: '+91 9876543210',
    profession: 'contractor',
    experience: 15,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    about: 'Experienced residential and commercial builder',
    rating: 4.8,
    reviewCount: 45,
    location: 'Kamshet, Maharashtra',
    specializations: ['Residential Construction', 'Commercial Buildings']
  },
  {
    id: 2,
    userId: 102,
    companyName: 'Stalwart Builders',
    address: 'Lonavala Highway',
    pincode: '410401',
    phone: '+91 9876543211',
    profession: 'contractor',
    experience: 12,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    about: 'Quality construction services for all projects',
    rating: 4.6,
    reviewCount: 38,
    location: 'Lonavala, Maharashtra',
    specializations: ['Renovations', 'Commercial Buildings']
  },
  {
    id: 3,
    userId: 103,
    companyName: 'HomeCrafters',
    address: 'Kamshet Circle',
    pincode: '410405',
    phone: '+91 9876543212',
    profession: 'contractor',
    experience: 18,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    about: 'Custom home building and renovations',
    rating: 4.9,
    reviewCount: 62,
    location: 'Kamshet, Maharashtra',
    specializations: ['Residential Construction', 'Renovations']
  },
  // Adding 7 more contractors
  {
    id: 7,
    userId: 107,
    companyName: 'Premier Construction',
    address: 'Kamshet Station Road',
    pincode: '410405',
    phone: '+91 9876543216',
    profession: 'contractor',
    experience: 10,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    about: 'Specializing in premium housing solutions',
    rating: 4.7,
    reviewCount: 41,
    location: 'Kamshet, Maharashtra',
    specializations: ['Luxury Homes', 'Premium Construction']
  },
  {
    id: 8,
    userId: 108,
    companyName: 'HillTop Builders',
    address: 'Lonavala-Khandala Road',
    pincode: '410401',
    phone: '+91 9876543217',
    profession: 'contractor',
    experience: 14,
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    about: 'Hill station building specialists with expertise in difficult terrains',
    rating: 4.5,
    reviewCount: 36,
    location: 'Lonavala, Maharashtra',
    specializations: ['Hillside Construction', 'Weather-resistant Buildings']
  },
  {
    id: 9,
    userId: 109,
    companyName: 'EcoVista Constructions',
    address: 'Green Valley, Kamshet',
    pincode: '410405',
    phone: '+91 9876543218',
    profession: 'contractor',
    experience: 8,
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
    about: 'Eco-friendly construction using sustainable materials',
    rating: 4.9,
    reviewCount: 32,
    location: 'Kamshet, Maharashtra',
    specializations: ['Sustainable Construction', 'Green Buildings']
  },
  {
    id: 10,
    userId: 110,
    companyName: 'Foundation Masters',
    address: 'Civil Lines, Pune',
    pincode: '411001',
    phone: '+91 9876543219',
    profession: 'contractor',
    experience: 20,
    profileImage: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop',
    about: 'Foundation and structural experts for all building types',
    rating: 4.8,
    reviewCount: 75,
    location: 'Pune, Maharashtra',
    specializations: ['Foundations', 'Structural Engineering']
  },
  {
    id: 16,
    userId: 116,
    companyName: 'Modern Habitat Builders',
    address: 'Kamshet-Pawna Road',
    pincode: '410405',
    phone: '+91 9876543225',
    profession: 'contractor',
    experience: 11,
    profileImage: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop',
    about: 'Modern aesthetic homes with contemporary design',
    rating: 4.7,
    reviewCount: 39,
    location: 'Kamshet, Maharashtra',
    specializations: ['Modern Homes', 'Contemporary Design']
  },
  {
    id: 17,
    userId: 117,
    companyName: 'Heritage Renovators',
    address: 'Old Town, Lonavala',
    pincode: '410401',
    phone: '+91 9876543226',
    profession: 'contractor',
    experience: 22,
    profileImage: 'https://images.unsplash.com/photo-1546456073-92b9f0a8d413?w=400&h=400&fit=crop',
    about: 'Heritage property restoration and renovation specialists',
    rating: 4.9,
    reviewCount: 47,
    location: 'Lonavala, Maharashtra',
    specializations: ['Heritage Restoration', 'Colonial Architecture']
  },
  {
    id: 18,
    userId: 118,
    companyName: 'UrbanEdge Developers',
    address: 'Metro Square, Pune',
    pincode: '411001',
    phone: '+91 9876543227',
    profession: 'contractor',
    experience: 13,
    profileImage: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop',
    about: 'Urban housing and commercial space specialists',
    rating: 4.5,
    reviewCount: 34,
    location: 'Pune, Maharashtra',
    specializations: ['Urban Housing', 'Commercial Spaces']
  },
  
  // Architects
  {
    id: 4,
    userId: 104,
    companyName: 'Renova Solutions',
    address: 'Design Square, Kamshet',
    pincode: '410405',
    phone: '+91 9876543213',
    profession: 'architect',
    experience: 10,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    about: 'Innovative interior and exterior design',
    rating: 4.7,
    reviewCount: 28,
    location: 'Kamshet, Maharashtra',
    specializations: ['Interior Design', 'Modern Architecture']
  },
  {
    id: 5,
    userId: 105,
    companyName: 'Spatial Concepts',
    address: 'Creative Hub, Lonavala',
    pincode: '410401',
    phone: '+91 9876543214',
    profession: 'architect',
    experience: 8,
    profileImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    about: 'Award-winning architectural designs for residential properties',
    rating: 4.9,
    reviewCount: 31,
    location: 'Lonavala, Maharashtra',
    specializations: ['Residential Architecture', 'Sustainable Design']
  },
  {
    id: 6,
    userId: 106,
    companyName: 'Urban Planners',
    address: 'Metro Complex, Pune',
    pincode: '411001',
    phone: '+91 9876543215',
    profession: 'architect',
    experience: 14,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    about: 'Specialized in urban planning and community spaces',
    rating: 4.5,
    reviewCount: 42,
    location: 'Pune, Maharashtra',
    specializations: ['Urban Planning', 'Community Spaces', 'Commercial Architecture']
  },
  // Adding 7 more architects
  {
    id: 11,
    userId: 111,
    companyName: 'Hillview Architecture',
    address: 'Scenic Point, Kamshet',
    pincode: '410405',
    phone: '+91 9876543220',
    profession: 'architect',
    experience: 9,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    about: 'Specializing in designs that complement natural landscapes',
    rating: 4.6,
    reviewCount: 27,
    location: 'Kamshet, Maharashtra',
    specializations: ['Landscape Integration', 'Hill Architecture']
  },
  {
    id: 12,
    userId: 112,
    companyName: 'Minimalist Designs',
    address: 'Design Boulevard, Lonavala',
    pincode: '410401',
    phone: '+91 9876543221',
    profession: 'architect',
    experience: 7,
    profileImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
    about: 'Clean, minimalist designs focusing on functionality',
    rating: 4.8,
    reviewCount: 24,
    location: 'Lonavala, Maharashtra',
    specializations: ['Minimalist Design', 'Functional Spaces']
  },
  {
    id: 13,
    userId: 113,
    companyName: 'Heritage Revival',
    address: 'Old Town, Pune',
    pincode: '411001',
    phone: '+91 9876543222',
    profession: 'architect',
    experience: 15,
    profileImage: 'https://images.unsplash.com/photo-1573497019236-61e7a3e1f341?w=400&h=400&fit=crop',
    about: 'Reviving traditional architectural elements with modern functionality',
    rating: 4.9,
    reviewCount: 33,
    location: 'Pune, Maharashtra',
    specializations: ['Heritage Architecture', 'Traditional Designs']
  },
  {
    id: 14,
    userId: 114,
    companyName: 'Futuristic Spaces',
    address: 'Tech Hub, Pune',
    pincode: '411001',
    phone: '+91 9876543223',
    profession: 'architect',
    experience: 6,
    profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop',
    about: 'Pushing boundaries with futuristic and technology-integrated designs',
    rating: 4.7,
    reviewCount: 19,
    location: 'Pune, Maharashtra',
    specializations: ['Futuristic Design', 'Smart Homes']
  },
  {
    id: 15,
    userId: 115,
    companyName: 'Green Acre Designs',
    address: 'Eco Village, Kamshet',
    pincode: '410405',
    phone: '+91 9876543224',
    profession: 'architect',
    experience: 12,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    about: 'Sustainable architecture with focus on green spaces',
    rating: 4.8,
    reviewCount: 29,
    location: 'Kamshet, Maharashtra',
    specializations: ['Green Architecture', 'Sustainable Living']
  },
  {
    id: 19,
    userId: 119,
    companyName: 'Luxe Interiors',
    address: 'Premium Plaza, Lonavala',
    pincode: '410401',
    phone: '+91 9876543228',
    profession: 'architect',
    experience: 11,
    profileImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop',
    about: 'Luxury interior architecture for high-end residences',
    rating: 4.9,
    reviewCount: 28,
    location: 'Lonavala, Maharashtra',
    specializations: ['Luxury Interiors', 'Premium Residences']
  },
  {
    id: 20,
    userId: 120,
    companyName: 'Tropical Modern Designs',
    address: 'Palm Avenue, Kamshet',
    pincode: '410405',
    phone: '+91 9876543229',
    profession: 'architect',
    experience: 10,
    profileImage: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?w=400&h=400&fit=crop',
    about: 'Blending tropical aesthetics with modern design principles',
    rating: 4.7,
    reviewCount: 25,
    location: 'Kamshet, Maharashtra',
    specializations: ['Tropical Modern', 'Indoor-Outdoor Living']
  }
];

// Get unique locations from professionals
const uniqueLocations = Array.from(new Set(mockProfessionals.map(pro => pro.location.split(',')[0].trim())));

const ProfessionalsListingPage = () => {
  const [activeTab, setActiveTab] = useState('Contractors');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const routerLocation = useLocation();
  const queryParams = new URLSearchParams(routerLocation.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(queryParams.get('location') || '');
  const [sortBy, setSortBy] = useState('rating');
  const navigate = useNavigate();
  
  // Update URL when filters change
  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('type', activeTab.toLowerCase());
    if (selectedLocation) newSearchParams.set('location', selectedLocation);
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (minRating > 0) newSearchParams.set('minRating', minRating.toString());
    if (minExperience > 0) newSearchParams.set('minExperience', minExperience.toString());
    if (sortBy) newSearchParams.set('sortBy', sortBy);

    const queryString = newSearchParams.toString();
    navigate(`/professionals${queryString ? `?${queryString}` : ''}`);
  };

  useEffect(() => {
    applyFilters();
  }, [activeTab, selectedLocation, searchTerm, minRating, minExperience, sortBy, navigate]);

  useEffect(() => {
    // Scroll to top when the component mounts or when search params change
    window.scrollTo(0, 0);
    
    const locParam = queryParams.get('location');
    const typeParam = queryParams.get('type');
    if (locParam) {
      setLocationFilter(locParam);
      setSelectedLocation(locParam);
    }
    if (typeParam) {
      if (typeParam.toLowerCase() === 'contractor') setActiveTab('Contractors');
      else if (typeParam.toLowerCase() === 'architect') setActiveTab('Architects');
    }
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.search, queryParams]);

  // Filter professionals based on all criteria
  const filteredProfessionals = mockProfessionals.filter(pro => {
    // Match profession type
    const matchesType = pro.profession.toLowerCase() === activeTab.toLowerCase().slice(0, -1);
    
    // Match location if selected
    const matchesLocation = !selectedLocation || 
      pro.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    // Match search term in company name, full name, description or specializations
    const matchesSearch = !searchTerm || 
      (pro.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pro.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pro.about?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pro.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Match minimum rating
    const matchesRating = pro.rating >= minRating;
    
    // Match minimum experience
    const matchesExperience = pro.experience >= minExperience;
    
    return matchesType && matchesLocation && matchesSearch && matchesRating && matchesExperience;
  });

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experience - a.experience;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });

  const professionals = sortedProfessionals;
  const totalCount = professionals.length;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const clearFilter = (filter: string) => {
    if (filter === 'location') {
      setSelectedLocation('');
    }
    if (filter === 'search') setSearchTerm('');
    if (filter === 'rating') setMinRating(0);
    if (filter === 'experience') setMinExperience(0);
    if (filter === 'all') {
      setSelectedLocation('');
      setSearchTerm('');
      setMinRating(0);
      setMinExperience(0);
      setSortBy('rating');
    }
  };

  const isAnyFilterActive = selectedLocation || searchTerm || minRating > 0 || minExperience > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Find Professionals | Kamshet.Build</title>
        <meta name="description" content={`Find the best construction professionals in Kamshet for your project`} />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-center mb-4">Find Professionals</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
        
        {/* Mobile Filter Controls - Collapsible */}
        <div className="mb-4">
          <button 
            onClick={() => document.getElementById('filterControls')?.classList.toggle('hidden')} 
            className="w-full flex items-center justify-between bg-gray-800 text-white py-2 px-3 rounded-md mb-2 text-sm font-medium"
          >
            <span>Filter & Sort</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div id="filterControls" className="hidden space-y-2">
            {/* Location Filter */}
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
              <select 
                className="w-full bg-gray-700 text-white rounded-md px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {Array.from(new Set(mockProfessionals.map(pro => pro.location.split(',')[0].trim()))).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Rating Filter */}
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Min Rating: {minRating.toFixed(1)}+
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5" 
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Any</span>
                  <span>5.0</span>
                </div>
              </div>
              
              {/* Experience Filter */}
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Experience: {minExperience}+ yrs
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="1" 
                  value={minExperience}
                  onChange={(e) => setMinExperience(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Any</span>
                  <span>20y</span>
                </div>
              </div>
            </div>
            
            {/* Sort By */}
            <div className="bg-gray-800/50 p-2 rounded-lg">
              <label className="block text-xs font-medium text-gray-300 mb-1">Sort By</label>
              <select 
                className="w-full bg-gray-700 text-white rounded-md px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Active Filters - Horizontal Scrollable */}
        {isAnyFilterActive && (
          <div className="mb-3 overflow-x-auto whitespace-nowrap pb-1 -mx-4 px-4">
            <div className="flex gap-2 w-max min-w-full">
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span className="truncate max-w-[80px]">"{searchTerm}"</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('search')}
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {selectedLocation && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span>{selectedLocation}</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('location')}
                    aria-label="Remove location filter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {minRating > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span>{minRating}+★</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('rating')}
                    aria-label="Clear rating filter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {minExperience > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  <span>{minExperience}+ yrs</span>
                  <button 
                    className="ml-1 text-gray-500"
                    onClick={() => clearFilter('experience')}
                    aria-label="Clear experience filter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              <button 
                className="text-blue-400 text-xs font-medium"
                onClick={() => clearFilter('all')}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Tab Toggle */}
        <div className="flex mb-3 border-b border-gray-700">
          {['Contractors', 'Architects'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-xs font-medium ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200">
            Found {totalCount} {activeTab}
            {isAnyFilterActive && " matching your filters"}
          </h2>
        </div>
        
        {/* Results List */}
        <div className="grid gap-6 md:grid-cols-2">
          {professionals.length > 0 ? (
            professionals.map((professional) => (
              <ProfessionalCard 
                key={professional.id} 
                professional={professional} 
                portfolioImages={portfolioImageMap[professional.id]} 
                priceRange={priceRanges[professional.id]}
              />
            ))
          ) : (
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50 col-span-2 text-center">
              <p className="text-gray-300">No professionals found matching your criteria.</p>
              <p className="mt-2 text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsListingPage;
