import { Helmet } from "react-helmet";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import { Professional } from "../lib/types";
import { Link, useNavigate } from "react-router-dom";
import { RentalCard } from '@/components/rentals/RentalCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { LampContainer } from "@/components/ui/lamp";
import { useFeaturedProfessionals } from "@/hooks/useProfessionals";
// @ts-ignore
import Autoplay from "embla-carousel-autoplay";

// Custom Icons
const ChevronRight = ({ className = '' }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-5 w-5 ${className}`} 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
      clipRule="evenodd" 
    />
  </svg>
);

// Animation styles
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Replaced lucide-react icons with emoji placeholders
const UserCheck = ({ className = '' }: { className?: string }) => (
  <span className={className}>✅</span>
);

const DollarSign = ({ className = '' }: { className?: string }) => (
  <span className={className}>💰</span>
);

const HomeIcon = ({ className = '' }: { className?: string }) => (
  <span className={className}>🏠</span>
);

// Sample portfolio images for professionals
const portfolioImageMap: {[key: number]: string[]} = {
  101: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop'
  ],
  102: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752584-5ec6fe7d2d7e?w=400&h=300&fit=crop'
  ],
  103: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
  ],
  104: [
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=400&h=300&fit=crop'
  ],
  105: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop'
  ],
  201: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752229-250b0347e0cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752354-c5a8c4c85ad6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752584-5ec6fe7d2d7e?w=400&h=300&fit=crop'
  ],
  202: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
  ],
  203: [
    'https://images.unsplash.com/photo-1600566753376-12c8ab8e317f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566752734-2a0cd53cbd6a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&h=300&fit=crop'
  ],
  204: [
    'https://images.unsplash.com/photo-1600566752791-36c7ea9c4a5b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753543-9c6a433345a5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
  ],
  205: [
    'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b46f01f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop'
  ]
};

// Price ranges for professionals
const priceRanges: {[key: number]: string} = {
  101: '₹3,000 - ₹4,000/sqft',
  102: '₹2,800 - ₹3,800/sqft',
  103: '₹2,500 - ₹3,500/sqft',
  104: '₹3,200 - ₹4,200/sqft',
  105: '₹2,900 - ₹3,900/sqft',
  201: '₹80 - ₹120/sqft',
  202: '₹90 - ₹130/sqft',
  203: '₹85 - ₹125/sqft',
  204: '₹100 - ₹150/sqft',
  205: '₹95 - ₹135/sqft'
};

const HomePage = () => {
  const [contractorApi, setContractorApi] = useState<CarouselApi>();
  const [architectApi, setArchitectApi] = useState<CarouselApi>();
  const [dealerApi, setDealerApi] = useState<CarouselApi>();
  const [rentalApi, setRentalApi] = useState<CarouselApi>();
  const [contractorCurrent, setContractorCurrent] = useState(0);
  const [architectCurrent, setArchitectCurrent] = useState(0);
  const [dealerCurrent, setDealerCurrent] = useState(0);
  const [rentalCurrent, setRentalCurrent] = useState(0);
  const navigate = useNavigate();
  
  // Set up event listeners for carousel changes
  useEffect(() => {
    if (!contractorApi) return;
    
    const onSelect = () => {
      setContractorCurrent(contractorApi.selectedScrollSnap());
    };
    
    contractorApi.on('select', onSelect);
    return () => {
      contractorApi.off('select', onSelect);
    };
  }, [contractorApi]);
  
  useEffect(() => {
    if (!architectApi) return;
    
    const onSelect = () => {
      setArchitectCurrent(architectApi.selectedScrollSnap());
    };
    
    architectApi.on('select', onSelect);
    return () => {
      architectApi.off('select', onSelect);
    };
  }, [architectApi]);

  useEffect(() => {
    if (!dealerApi) return;
    
    const onSelect = () => {
      setDealerCurrent(dealerApi.selectedScrollSnap());
    };
    
    dealerApi.on('select', onSelect);
    return () => {
      dealerApi.off('select', onSelect);
    };
  }, [dealerApi]);

  useEffect(() => {
    if (!rentalApi) return;
    
    const onSelect = () => {
      setRentalCurrent(rentalApi.selectedScrollSnap());
    };
    
    rentalApi.on('select', onSelect);
    return () => {
      rentalApi.off('select', onSelect);
    };
  }, [rentalApi]);

  // Auto-scroll carousels
  const autoplayPlugin = useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnLastSnap: false
    })
  );
  
  // Add fade-in animation class to elements with the fade-in class
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '1';
      }
    });
  }, []);
  // Map architect IDs to their corresponding local images
  const architectImageMap: Record<string, string> = {
    '201': '/Featured-sections-images/Featured Architects/1 - Priya Desai.jpeg',
    '202': '/Featured-sections-images/Featured Architects/2 - Rahul Mehta.jpeg',
    '203': '/Featured-sections-images/Featured Architects/3 - Ananya Reddy.jpeg',
    '204': '/Featured-sections-images/Featured Architects/4 - Arjun Kapoor.jpeg',
    '205': '/Featured-sections-images/Featured Architects/5 - Meera Joshi.jpeg'
  };

  // Map dealer IDs to their corresponding local images
  const dealerImageMap: Record<string, string> = {
    '501': '/Featured-sections-images/Featured Dealers/1.jpeg',
    '502': '/Featured-sections-images/Featured Dealers/2.jpeg',
    '503': '/Featured-sections-images/Featured Dealers/3.jpeg',
    '504': '/Featured-sections-images/Featured Dealers/4.jpeg'
  };

  // Map rental IDs to their corresponding local images
  const rentalImageMap: Record<string, string> = {
    '601': '/Featured-sections-images/Featured Equipments Rentals/1 - JCB 3DX.jpeg',
    '602': '/Featured-sections-images/Featured Equipments Rentals/2- Concrete Mixer.jpeg',
    '603': '/Featured-sections-images/Featured Equipments Rentals/3 - Tower Crane.jpeg',
    '604': '/Featured-sections-images/Featured Equipments Rentals/4 - Road Roller.jpeg'
  };

  // Mock data for featured dealers with local images
  const featuredDealers = [
    {
      id: 501,
      name: 'Shreeji Hardware',
      category: 'Building Materials',
      rating: 4.7,
      reviewCount: 128,
      address: 'Gat No. 45, Mumbai-Pune Highway, Kamshet',
      image: dealerImageMap['501'],
      phone: '+91 9876543210',
      products: ['Cement', 'Steel', 'Bricks', 'Tiles']
    },
    {
      id: 502,
      name: 'Puneet Electricals',
      category: 'Electrical',
      rating: 4.5,
      reviewCount: 86,
      address: 'Shop No. 12, Market Yard, Kamshet',
      image: dealerImageMap['502'],
      phone: '+91 9876543211',
      products: ['Wires', 'Switches', 'Fans', 'Lights']
    },
    {
      id: 503,
      name: 'Green Valley Paints',
      category: 'Paints',
      rating: 4.6,
      reviewCount: 94,
      address: 'Near Bus Stand, Kamshet',
      image: dealerImageMap['503'],
      phone: '+91 9876543212',
      products: ['Emulsion', 'Enamel', 'Primer', 'Textures']
    },
    {
      id: 504,
      name: 'Kamshet Plumbing Mart',
      category: 'Plumbing',
      rating: 4.4,
      reviewCount: 75,
      address: 'Opp. SBI Bank, Kamshet',
      image: dealerImageMap['504'],
      phone: '+91 9876543213',
      products: ['Pipes', 'Fittings', 'Taps', 'Sanitaryware']
    }
  ];

  // Mock data for featured rentals with local images
  const featuredRentals = [
    {
      id: 601,
      name: 'JCB 3DX',
      category: 'Excavator',
      rate: '₹25,000/day',
      rating: 4.8,
      reviewCount: 156,
      image: rentalImageMap['601'],
      owner: 'Mohan Construction',
      location: 'Kamshet',
      features: ['40 HP', '1.2 cum Bucket', 'Diesel']
    },
    {
      id: 602,
      name: 'Concrete Mixer',
      category: 'Concrete Equipment',
      rate: '₹1,500/day',
      rating: 4.5,
      reviewCount: 89,
      image: rentalImageMap['602'],
      owner: 'Shivam Rentals',
      location: 'Lonavala',
      features: ['10/7 CFT', 'Diesel Engine', 'Trolley Mounted']
    },
    {
      id: 603,
      name: 'Tower Crane',
      category: 'Heavy Lifting',
      rate: '₹45,000/day',
      rating: 4.9,
      reviewCount: 203,
      image: rentalImageMap['603'],
      owner: 'Skyline Constructions',
      location: 'Pune',
      features: ['50m Height', '8 Ton Capacity', 'Operator Included']
    },
    {
      id: 604,
      name: 'Road Roller',
      category: 'Compaction',
      rate: '₹15,000/day',
      rating: 4.6,
      reviewCount: 112,
      image: rentalImageMap['604'],
      owner: 'Mahaveer Infra',
      location: 'Kamshet',
      features: ['10 Ton', 'Vibratory', 'Diesel']
    }
  ];

  // Map contractor IDs to their corresponding local images
  const contractorImageMap: Record<string, string> = {
    '1': '/Featured-sections-images/Featured Contractors/1- Rajesh Sharma.png',
    '2': '/Featured-sections-images/Featured Contractors/2- Vikram Patel.png',
    '3': '/Featured-sections-images/Featured Contractors/3- Arjun Mehta.png',
    '4': '/Featured-sections-images/Featured Contractors/4- Ravi Verma.png',
    '5': '/Featured-sections-images/Featured Contractors/5- Sanjay Gupta.png'
  };


  // Fetch featured contractors and architects
  const { data: featuredContractorsData = [], isLoading: loadingContractors } = useFeaturedProfessionals('contractor', 5);
  const { data: featuredArchitectsData = [], isLoading: loadingArchitects } = useFeaturedProfessionals('architect', 5);
  
  // Map the data to include local images - Ensure data is always an array
  const featuredContractors = Array.isArray(featuredContractorsData) 
    ? featuredContractorsData.map(contractor => ({
        ...contractor,
        profileImage: contractorImageMap[contractor.id] || contractor.profileImage
      }))
    : [];
  
  const featuredArchitects = Array.isArray(featuredArchitectsData)
    ? featuredArchitectsData.map(architect => ({
        ...architect,
        profileImage: architectImageMap[architect.id] || architect.profileImage
      }))
    : [];
  
  // Debug logs
  useEffect(() => {
    console.log('Featured Contractors:', featuredContractors);
    console.log('Featured Architects:', featuredArchitects);
  }, [featuredContractors, featuredArchitects]);
  
  // Loading skeleton for professionals
  const ProfessionalSkeleton = () => (
    <div className="flex flex-col space-y-3 p-4 bg-gray-800 rounded-lg">
      <div className="w-full h-48 bg-gray-700 rounded-lg animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
      <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse"></div>
    </div>
  );

  // Loading state for carousel items
  const renderLoadingSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <CarouselItem key={`skeleton-${index}`} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
        <ProfessionalSkeleton />
      </CarouselItem>
    ));
  };

  // Add animation effect for elements
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.fade-in, .scale-in');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fadeIn');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    // Initial check
    animateOnScroll();
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Helmet>
        <title>KARAGIRX - Build Smart Build With KARAGIRX</title>
        <meta name="description" content="Connect with trusted contractors and architects in Kamshet for your construction and design needs" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .fade-in {
              animation: fadeIn 0.6s ease-out forwards;
            }
            .glow-text {
              color: #00FFFF;
              font-size: 1.75rem;
              font-weight: bold;
              position: relative;
              display: inline-block;
              padding: 0 15px;
              animation: neonPulse 1.5s ease-in-out infinite alternate;
            }
            @keyframes neonPulse {
              from {
                text-shadow:
                  0 0 5px #00FFFF,
                  0 0 10px #00FFFF,
                  0 0 15px #00FFFF;
              }
              to {
                text-shadow:
                  0 0 10px #00FFFF,
                  0 0 20px #00FFFF,
                  0 0 30px #00FFFF,
                  0 0 40px #00FFFF;
              }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .scale-in {
              animation: scaleIn 0.5s ease-out forwards;
              opacity: 0;
              transform-origin: center;
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `
        }} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden text-white h-[70vh] min-h-[500px] sm:h-[60vh] sm:min-h-[400px] bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="/Hero-Section-image/house.png"
              alt="Modern house"
              className="w-full h-full object-cover scale-110 opacity-90"
              style={{
                transform: 'scale(1.1) translateY(-5%)',
                transformOrigin: 'center',
                minHeight: '100%',
                minWidth: '100%',
                width: 'auto',
                height: 'auto',
                filter: 'brightness(1.0) contrast(1.1)'
              }}
              onError={(e) => {
                console.error('Error loading image:', e.currentTarget.src);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-20 h-full flex items-center">
          <div className="w-full max-w-2xl fade-in" style={{ opacity: 0 }}>
            <div className="mb-3 sm:mb-4">
              <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-wider text-blue-100 bg-blue-800/80 rounded-full backdrop-blur-sm">
                BUILDING DREAMS, DELIVERING EXCELLENCE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-white">
              Find the Perfect <span className="text-blue-200">Professional</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4 sm:mb-6 max-w-xl">
              Connect with trusted contractors and architects in Pune. Quality construction and design solutions tailored to your vision.
            </p>
            <div className="w-full max-w-lg transform transition-all duration-300 fade-in" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <SearchBar className="shadow-xl w-full" />
            </div>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 fade-in" style={{ opacity: 0, animationDelay: '0.3s' }}>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2"></div>
                <span className="font-medium text-blue-50">5000+ Trusted Pros</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mr-1.5 sm:mr-2"></div>
                <span className="font-medium text-blue-50">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        
        {/* Animation styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `
        }} />
      </div>

      {/* Services Grid */}
      <section className="relative">
        <LampContainer className="pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-3">OUR SERVICES</span>
              <motion.h2 
                initial={{ opacity: 0.5, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="mt-2 bg-gradient-to-br from-blue-200 to-blue-500 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent"
              >
                Everything You Need
              </motion.h2>
              <p className="text-xs text-blue-100/70 mt-0.5">Comprehensive solutions for all your construction and design needs</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* Find Contractors */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ margin: "-100px 0px 0px 0px" }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="h-full"
            >
              <Link 
                to="/professionals?type=contractor" 
                className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-blue-500/30 h-full flex flex-col"
              >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/30 group-hover:shadow-blue-900/50 transition-all duration-500 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Find Contractors</h3>
                <p className="text-gray-300 mb-6 flex-grow">Connect with experienced contractors for your construction projects and get the best quality work.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                    Find Contractors
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>

            {/* Find Architects */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ margin: "-100px 0px 0px 0px" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="h-full"
            >
              <Link 
                to="/professionals?type=architect" 
                className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-purple-500/30 h-full flex flex-col"
              >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-900/30 group-hover:shadow-purple-900/50 transition-all duration-500 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Find Architects</h3>
                <p className="text-gray-300 mb-6 flex-grow">Discover talented architects for your dream home design and get the best quality work.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                    Explore Services
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>

            {/* Shop Materials */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ margin: "-100px 0px 0px 0px" }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="h-full"
            >
              <Link 
                to="/shop/products" 
                className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-amber-500/30 h-full flex flex-col"
              >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-500 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Shop Materials</h3>
                <p className="text-gray-300 mb-6 flex-grow">Find high-quality construction materials at competitive prices for your project needs.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                    Browse Products
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-amber-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>

            {/* Rent Equipment */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ margin: "-100px 0px 0px 0px" }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="h-full"
            >
              <Link 
                to="/onrent" 
                className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-emerald-500/30 h-full flex flex-col"
              >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/30 group-hover:shadow-emerald-900/50 transition-all duration-500 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Rent Equipment</h3>
                <p className="text-gray-300 mb-6 flex-grow">Get heavy machinery and tools on rent for your construction needs at affordable rates.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
                    View Equipment
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-emerald-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>
          </div>
        </LampContainer>
      </section>
      
      {/* Featured Contractors */}
      <section className="relative">
        <LampContainer className="pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="text-center sm:text-left mb-2 sm:mb-0">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-1">CONTRACTORS</span>
                <motion.h2 
                  initial={{ opacity: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="mt-1.5 bg-gradient-to-br from-blue-200 to-blue-500 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent"
                >
                  Featured Contractors
                </motion.h2>
                <p className="text-xs text-blue-100/70 mt-0.5">Connect with top-rated professionals</p>
              </div>
              <Link 
                to="/professionals?type=contractor" 
                className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all contractors
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          
            <div className="relative mt-1">
              <div className="overflow-hidden">
                <Carousel
                  opts={{
                    align: 'start',
                    loop: true,
                    slidesToScroll: 1,
                  }}
                  plugins={[autoplayPlugin.current]}
                  className="w-full relative overflow-visible"
                  setApi={setContractorApi}
                >
                  <CarouselContent className="py-2 -mx-2 sm:-ml-2">
                    {loadingContractors ? (
                      renderLoadingSkeletons(4)
                    ) : featuredContractors.length > 0 ? (
                      featuredContractors.map((contractor, index) => (
                        <CarouselItem key={contractor.id} className="px-2 sm:pl-2 basis-[280px] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                          <div 
                            className={`block transition-all duration-300 ${
                              contractorCurrent === index ? 'scale-100' : 'scale-95 opacity-90 hover:opacity-100 hover:scale-[0.98]'
                            }`}
                          >
                            <div className="relative h-full">
                              <ProfessionalCard 
                                professional={{
                                  ...contractor,
                                  profileImage: contractorImageMap[contractor.id] || contractor.profileImage
                                }}
                                portfolioImages={contractorImageMap[contractor.id] ? [contractorImageMap[contractor.id]] : (contractor.profileImage ? [contractor.profileImage] : [])}
                                priceRange={priceRanges[contractor.id] || 'Contact for pricing'}
                                isActive={contractorCurrent === index}
                                className="h-full"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-400">
                        No featured contractors available at the moment.
                      </div>
                    )}
                  </CarouselContent>
                  <div className="absolute right-4 -top-12 hidden sm:flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); contractorApi?.scrollPrev(); }}
                      disabled={contractorCurrent === 0}
                      className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); contractorApi?.scrollNext(); }}
                      disabled={contractorCurrent === featuredContractors.length - 1}
                      className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </Carousel>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {featuredContractors.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => contractorApi?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === contractorCurrent ? 'bg-blue-400 w-6' : 'bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LampContainer>
      </section>
      

      {/* Featured Architects */}
      <section className="relative overflow-visible">
        <LampContainer className="pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="text-center sm:text-left mb-3 sm:mb-0">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-purple-400 bg-purple-900/30 rounded-full mb-1.5">ARCHITECTS</span>
                <motion.h2 
                  initial={{ opacity: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="mt-1.5 bg-gradient-to-br from-purple-200 to-purple-500 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent"
                >
                  Featured Architects
                </motion.h2>
                <p className="text-xs text-purple-100/70 mt-0.5">Discover talented Architects to bring your vision to life</p>
              </div>
              <Link 
                to="/professionals?type=architect" 
                className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all architects
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <Carousel
                  opts={{
                    align: 'start',
                    loop: true,
                    slidesToScroll: 1,
                  }}
                  plugins={[autoplayPlugin.current]}
                  className="w-full relative overflow-visible"
                  setApi={setArchitectApi}
                >
                  <CarouselContent className="py-2 -mx-2 sm:-ml-2">
                    {loadingArchitects ? (
                      renderLoadingSkeletons(4)
                    ) : featuredArchitects.length > 0 ? (
                      featuredArchitects.map((architect, index) => (
                        <CarouselItem key={architect.id} className="px-2 sm:pl-2 basis-[280px] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                          <div 
                            className={`block transition-all duration-300 ${
                              architectCurrent === index ? 'scale-100' : 'scale-95 opacity-90 hover:opacity-100 hover:scale-[0.98]'
                            }`}
                          >
                            <div className="relative h-full">
                              <ProfessionalCard 
                                professional={{
                                  ...architect,
                                  profileImage: architectImageMap[architect.id] || architect.profileImage
                                }}
                                portfolioImages={architectImageMap[architect.id] ? [architectImageMap[architect.id]] : (architect.profileImage ? [architect.profileImage] : [])}
                                priceRange={priceRanges[architect.id] || 'Contact for pricing'}
                                isActive={architectCurrent === index}
                                className="h-full"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-400">
                        No featured architects available at the moment.
                      </div>
                    )}
                  </CarouselContent>
                  <div className="absolute right-4 -top-12 hidden sm:flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); architectApi?.scrollPrev(); }}
                      disabled={architectCurrent === 0}
                      className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); architectApi?.scrollNext(); }}
                      disabled={architectCurrent === featuredArchitects.length - 1}
                      className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </Carousel>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {featuredArchitects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => architectApi?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === architectCurrent ? 'bg-purple-400 w-6' : 'bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LampContainer>
      </section>
      
      {/* Featured Dealers */}
      <section className="relative overflow-visible" style={{ zIndex: 1 }}>
        <LampContainer className="pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="text-center sm:text-left mb-3 sm:mb-0">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-emerald-400 bg-emerald-900/30 rounded-full mb-1.5">DEALERS</span>
                <motion.h2 
                  initial={{ opacity: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="mt-1.5 bg-gradient-to-br from-emerald-200 to-emerald-500 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent"
                >
                  Featured Dealers
                </motion.h2>
                <p className="text-xs text-emerald-100/70 mt-0.5">Find trusted suppliers for your construction needs</p>
              </div>
              <Link 
                to="/dealers" 
                className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View all dealers
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="overflow-hidden">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                  slidesToScroll: 1,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full relative overflow-visible"
                setApi={setDealerApi}
              >
                <CarouselContent className="py-2 -mx-2 sm:-ml-2">
                  {featuredDealers.map((dealer, index) => (
                    <CarouselItem key={dealer.id} className="px-2 sm:pl-2 basis-[280px] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <Link 
                        to={`/dealers/${dealer.id}`} 
                        className="group block h-full"
                      >
                        <div 
                          className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-colors h-full flex flex-col group-hover:shadow-lg group-hover:shadow-blue-500/20"
                        >
                          <div className="relative h-36 bg-gray-700 overflow-hidden">
                            <img 
                              src={dealer.image} 
                              alt={dealer.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-dealer.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-2 left-2 flex items-center bg-black/60 px-2 py-1 rounded">
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="ml-1 text-white text-xs">{dealer.rating}</span>
                              <span className="mx-1 text-gray-400 text-xs">•</span>
                              <span className="text-gray-300 text-xs">{dealer.reviewCount} reviews</span>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{dealer.name}</h3>
                            <p className="text-blue-400 text-sm mb-2">{dealer.category}</p>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{dealer.address}</p>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {dealer.products.slice(0, 3).map((product, i) => (
                                <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                  {product}
                                </span>
                              ))}
                              {dealer.products.length > 3 && (
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                  +{dealer.products.length - 3} more
                                </span>
                              )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end">
                              <span className="text-white bg-blue-600 group-hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                View Profile
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                  {featuredDealers.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-400">
                      No featured dealers available at the moment.
                    </div>
                  )}
                </CarouselContent>
                <div className="absolute right-4 -top-12 hidden sm:flex items-center space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); dealerApi?.scrollPrev(); }}
                    disabled={dealerCurrent === 0}
                    className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); dealerApi?.scrollNext(); }}
                    disabled={dealerCurrent === featuredDealers.length - 1}
                    className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </Carousel>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {featuredDealers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => dealerApi?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === dealerCurrent ? 'bg-emerald-400 w-6' : 'bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </LampContainer>
      </section>

      {/* Featured Rentals */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900/90 via-gray-800/80 to-gray-900/90">
        <LampContainer className="pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="text-center sm:text-left mb-3 sm:mb-0">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-green-400 bg-green-900/30 rounded-full mb-1.5">RENTALS</span>
                <motion.h2 
                  initial={{ opacity: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="mt-1.5 bg-gradient-to-br from-green-200 to-green-500 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent"
                >
                  Featured Equipment Rentals
                </motion.h2>
                <p className="text-xs text-green-100/70 mt-0.5">Quality construction equipment for your project needs</p>
              </div>
              <Link 
                to="/onrent" 
                className="inline-flex items-center text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
              >
                View all rentals
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="overflow-hidden">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                  slidesToScroll: 1,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full relative overflow-visible"
                setApi={setRentalApi}
              >
                <CarouselContent className="py-2 -mx-2 sm:-ml-2">
                  {featuredRentals.map((rental, index) => (
                    <CarouselItem key={rental.id} className="px-2 sm:pl-2 basis-[280px] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <Link 
                        to={`/onrent/equipment/${rental.id}`} 
                        className="group block h-full"
                      >
                        <div className={`transition-all duration-300 h-full ${
                          rentalCurrent === index ? 'scale-100' : 'scale-95 opacity-90 group-hover:opacity-100 group-hover:scale-[0.98]'
                        }`}>
                          <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl overflow-hidden h-full flex flex-col border border-gray-700/50 group-hover:border-green-500/50 transition-colors group-hover:shadow-lg group-hover:shadow-green-500/20">
                            <div className="relative h-40 bg-gray-800 overflow-hidden">
                              <img 
                                src={rental.image} 
                                alt={rental.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                                {rental.rate}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">{rental.name}</h3>
                                  <p className="text-green-400 text-sm">{rental.category}</p>
                                </div>
                                <div className="flex items-center bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded">
                                  <span>★</span>
                                  <span className="ml-1">{rental.rating}</span>
                                  <span className="mx-1">•</span>
                                  <span>{rental.reviewCount}</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className="text-gray-400 text-sm flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {rental.location}
                                </p>
                                <p className="text-gray-400 text-sm mt-1 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  {rental.owner}
                                </p>
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                  {rental.features.map((feature, i) => (
                                    <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end">
                                <span className="text-white bg-green-600 group-hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                  View Profile
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute right-4 -top-12 hidden sm:flex items-center space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); rentalApi?.scrollPrev(); }}
                    disabled={rentalCurrent === 0}
                    className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); rentalApi?.scrollNext(); }}
                    disabled={rentalCurrent === featuredRentals.length - 1}
                    className="p-1.5 rounded-full bg-white/10 border border-gray-600 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </Carousel>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {featuredRentals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => rentalApi?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === rentalCurrent ? 'bg-green-600 w-6' : 'bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </LampContainer>
      </section>
      
      {/* Why Choose Us */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-gray-900 via-gray-800/80 to-gray-900/90">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-3">WHY CHOOSE US</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-200 mb-3">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                KARAGIRX
              </span>
            </h2>
            <p className="text-blue-100/80 max-w-3xl mx-auto text-sm sm:text-base mb-8">
              We connect you with the best local construction professionals to bring your project to life
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <motion.div 
                className="relative group bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg hover:shadow-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-600/30 to-blue-900/40 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-md shadow-blue-500/20">
                    <UserCheck className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Verified Professionals</h3>
                  <p className="text-blue-100/70 text-sm">
                    All contractors and architects on our platform are thoroughly verified for quality and reliability.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg hover:shadow-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-600/30 to-blue-900/40 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-md shadow-blue-500/20">
                    <DollarSign className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Transparent Pricing</h3>
                  <p className="text-blue-100/70 text-sm">
                    Get clear estimates upfront so you can budget effectively for your construction project.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg hover:shadow-blue-500/20 sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-600/30 to-blue-900/40 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-md shadow-blue-500/20">
                    <HomeIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Local Expertise</h3>
                  <p className="text-blue-100/70 text-sm">
                    Our professionals understand Pune's terrain, regulations, and building styles.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Homepage Internal Footer */}
      <footer className="relative pt-4 pb-12 bg-gradient-to-b from-gray-900/90 via-gray-900 to-gray-950 overflow-hidden -mt-4">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 relative">
                <span className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-200"></span>
                KARAGIRX
              </span>
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto text-sm sm:text-base mb-8">
              Building Dreams, Delivering Excellence - Your Trusted Construction Partner
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-xs sm:text-sm text-blue-100/60">
              &copy; {new Date().getFullYear()} KARAGIRX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
