import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Calendar, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/Profile-Dashboard/ProfileHeader";
import TabNavigation from "@/components/Profile-Dashboard/TabNavigation";
import StarRating from "@/components/Profile-Dashboard/StarRating";

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

interface Review {
  id: number;
  merchantId: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<RentalEquipment | null>(null);

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

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

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
      fetchReviews();
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

  const fetchReviews = async () => {
    if (!merchantId) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/professionals/${merchantId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
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

  const getAvailabilityColor = (eq: RentalEquipment) => {
    if (eq.available === 0) return "bg-red-500/80";
    if (eq.available < eq.quantity) return "bg-yellow-500/80";
    return "bg-green-500/80";
  };

  const profileData = {
    username: user?.username || "",
    displayName: user?.fullName || "Rental Merchant",
    bio: "Construction Equipment Rental Services",
    occupation: "Rental Merchant",
    additionalInfo: user?.companyName || "",
    stats: {
      posts: equipment.length,
      followers: bookings.length,
      following: bookings.filter(b => b.status === "pending").length
    },
    profileImage: "/images/profiles/architect.png",
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
        <ProfileHeader 
          profileData={profileData}
          onEditProfile={() => navigate("/profile/edit")}
          averageRating={averageRating}
          reviewCount={reviews.length}
        />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "portfolio" && (
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">My Equipment</h3>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>

            {equipment.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No equipment listed yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {equipment.map((eq) => (
                  <div 
                    key={eq.id}
                    className="relative w-full pb-[177.78%] bg-gray-900 overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0">
                      {eq.image ? (
                        <img 
                          src={eq.image} 
                          alt={eq.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-gray-900 flex flex-col items-center justify-center p-2">
                          <Calendar className="w-8 h-8 mb-2 text-purple-400" />
                          <p className="text-xs font-semibold text-center line-clamp-2">{eq.name}</p>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold line-clamp-1">{eq.name}</p>
                      <p className="text-xs text-gray-400">₹{eq.dailyRate}/day</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEquipment(eq);
                        }}
                        className="bg-black/60 rounded-full p-1.5 hover:bg-black/80"
                      >
                        <Edit className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this equipment?")) {
                            handleDeleteEquipment(eq.id);
                          }
                        }}
                        className="bg-black/60 rounded-full p-1.5 hover:bg-black/80"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div className={`absolute top-2 left-2 ${getAvailabilityColor(eq)} rounded-full px-2 py-1`}>
                      <span className="text-[10px] font-medium">{eq.available}/{eq.quantity} available</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="px-4 py-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <div className="space-y-3 bg-gray-900/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Business Name</span>
                  <span className="font-medium">{user?.companyName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Owner Name</span>
                  <span className="font-medium">{user?.fullName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium">{user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone</span>
                  <span className="font-medium">{user?.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="font-medium text-right">{user?.address || "N/A"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Business Stats</h3>
              <div className="space-y-3 bg-gray-900/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Equipment</span>
                  <span className="font-medium">{equipment.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bookings</span>
                  <span className="font-medium">{bookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Bookings</span>
                  <span className="font-medium">{bookings.filter(b => b.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Revenue</span>
                  <span className="font-medium">₹{bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? Number(b.totalCost) : 0), 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => navigate("/profile/edit")}
              className="w-full"
            >
              Edit Profile
            </Button>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
            </div>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <StarRating rating={0} size={48} className="justify-center mb-4 opacity-50" />
                <p>No reviews yet</p>
                <p className="text-sm mt-2">Reviews from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{review.customerName}</p>
                        <StarRating rating={review.rating} size={14} className="mt-1" />
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="h-20"></div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription className="text-gray-400">Fill in the details to add new rental equipment</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                value={equipmentForm.name}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                placeholder="e.g., JCB 3DX"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={equipmentForm.category} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value, subcategory: "" })}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
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
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {equipmentForm.category && subcategoriesByCategory[equipmentForm.category]?.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select value={equipmentForm.condition} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
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
                className="bg-gray-800 border-gray-700"
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
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRate">Monthly Rate (₹)</Label>
              <Input
                id="monthlyRate"
                type="number"
                value={equipmentForm.monthlyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, monthlyRate: e.target.value })}
                placeholder="40000"
                className="bg-gray-800 border-gray-700"
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
                className="bg-gray-800 border-gray-700"
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
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available">Available Quantity *</Label>
              <Input
                id="available"
                type="number"
                value={equipmentForm.available}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, available: e.target.value })}
                placeholder="5"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={equipmentForm.description}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                placeholder="Describe the equipment"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={equipmentForm.image}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEquipment}>Add Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription className="text-gray-400">Update equipment information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input
                value={equipmentForm.name}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={equipmentForm.category} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value, subcategory: "" })}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Select 
                value={equipmentForm.subcategory} 
                onValueChange={(value) => setEquipmentForm({ ...equipmentForm, subcategory: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {equipmentForm.category && subcategoriesByCategory[equipmentForm.category]?.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={equipmentForm.condition} onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Daily Rate (₹)</Label>
              <Input
                type="number"
                value={equipmentForm.dailyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, dailyRate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Weekly Rate (₹)</Label>
              <Input
                type="number"
                value={equipmentForm.weeklyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, weeklyRate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Rate (₹)</Label>
              <Input
                type="number"
                value={equipmentForm.monthlyRate}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, monthlyRate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Security Deposit (₹)</Label>
              <Input
                type="number"
                value={equipmentForm.securityDeposit}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, securityDeposit: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Quantity</Label>
              <Input
                type="number"
                value={equipmentForm.quantity}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, quantity: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Available Quantity</Label>
              <Input
                type="number"
                value={equipmentForm.available}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, available: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Textarea
                value={equipmentForm.description}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Image URL</Label>
              <Input
                value={equipmentForm.image}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEquipment}>Update Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
