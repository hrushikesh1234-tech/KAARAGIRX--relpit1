import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LikedItemsProvider } from "@/contexts/LikedItemsContext";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/contexts/CartContext";
import { ErrorBoundary } from 'react-error-boundary';
// Import Lucide icons
import { Loader2, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";

// Create a client
const queryClient = new QueryClient();

// Lazy load page components
const NotFound = lazy(() => import("@/pages/not-found"));
const Header = lazy(() => import("@/components/Header"));
const MobileToolbar = lazy(() => import("@/components/MobileToolbar"));
const NotificationsNT = lazy(() => import("./pages/Notification/notifications-nt"));

// Shop Components
const Index2S = lazy(() => import("@/pages/shop/Index2S"));
const Shop2S = lazy(() => import("@/pages/shop/Shop2S"));
const MaterialsListingPage2S = lazy(() => import("@/pages/shop/MaterialsListingPage2S"));
const DealerProfile2S = lazy(() => import("@/pages/shop/DealerProfile2S"));
const MaterialDetailsPage2S = lazy(() => import("@/pages/shop/MaterialDetailsPage2S"));
const BuyNowRequest = lazy(() => import("@/pages/shop/BuyNowRequest2S"));
const TrackOrderToolbar = lazy(() => import("@/pages/shop/TrackOrder-toolbar2S"));
const TrackOrder = lazy(() => import("@/pages/shop/TrackOrder2S"));
const OrderDetailsPage = lazy(() => import("@/pages/shop/OrderDetailsPage2S"));
const Cart = lazy(() => import("@/pages/shop/Cart2S"));
const LikedItems = lazy(() => import("@/pages/shop/LikedItems2S"));

// Rental Pages
const OnRentPage = lazy(() => import("@/pages/onrent/OnRentOR"));
const CategoryPageOR = lazy(() => import("@/pages/onrent/CategoryPageOR"));
const EquipmentDetailsOR = lazy(() => import("@/pages/onrent/EquipmentDetailsOR"));
const BookingPageOR = lazy(() => import("@/pages/onrent/BookingPageOR"));
const BookedOR = lazy(() => import("@/pages/onrent/BookedOR"));
const BookingsListOR = lazy(() => import("@/pages/onrent/BookingsListOR"));

// Other Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfileDashboard = lazy(() => import("@/pages/Profile-Dashboard/Index"));
const ProfessionalsListingPage = lazy(() => import("@/pages/ProfessionalsListingPage"));
const PublicProfessionalProfile = lazy(() => import("@/pages/PublicProfessionalProfile"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const AboutUsPage = lazy(() => import("@/pages/AboutUsPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const BookmarkedPage = lazy(() => import("@/pages/Bookmarked/BookmarkedBK"));
const ProfessionalProfilePage = lazy(() => import("@/pages/ProfessionalProfilePage"));
const ProjectPage = lazy(() => import("@/pages/ProjectPage"));

// Message Pages
const MessagesPageME = lazy(() => import("./pages/messages/IndexME"));
const ConversationsListME = lazy(() => import("./pages/messages/conversationsME"));
const NewMessageME = lazy(() => import("./pages/messages/new-messageME"));
const ConversationDetailME = lazy(() => import("./pages/messages/conversation-detailME"));

// Dashboard Pages
const MaterialDealerDashboard = lazy(() => import("@/pages/dealer-dashboard/MaterialDealerDashboard"));
const RentalMerchantDashboard = lazy(() => import("@/pages/rental-dashboard/RentalMerchantDashboard"));
const CustomerDashboard = lazy(() => import("@/pages/customer-dashboard/CustomerDashboard"));
const CustomerEditProfile = lazy(() => import("@/pages/customer-dashboard/CustomerEditProfile"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard/AdminDashboard"));

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void 
}) {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
    resetErrorBoundary();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <div className="bg-red-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
        <p className="text-red-600 mb-4">{error.message}</p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={resetErrorBoundary}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            Try again
          </Button>
          <Button
            onClick={handleGoHome}
            className="bg-primary hover:bg-primary/90"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <ErrorBoundary
      onError={(error: Error) => {
        console.error('Error caught by error boundary:', error);
      }}
      fallbackRender={({ resetErrorBoundary, error }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      resetKeys={[location.key]}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <ScrollToTop />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Shop Routes */}
          <Route path="/shop" element={<Index2S />} />
          <Route path="/shop/products" element={<Shop2S />} />
          <Route path="/shop/dealers" element={<MaterialsListingPage2S />} />
          <Route path="/shop/dealers/category/:category" element={<MaterialsListingPage2S />} />
          <Route path="/buy-now/:dealerId" element={<BuyNowRequest />} />
          <Route path="/track" element={<TrackOrderToolbar />} />
          <Route path="/track-order" element={<TrackOrderToolbar />} />
          <Route path="/track-order-old" element={<TrackOrder />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/liked-items" element={<LikedItems />} />
          
          {/* Materials */}
          <Route path="/dealers" element={<MaterialsListingPage2S />} />
          <Route path="/dealers/category/:category" element={<MaterialsListingPage2S />} />
          <Route path="/material/:materialId" element={<MaterialDetailsPage2S />} />
          <Route path="/dealers/:dealerId" element={<DealerProfile2S />} />
          <Route path="/dealer/:dealerId" element={<DealerProfile2S />} />
          <Route path="/dealer-profile/:dealerId" element={<DealerProfile2S />} />
          
          {/* Professionals */}
          <Route path="/professionals" element={<ProfessionalsListingPage />} />
          <Route path="/professionals/:id" element={<PublicProfessionalProfile />} />
          <Route path="/projects/:id/:professionalId" element={<ProjectPage />} />
          
          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rental Routes */}
          <Route path="/onrent" element={<><ScrollToTop /><OnRentPage /></>} />
          <Route path="/onrent/category/:categoryId" element={<><ScrollToTop /><CategoryPageOR /></>} />
          <Route path="/onrent/equipment/:equipmentId" element={<><ScrollToTop /><EquipmentDetailsOR /></>} />
          <Route path="/onrent/booking/:equipmentId" element={<><ScrollToTop /><BookingPageOR /></>} />
          <Route path="/onrent/booked" element={<><ScrollToTop /><BookedOR /></>} />
          <Route path="/onrent/bookings" element={<><ScrollToTop /><BookingsListOR /></>} />
          <Route path="/rental-merchant/:merchantId" element={<><ScrollToTop /><RentalMerchantDashboard /></>} />

          {/* Static Pages */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          
          {/* User Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile-dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProfileDashboard />
            </Suspense>
          } />
          <Route path="/bookmarked" element={
            <Suspense fallback={<LoadingSpinner />}>
              <BookmarkedPage />
            </Suspense>
          } />
          <Route path="/notifications" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationsNT />
            </Suspense>
          } />
          
          {/* Messages Route */}
          <Route path="/messages" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MessagesPageME />
            </Suspense>
          } />
          
          {/* Redirect old dashboard messages route */}
          <Route path="/dashboard/messages" element={
            <Navigate to="/messages" replace />
          } />
          
          {/* Dashboard Routes */}
          <Route path="/customer/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CustomerDashboard />
            </Suspense>
          } />
          <Route path="/profile/edit" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CustomerEditProfile />
            </Suspense>
          } />
          <Route path="/dealer/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MaterialDealerDashboard />
            </Suspense>
          } />
          <Route path="/rental/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <RentalMerchantDashboard />
            </Suspense>
          } />
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <main className="flex-1 pb-16">
          <AppRoutes />
        </main>
        <MobileToolbar />
      </Suspense>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
