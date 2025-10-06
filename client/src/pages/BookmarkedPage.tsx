import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import ProfessionalCard from "../components/ProfessionalCard";

import { Professional } from "../lib/types";

// Sample data for demonstration purposes
const sampleContractors: Professional[] = [
  {
    id: 1,
    userId: 1,
    fullName: "Rajesh Sharma",
    companyName: "Sharma Constructions",
    address: "123 Main St, Kamshet",
    pincode: "410405",
    phone: "9876543210",
    profession: "contractor",
    experience: 12,
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    about: "Experienced contractor specializing in residential buildings",
    rating: 4.8,
    reviewCount: 32,
    location: "Kamshet",
    specializations: ["Residential Construction", "Renovations"],
  },
  {
    id: 2,
    userId: 2,
    fullName: "Ahij Kumar",
    companyName: "Alakrcasana Developers",
    address: "456 Park Ave, Kamshet",
    pincode: "410405",
    phone: "9876543211",
    profession: "contractor",
    experience: 8,
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    about: "Specialized in modern residential construction",
    rating: 4.7,
    reviewCount: 27,
    location: "Rivertown",
    specializations: ["Residential Construction", "Commercial Buildings"],
  },
];

const sampleArchitects: Professional[] = [
  {
    id: 3,
    userId: 3,
    fullName: "Poala Mehta",
    companyName: "Menta Design",
    address: "789 Design Blvd, Kamshet",
    pincode: "410405",
    phone: "9876543212",
    profession: "architect",
    experience: 15,
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    about: "Award-winning architect with a focus on sustainable design",
    rating: 4.9,
    reviewCount: 41,
    location: "Kamshet",
    specializations: ["Eco-friendly Construction", "Residential Design"],
  },
  {
    id: 4,
    userId: 4,
    fullName: "Vinay Pillai",
    companyName: "Pillai Studio",
    address: "101 Creative St, Kamshet",
    pincode: "410405",
    phone: "9876543213",
    profession: "architect",
    experience: 10,
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    about: "Innovative architect focusing on blending tradition with modernity",
    rating: 4.6,
    reviewCount: 23,
    location: "Season Associates",
    specializations: ["Residential Design", "Commercial Buildings"],
  },
];

const BookmarkedPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="bg-gray-50 py-12">
      <Helmet>
        <title>Bookmarked Professionals | Kamshet.Build</title>
        <meta name="description" content="View your bookmarked contractors and architects on Kamshet.Build" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bookmarked Professionals</h1>
            <p className="text-gray-600 mt-1">
              Your saved contractors and architects
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate("/professionals")} type="button">
              Browse All Professionals
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="contractors">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="contractors">Contractors</TabsTrigger>
              <TabsTrigger value="architects">Architects</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="contractors">
            <div className="space-y-6">
              {sampleContractors.map(contractor => (
                <ProfessionalCard key={contractor.id} professional={contractor} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="architects">
            <div className="space-y-6">
              {sampleArchitects.map(architect => (
                <ProfessionalCard key={architect.id} professional={architect} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookmarkedPage;