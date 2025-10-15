import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Package, Calendar, Users, ShoppingCart, 
  Check, X, Eye, TrendingUp, Phone, UserCheck 
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
  dealerPhone?: string;
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
  dealerConfirmed?: boolean;
  customerConfirmed?: boolean;
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
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalProfessionals: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrders(),
        fetchPendingOrders(),
        fetchConfirmedOrders(),
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
    return fetch(endpoint, {
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
        setStats(prev => ({ ...prev, totalOrders: data.length }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await apiRequest('/api/orders/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingOrders(data);
        setStats(prev => ({ ...prev, pendingOrders: data.length }));
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const fetchConfirmedOrders = async () => {
    try {
      const response = await apiRequest('/api/orders/confirmed');
      if (response.ok) {
        const data = await response.json();
        const confirmed = data.filter((o: Order) => o.dealerConfirmed && o.customerConfirmed);
        setConfirmedOrders(confirmed);
        setStats(prev => ({ ...prev, confirmedOrders: confirmed.length }));
      }
    } catch (error) {
      console.error("Error fetching confirmed orders:", error);
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

  const confirmFromDealer = async (orderId: string) => {
    try {
      const response = await apiRequest(`/api/orders/${orderId}/confirm-dealer`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order confirmed from dealer",
        });
        fetchAllData();
      } else {
        throw new Error('Failed to confirm order from dealer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm from dealer",
        variant: "destructive"
      });
    }
  };

  const confirmFromCustomer = async (orderId: string) => {
    try {
      const response = await apiRequest(`/api/orders/${orderId}/confirm-customer`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order confirmed from customer",
        });
        fetchAllData();
      } else {
        throw new Error('Failed to confirm order from customer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm from customer",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Order ${status} successfully`,
        });
        fetchAllData();
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
        method: 'PUT',
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-500">{stats.confirmedOrders}</span>
                <UserCheck className="h-5 w-5 text-green-500" />
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

        {/* Tabs for Pending Orders, Confirmed Orders, Bookings, Users */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Orders ({stats.pendingOrders})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed Orders ({stats.confirmedOrders})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({stats.totalBookings})</TabsTrigger>
            <TabsTrigger value="users">Users ({stats.totalUsers})</TabsTrigger>
          </TabsList>

          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders - Awaiting Dual Confirmation</CardTitle>
                <CardDescription>Confirm orders from both dealer and customer before processing</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Customer Phone</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Dealer</TableHead>
                      <TableHead>Dealer Phone</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Dealer Conf.</TableHead>
                      <TableHead>Customer Conf.</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.userName || `User #${order.userId}`}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.phone}
                          </div>
                        </TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.dealerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.dealerPhone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                          {order.dealerConfirmed ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => confirmFromDealer(order.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.customerConfirmed ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => confirmFromCustomer(order.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.dealerConfirmed && order.customerConfirmed && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'verified')}
                            >
                              Process Order
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                          No pending orders awaiting confirmation
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Confirmed Orders Tab */}
          <TabsContent value="confirmed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Orders</CardTitle>
                <CardDescription>Orders confirmed by both dealer and customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Dealer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {confirmedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.userName || `User #${order.userId}`}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.dealerName}</TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'verified')}
                              >
                                Verify
                              </Button>
                            )}
                            {order.status === 'verified' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                              >
                                Process
                              </Button>
                            )}
                            {order.status === 'processing' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                              >
                                Mark Shipped
                              </Button>
                            )}
                            {order.status === 'shipped' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {confirmedOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                          No confirmed orders yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
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
                      <TableHead>Total</TableHead>
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
                          <Badge
                            variant={
                              booking.status === 'pending' ? 'outline' :
                              booking.status === 'approved' ? 'default' :
                              'secondary'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
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
                    {bookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage platform users and professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.userType}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
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
