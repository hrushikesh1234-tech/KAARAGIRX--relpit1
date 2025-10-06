import { useState } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../hooks/useBookmarks";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Replaced lucide-react icons with emoji placeholders
const Heart = ({ className = '' }: { className?: string }) => (
  <span className={className}>❤️</span>
);

const BookmarkedProfessionalsPage = () => {
  const { data: bookmarks, isLoading, isError } = useBookmarks();
  const [activeTab, setActiveTab] = useState<string>("contractors");
  
  // Filter bookmarks by profession
  const contractors = bookmarks?.filter(b => b.professional.profession === "contractor") || [];
  const architects = bookmarks?.filter(b => b.professional.profession === "architect") || [];
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Empty state when no bookmarks
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Heart className="text-3xl text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No bookmarked professionals yet</h2>
      <p className="text-gray-600 mb-6">Start exploring and bookmark contractors or architects you're interested in.</p>
      <Link to="/professionals" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded font-medium hover:bg-primary-dark transition">
        Find Professionals
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Bookmarked Professionals</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500">Error loading bookmarks. Please try again later.</p>
        </div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <Tabs defaultValue="contractors" onValueChange={handleTabChange}>
          <TabsList className="mb-6 border-b w-full justify-start rounded-none">
            <TabsTrigger 
              value="contractors" 
              className={`px-6 py-3 rounded-none ${activeTab === "contractors" ? "border-b-2 border-primary" : ""}`}
            >
              Contractors ({contractors.length})
            </TabsTrigger>
            <TabsTrigger 
              value="architects" 
              className={`px-6 py-3 rounded-none ${activeTab === "architects" ? "border-b-2 border-primary" : ""}`}
            >
              Architects ({architects.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contractors">
            {contractors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contractors.map((bookmark) => (
                  <ProfessionalCard 
                    key={bookmark.bookmarkId} 
                    professional={bookmark.professional}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No contractors have been bookmarked yet.</p>
                <Link to="/professionals?profession=contractor" className="text-primary font-medium mt-2 inline-block hover:underline">
                  Browse Contractors
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="architects">
            {architects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {architects.map((bookmark) => (
                  <ProfessionalCard 
                    key={bookmark.bookmarkId} 
                    professional={bookmark.professional}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No architects have been bookmarked yet.</p>
                <Link to="/professionals?profession=architect" className="text-primary font-medium mt-2 inline-block hover:underline">
                  Browse Architects
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <EmptyState />
        </div>
      )}
    </div>
  );
};

export default BookmarkedProfessionalsPage;
