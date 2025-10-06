import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Calendar, 
  Bell, 
  Edit, 
  Trash2, 
  ShoppingCart, 
  Eye, 
  MapPin,
  Phone,
  Mail,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface Notification {
  id: number;
  userId: number;
  type: "order" | "booking" | "system" | "message";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface UserStats {
  totalOrders: number;
  totalBookings: number;
  pendingOrders: number;
  pendingBookings: number;
}

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalBookings: 0,
    pendingOrders: 0,
    pendingBookings: 0
  });

  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [bookingFilter, setBookingFilter] = useState<string>("all");

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
        fetchWishlist(),
        fetchOrders(),
        fetchBookings(),
        fetchNotifications()
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/wishlist/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/orders/user/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        calculateStats(data, bookings);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/bookings/user/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        calculateStats(orders, data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/notifications/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const calculateStats = (ordersData: Order[], bookingsData: Booking[]) => {
    setStats({
      totalOrders: ordersData.length,
      totalBookings: bookingsData.length,
      pendingOrders: ordersData.filter(o => o.status === "pending").length,
      pendingBookings: bookingsData.filter(b => b.status === "pending").length
    });
  };

  const removeFromWishlist = async (itemId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/wishlist/${itemId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item removed from wishlist."
        });
        fetchWishlist();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/notifications/${notificationId}/read`, {
        method: "PUT",
        credentials: "include"
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/notifications/user/${user?.id}/read-all`, {
        method: "PUT",
        credentials: "include"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "All notifications marked as read."
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification deleted."
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      pending: { variant: "outline", className: "bg-yellow-50 text-yellow-700 border-yellow-300" },
      approved: { variant: "default", className: "bg-blue-50 text-blue-700 border-blue-300" },
      rejected: { variant: "destructive", className: "bg-red-50 text-red-700 border-red-300" },
      delivered: { variant: "default", className: "bg-green-50 text-green-700 border-green-300" },
      completed: { variant: "default", className: "bg-green-50 text-green-700 border-green-300" }
    };

    const config = statusConfig[status] || { variant: "outline" as const, className: "" };
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-blue-600" />;
      case "booking":
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case "message":
        return <Mail className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredOrders = orderFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === orderFilter);

  const filteredBookings = bookingFilter === "all"
    ? bookings
    : bookings.filter(booking => booking.status === bookingFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, orders, bookings, and more</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user?.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{user?.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600">Total Orders</p>
                          <p className="text-2xl font-bold text-blue-700">{stats.totalOrders}</p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600">Total Bookings</p>
                          <p className="text-2xl font-bold text-purple-700">{stats.totalBookings}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600">Pending Actions</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {stats.pendingOrders + stats.pendingBookings}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button onClick={() => navigate("/profile")} className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Items you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <img 
                        src={item.itemImage} 
                        alt={item.itemName}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.itemName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Supplier: {item.supplierName}
                        </p>
                        <p className="text-lg font-bold text-primary mb-4">
                          ₹{item.itemPrice.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          {item.itemType === "material" ? (
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => navigate(`/dealer/${item.supplierId}`)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => navigate(`/onrent/booking/${item.itemId}`)}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Book Now
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Material Orders</CardTitle>
                  <CardDescription>Track and manage your orders</CardDescription>
                </div>
                <Select value={orderFilter} onValueChange={setOrderFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>{order.dealerName}</TableCell>
                          <TableCell>{order.productName}</TableCell>
                          <TableCell>₹{order.total.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/order/${order.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status === "approved" && (
                                <Button 
                                  size="sm"
                                  onClick={() => navigate(`/track-order?orderId=${order.id}`)}
                                >
                                  <MapPin className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipment Bookings</CardTitle>
                  <CardDescription>Manage your rental bookings</CardDescription>
                </div>
                <Select value={bookingFilter} onValueChange={setBookingFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Rental Period</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">#{booking.id}</TableCell>
                          <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{booking.equipmentName}</TableCell>
                          <TableCell>
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            <span className="text-sm text-muted-foreground ml-2">
                              ({booking.totalDays} days)
                            </span>
                          </TableCell>
                          <TableCell>₹{booking.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/onrent/equipment/${booking.equipmentId}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated with your activity</CardDescription>
                </div>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
