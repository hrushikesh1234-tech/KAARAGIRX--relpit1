import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Package, Calendar, Users, ShoppingCart, 
  Check, X, Eye, TrendingUp 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  dealerId: number;
  dealerName: string;
  productName: string;
  quantity: number;
  unit: string;
  price: string;
  total: string;
  status: string;
  orderDate: string;
  phone: string;
  address: string;
  userName?: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  userId: number;
  equipmentId: number;
  merchantId: number;
  startDate: string;
  endDate: string;
  quantity: number;
  totalCost: string;
  status: string;
  createdAt: string;
  userName?: string;
  equipmentName?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  userType: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalProfessionals: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.userType !== "admin") {
      toast({
        title: "Access Denied",
        description: "This dashboard is only accessible to administrators.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    fetchAllData();
  }, [isAuthenticated, user, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrders(),
        fetchBookings(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : `https://${window.location.hostname.split('.')[0]}-3001.${window.location.hostname.split('.').slice(1).join('.')}`;
    
    return fetch(`${baseUrl}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await apiRequest('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        const pending = data.filter((o: Order) => o.status === 'pending').length;
        setStats(prev => ({ ...prev, totalOrders: data.length, pendingOrders: pending }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await apiRequest('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        const pending = data.filter((b: Booking) => b.status === 'pending').length;
        setStats(prev => ({ ...prev, totalBookings: data.length, pendingBookings: pending }));
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiRequest('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        const professionals = data.filter((u: User) => 
          ['contractor', 'architect', 'material_dealer', 'rental_merchant'].includes(u.userType)
        ).length;
        setStats(prev => ({ ...prev, totalUsers: data.length, totalProfessionals: professionals }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Order ${status} successfully`,
        });
        fetchOrders();
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await apiRequest(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Booking ${status} successfully`,
        });
        fetchBookings();
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage orders, bookings, and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalOrders}</span>
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-500">{stats.pendingOrders}</span>
                <ShoppingCart className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalBookings}</span>
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-500">{stats.pendingBookings}</span>
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
                <Users className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalProfessionals}</span>
                <TrendingUp className="h-5 w-5 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders, Bookings, Users */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders ({stats.totalOrders})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({stats.totalBookings})</TabsTrigger>
            <TabsTrigger value="users">Users ({stats.totalUsers})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Review and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Dealer</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.userName || `User #${order.userId}`}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.dealerName}</TableCell>
                        <TableCell>{order.quantity} {order.unit}</TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'pending' ? 'secondary' : 
                            order.status === 'verified' ? 'default' : 
                            order.status === 'delivered' ? 'default' : 'secondary'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => updateOrderStatus(order.id, 'verified')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Review and manage equipment bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                        <TableCell>{booking.userName || `User #${booking.userId}`}</TableCell>
                        <TableCell>{booking.equipmentName || `Equipment #${booking.equipmentId}`}</TableCell>
                        <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{booking.totalCost}</TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'pending' ? 'secondary' : 
                            booking.status === 'approved' ? 'default' : 
                            booking.status === 'completed' ? 'default' : 'secondary'
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => updateBookingStatus(booking.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View all registered users and professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.userType === 'admin' ? 'destructive' :
                            user.userType === 'customer' ? 'secondary' : 'default'
                          }>
                            {user.userType}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
