import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Package, Calendar, Clock, DollarSign, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RentalEquipment {
  id: number;
  merchantId: number;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  dailyRate: string;
  weeklyRate?: string;
  monthlyRate?: string;
  securityDeposit?: string;
  quantity: number;
  available: number;
  image?: string;
  specifications?: Record<string, string>;
  condition: "excellent" | "good" | "fair";
  minRentalPeriod?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Booking {
  id: string;
  userId: number;
  equipmentId: number;
  merchantId: number;
  bookingNumber?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalCost: string;
  securityDeposit?: string;
  status: "pending" | "approved" | "active" | "completed" | "cancelled";
  paymentStatus?: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt?: string;
}

interface DashboardStats {
  totalEquipment: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

const categories = [
  "earthmoving",
  "lifting",
  "concrete",
  "road-construction",
  "transport"
];

const subcategoriesByCategory: Record<string, string[]> = {
  earthmoving: ["JCB", "Excavator", "Bulldozer", "Wheel Loader", "Motor Grader", "Mini Excavator", "Skid Steer Loader"],
  lifting: ["Tower Crane", "Mobile Crane", "Crawler Crane", "Truck Mounted Crane", "Forklift", "Rope Hoist"],
  concrete: ["Concrete Mixer", "Concrete Batching Plant", "Power Trowel"],
  "road-construction": ["Road Roller", "Asphalt Paver", "Bitumen Sprayer", "Cold Milling Machine"],
  transport: ["Dump Truck", "Container Truck", "Trailer Truck", "Mini Truck", "Cement Bulker", "Tractor"]
};

export default function RentalMerchantDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [equipment, setEquipment] = useState<RentalEquipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<RentalEquipment | null>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false);

  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    securityDeposit: "",
    quantity: "",
    available: "",
    condition: "good" as "excellent" | "good" | "fair",
    minRentalPeriod: "",
    image: "",
    specifications: "{}"
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.userType !== "rental_merchant") {
      toast({
        title: "Access Denied",
        description: "This dashboard is only accessible to rental merchants.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    fetchMerchantInfo();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (merchantId) {
      fetchEquipment();
      fetchBookings();
    }
  }, [merchantId]);

  const fetchMerchantInfo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/professionals/user/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const professional = await response.json();
        setMerchantId(professional.id);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch merchant information. Please contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching merchant info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch merchant information.",
        variant: "destructive"
      });
    }
  };

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:3001/api/rental-equipment/merchant/${merchantId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
        calculateStats(data, bookings);
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast({
        title: "Error",
        description: "Failed to fetch equipment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/bookings/merchant/${merchantId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        calculateStats(equipment, data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings.",
        variant: "destructive"
      });
    }
  };

  const calculateStats = (equipmentData: RentalEquipment[], bookingsData: Booking[]) => {
    const totalRevenue = bookingsData
      .filter(booking => booking.status !== "cancelled")
      .reduce((sum, booking) => sum + Number(booking.totalCost), 0);

    const pendingBookings = bookingsData.filter(booking => booking.status === "pending").length;

    setStats({
      totalEquipment: equipmentData.length,
      totalBookings: bookingsData.length,
      pendingBookings,
      totalRevenue
    });
  };

  const resetForm = () => {
    setEquipmentForm({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      dailyRate: "",
      weeklyRate: "",
      monthlyRate: "",
      securityDeposit: "",
      quantity: "",
      available: "",
      condition: "good",
      minRentalPeriod: "",
      image: "",
      specifications: "{}"
    });
  };

  const handleAddEquipment = async () => {
    if (!merchantId) return;

    try {
      let specifications = {};
      try {
        specifications = JSON.parse(equipmentForm.specifications);
      } catch (e) {
        toast({
          title: "Invalid Specifications",
          description: "Specifications must be valid JSON format.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("http://127.0.0.1:3001/api/rental-equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          merchantId,
          name: equipmentForm.name,
          description: equipmentForm.description,
          category: equipmentForm.category,
          subcategory: equipmentForm.subcategory,
          dailyRate: parseFloat(equipmentForm.dailyRate),
          weeklyRate: equipmentForm.weeklyRate ? parseFloat(equipmentForm.weeklyRate) : null,
          monthlyRate: equipmentForm.monthlyRate ? parseFloat(equipmentForm.monthlyRate) : null,
          securityDeposit: equipmentForm.securityDeposit ? parseFloat(equipmentForm.securityDeposit) : null,
          quantity: parseInt(equipmentForm.quantity),
          available: parseInt(equipmentForm.available),
          condition: equipmentForm.condition,
          minRentalPeriod: equipmentForm.minRentalPeriod,
          image: equipmentForm.image,
          specifications
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Equipment added successfully."
        });
        setIsAddModalOpen(false);
        resetForm();
        fetchEquipment();
      } else {
        toast({
          title: "Error",
          description: "Failed to add equipment.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast({
        title: "Error",
        description: "Failed to add equipment.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEquipment = async () => {
    if (!selectedEquipment) return;

    try {
      let specifications = {};
      try {
        specifications = JSON.parse(equipmentForm.specifications);
      } catch (e) {
        toast({
          title: "Invalid Specifications",
          description: "Specifications must be valid JSON format.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`http://127.0.0.1:3001/api/rental-equipment/${selectedEquipment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: equipmentForm.name,
          description: equipmentForm.description,
          category: equipmentForm.category,
          subcategory: equipmentForm.subcategory,
          dailyRate: parseFloat(equipmentForm.dailyRate),
          weeklyRate: equipmentForm.weeklyRate ? parseFloat(equipmentForm.weeklyRate) : null,
          monthlyRate: equipmentForm.monthlyRate ? parseFloat(equipmentForm.monthlyRate) : null,
          securityDeposit: equipmentForm.securityDeposit ? parseFloat(equipmentForm.securityDeposit) : null,
          quantity: parseInt(equipmentForm.quantity),
          available: parseInt(equipmentForm.available),
          condition: equipmentForm.condition,
          minRentalPeriod: equipmentForm.minRentalPeriod,
          image: equipmentForm.image,
          specifications
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Equipment updated successfully."
        });
        setIsEditModalOpen(false);
        setSelectedEquipment(null);
        resetForm();
        fetchEquipment();
      } else {
        toast({
          title: "Error",
          description: "Failed to update equipment.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast({
        title: "Error",
        description: "Failed to update equipment.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEquipment = async (equipmentId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/rental-equipment/${equipmentId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Equipment deleted successfully."
        });
        fetchEquipment();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete equipment.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast({
        title: "Error",
        description: "Failed to delete equipment.",
        variant: "destructive"
      });
    }
  };

  const handleEditEquipment = (eq: RentalEquipment) => {
    setSelectedEquipment(eq);
    setEquipmentForm({
      name: eq.name,
      description: eq.description || "",
      category: eq.category,
      subcategory: eq.subcategory || "",
      dailyRate: eq.dailyRate,
      weeklyRate: eq.weeklyRate || "",
      monthlyRate: eq.monthlyRate || "",
      securityDeposit: eq.securityDeposit || "",
      quantity: eq.quantity.toString(),
      available: eq.available.toString(),
      condition: eq.condition,
      minRentalPeriod: eq.minRentalPeriod || "",
      image: eq.image || "",
      specifications: JSON.stringify(eq.specifications || {}, null, 2)
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Booking ${status} successfully.`
        });
        fetchBookings();
      } else {
        toast({
          title: "Error",
          description: "Failed to update booking status.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    }
  };

  const filteredBookings = bookingStatusFilter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === bookingStatusFilter);

  const getAvailabilityStatus = (eq: RentalEquipment) => {
    if (eq.available === 0) return { label: "Rented", color: "bg-red-500" };
    if (eq.available < eq.quantity) return { label: "Partially Available", color: "bg-yellow-500" };
    return { label: "Available", color: "bg-green-500" };
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "approved": return "default";
      case "active": return "default";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rental Equipment Dashboard</h1>
          <p className="text-muted-foreground">Manage your rental equipment and bookings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">Equipment listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Equipment Management</CardTitle>
              <CardDescription>Manage your rental equipment inventory</CardDescription>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                  <DialogDescription>Fill in the details to add new rental equipment</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Equipment Name *</Label>
                    <Input
                      id="name"
                      value={equipmentForm.name}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                      placeholder="e.g., JCB 3DX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={equipmentForm.category} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value, subcategory: "" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select 
                      value={equipmentForm.subcategory} 
                      onValueChange={(value) => setEquipmentForm({ ...equipmentForm, subcategory: value })}
                      disabled={!equipmentForm.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentForm.category && subcategoriesByCategory[equipmentForm.category]?.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={equipmentForm.condition} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Daily Rate (₹) *</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      value={equipmentForm.dailyRate}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, dailyRate: e.target.value })}
                      placeholder="2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weeklyRate">Weekly Rate (₹)</Label>
                    <Input
                      id="weeklyRate"
                      type="number"
                      value={equipmentForm.weeklyRate}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, weeklyRate: e.target.value })}
                      placeholder="12000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRate">Monthly Rate (₹)</Label>
                    <Input
                      id="monthlyRate"
                      type="number"
                      value={equipmentForm.monthlyRate}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, monthlyRate: e.target.value })}
                      placeholder="45000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      value={equipmentForm.securityDeposit}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, securityDeposit: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Total Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={equipmentForm.quantity}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, quantity: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="available">Available Quantity *</Label>
                    <Input
                      id="available"
                      type="number"
                      value={equipmentForm.available}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, available: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minRentalPeriod">Min Rental Period</Label>
                    <Input
                      id="minRentalPeriod"
                      value={equipmentForm.minRentalPeriod}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, minRentalPeriod: e.target.value })}
                      placeholder="1 day"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={equipmentForm.image}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={equipmentForm.description}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                      placeholder="Detailed description of the equipment"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="specifications">Specifications (JSON format)</Label>
                    <Textarea
                      id="specifications"
                      value={equipmentForm.specifications}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, specifications: e.target.value })}
                      placeholder='{"engine": "100HP", "capacity": "1 ton"}'
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEquipment}>Add Equipment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Weekly Rate</TableHead>
                <TableHead>Monthly Rate</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No equipment found. Add your first equipment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((eq) => {
                  const availStatus = getAvailabilityStatus(eq);
                  return (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell>{eq.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{eq.condition}</Badge>
                      </TableCell>
                      <TableCell>₹{parseFloat(eq.dailyRate).toLocaleString()}</TableCell>
                      <TableCell>{eq.weeklyRate ? `₹${parseFloat(eq.weeklyRate).toLocaleString()}` : "-"}</TableCell>
                      <TableCell>{eq.monthlyRate ? `₹${parseFloat(eq.monthlyRate).toLocaleString()}` : "-"}</TableCell>
                      <TableCell>
                        <Badge className={availStatus.color}>
                          {availStatus.label} ({eq.available}/{eq.quantity})
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEquipment(eq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{eq.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEquipment(eq.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>Update equipment details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Equipment Name *</Label>
              <Input
                id="edit-name"
                value={equipmentForm.name}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                placeholder="e.g., JCB 3DX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={equipmentForm.category} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value, subcategory: "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subcategory">Subcategory</Label>
              <Select 
                value={equipmentForm.subcategory} 
                onValueChange={(value) => setEquipmentForm({ ...equipmentForm, subcategory: value })}
                disabled={!equipmentForm.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentForm.category && subcategoriesByCategory[equipmentForm.category]?.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-condition">Condition *</Label>
              <Select value={equipmentForm.condition} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dailyRate">Daily Rate (₹) *</Label>
              <Input
                id="edit-dailyRate"
                type="number"
                value={equipmentForm.dailyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, dailyRate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-weeklyRate">Weekly Rate (₹)</Label>
              <Input
                id="edit-weeklyRate"
                type="number"
                value={equipmentForm.weeklyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, weeklyRate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-monthlyRate">Monthly Rate (₹)</Label>
              <Input
                id="edit-monthlyRate"
                type="number"
                value={equipmentForm.monthlyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, monthlyRate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-securityDeposit">Security Deposit (₹)</Label>
              <Input
                id="edit-securityDeposit"
                type="number"
                value={equipmentForm.securityDeposit}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, securityDeposit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Total Quantity *</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={equipmentForm.quantity}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-available">Available Quantity *</Label>
              <Input
                id="edit-available"
                type="number"
                value={equipmentForm.available}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, available: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-minRentalPeriod">Min Rental Period</Label>
              <Input
                id="edit-minRentalPeriod"
                value={equipmentForm.minRentalPeriod}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, minRentalPeriod: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={equipmentForm.image}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={equipmentForm.description}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-specifications">Specifications (JSON format)</Label>
              <Textarea
                id="edit-specifications"
                value={equipmentForm.specifications}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, specifications: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateEquipment}>Update Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Bookings Management</CardTitle>
              <CardDescription>View and manage rental bookings</CardDescription>
            </div>
            <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => {
                  const equipmentItem = equipment.find(eq => eq.id === booking.equipmentId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.bookingNumber || booking.id}</TableCell>
                      <TableCell>{equipmentItem?.name || "Unknown"}</TableCell>
                      <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>₹{parseFloat(booking.totalCost).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsViewBookingOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, "approved")}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Booking ID</Label>
                  <p className="font-medium">{selectedBooking.bookingNumber || selectedBooking.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p>
                    <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Equipment</Label>
                  <p className="font-medium">
                    {equipment.find(eq => eq.id === selectedBooking.equipmentId)?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <p className="font-medium">{selectedBooking.quantity}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Start Date</Label>
                  <p className="font-medium">{new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">End Date</Label>
                  <p className="font-medium">{new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Cost</Label>
                  <p className="font-medium">₹{parseFloat(selectedBooking.totalCost).toLocaleString()}</p>
                </div>
                {selectedBooking.securityDeposit && (
                  <div>
                    <Label className="text-muted-foreground">Security Deposit</Label>
                    <p className="font-medium">₹{parseFloat(selectedBooking.securityDeposit).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {selectedBooking.deliveryAddress && (
                <div>
                  <Label className="text-muted-foreground">Delivery Address</Label>
                  <p className="font-medium">{selectedBooking.deliveryAddress}</p>
                </div>
              )}
              {selectedBooking.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="font-medium">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewBookingOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
