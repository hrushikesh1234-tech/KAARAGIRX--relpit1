import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag, Calendar, Package, Eye, Layers, Plus, Edit } from "lucide-react";
import ProfileHeader from "@/components/Profile-Dashboard/ProfileHeader";
import TabNavigation from "@/components/Profile-Dashboard/TabNavigation";
import StarRating from "@/components/Profile-Dashboard/StarRating";

interface WishlistItem {
  id: number;
  userId: number;
  itemId: number;
  itemType: "material" | "equipment";
  itemName: string;
  itemImage: string;
  itemPrice: number;
  supplierName: string;
  supplierId: number;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  dealerId: number;
  dealerName: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  status: "pending" | "approved" | "rejected" | "delivered";
  orderDate: string;
  phone: string;
  address: string;
}

interface Booking {
  id: number;
  userId: number;
  equipmentId: number;
  equipmentName: string;
  equipmentImage: string;
  rentalMerchantId: number;
  rentalMerchantName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
}

interface Review {
  id: number;
  customerId: number;
  professionalId?: number;
  dealerId?: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("orders");
  
  const customerTabs = [
    { id: 'orders', label: 'My Orders' },
    { id: 'bookings', label: 'My Bookings' },
    { id: 'bookmarked', label: 'Bookmarked' },
    { id: 'about', label: 'About' }
  ];
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const totalItems = orders.length + bookings.length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.userType !== "customer") {
      toast({
        title: "Access Denied",
        description: "This dashboard is only accessible to customers.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    fetchAllData();
  }, [isAuthenticated, user, navigate]);

  const fetchAllData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await Promise.all([
        fetchOrders(),
        fetchBookings(),
        fetchReviews()
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/user/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings/user/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchReviews = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/professionals/reviews/user/${user.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleProfileImageChange = async (imageUrl: string) => {
    if (!user?.id) return;

    try {
      await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      // Reload to get updated user data
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-400",
      approved: "text-blue-400",
      delivered: "text-green-400",
      completed: "text-green-400",
      rejected: "text-red-400"
    };
    return colors[status] || "text-gray-400";
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-blue-500/20 text-blue-400",
      delivered: "bg-green-500/20 text-green-400",
      completed: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400"
    };
    return badges[status] || "bg-gray-500/20 text-gray-400";
  };

  const profileData = {
    username: user?.username || "",
    displayName: user?.fullName || "Customer",
    bio: (user as any)?.bio || "Construction Materials & Equipment Customer",
    occupation: "Customer",
    additionalInfo: (user as any)?.address || "",
    stats: {
      posts: totalItems,
      followers: 0,
      following: 0
    },
    profileImage: (user as any)?.profileImage || "/images/profiles/john smith.png",
    isLive: false
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto">
        {/* Edit Button - Top Right Corner */}
        <div className="flex justify-end px-4 pt-4 pb-2">
          <Button
            onClick={() => navigate("/profile/edit")}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <ProfileHeader 
          profileData={profileData}
          onEditProfile={() => navigate("/profile/edit")}
          averageRating={averageRating}
          reviewCount={reviews.length}
          isCustomer={true}
          isOwnProfile={true}
          onProfileImageChange={handleProfileImageChange}
        />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} customTabs={customerTabs} />

        {activeTab === "orders" && (
          <div className="px-4 py-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">My Orders</h3>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5">
                  {orders.map((order) => (
                    <div 
                      key={`order-${order.id}`}
                      className="relative w-full pb-[177.78%] bg-gray-900 overflow-hidden group cursor-pointer"
                      onClick={() => navigate(`/shop/track-order/${order.id}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 flex flex-col items-center justify-center p-2">
                        <ShoppingBag className="w-8 h-8 mb-2 text-blue-400" />
                        <p className="text-xs font-semibold text-center line-clamp-2">{order.productName}</p>
                        <p className="text-xs text-gray-400 mt-1">₹{order.total}</p>
                        <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
                        <Package className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="px-4 py-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">My Bookings</h3>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5">
                  {bookings.map((booking) => (
                    <div 
                      key={`booking-${booking.id}`}
                      className="relative w-full pb-[177.78%] bg-gray-900 overflow-hidden group cursor-pointer"
                      onClick={() => navigate(`/onrent/booked`)}
                    >
                      <div className="absolute inset-0">
                        {booking.equipmentImage ? (
                          <img 
                            src={booking.equipmentImage} 
                            alt={booking.equipmentName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-gray-900 flex flex-col items-center justify-center p-2">
                            <Calendar className="w-8 h-8 mb-2 text-purple-400" />
                            <p className="text-xs font-semibold text-center line-clamp-2">{booking.equipmentName}</p>
                            <p className="text-xs text-gray-400 mt-1">{booking.totalDays} days</p>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs font-bold line-clamp-1">{booking.equipmentName}</p>
                        <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${getStatusBadge(booking.status)} inline-block`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookmarked" && (
          <div className="px-4 py-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Bookmarked Professionals</h3>
              <div className="text-center py-12 text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No bookmarked professionals yet</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="px-4 py-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3 bg-gray-900/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Name</span>
                  <span className="font-medium">{user?.fullName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium">{user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Username</span>
                  <span className="font-medium">@{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Type</span>
                  <span className="font-medium capitalize">{user?.userType?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
              <div className="space-y-3 bg-gray-900/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Orders</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bookings</span>
                  <span className="font-medium">{bookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Orders</span>
                  <span className="font-medium">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Bookings</span>
                  <span className="font-medium">{bookings.filter(b => b.status === 'pending').length}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        <div className="h-20"></div>
      </div>
    </div>
  );
}
