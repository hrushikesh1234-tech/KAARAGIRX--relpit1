import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, Loader2, ShoppingBag, Layers, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/Profile-Dashboard/ProfileHeader";
import TabNavigation from "@/components/Profile-Dashboard/TabNavigation";
import StarRating from "@/components/Profile-Dashboard/StarRating";
import Carousel, { Card as CardComponent } from '@/components/ui/apple-cards-carousel';
import ImageSlider from '@/components/ui/ImageSlider';
import CloudinaryMultiImageUpload from '@/components/CloudinaryMultiImageUpload';
import type { CardProps } from '@/components/ui/apple-cards-carousel';

interface Material {
  id: number;
  dealerId: number;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  minOrder: string;
  image: string;
  images?: string[];
  specifications?: Record<string, string>;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  status: string;
  phone: string;
  address: string;
  orderDate: string;
  dealerId: number;
  dealerName: string;
}

interface Review {
  id: number;
  dealerId: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const categories = [
  "cement", "bricks", "blocks", "sand", "steel", 
  "stone-dust", "aggregate", "rubblestone"
];

const subcategoriesByCategory: Record<string, string[]> = {
  cement: ["OPC 43", "OPC 53", "PPC", "White Cement", "RMC"],
  bricks: ["Red Clay", "Fly Ash"],
  blocks: ["Concrete", "AAC"],
  sand: ["River Sand", "Red Sand", "Coarse", "Fine", "Filtered"],
  steel: ["TMT Bars", "Binding Wire", "Steel Rods"],
  "stone-dust": ["Fine", "Coarse"],
  aggregate: ["10mm", "20mm", "40mm", "Dust"],
  rubblestone: ["1-3 Inch", "3-5 Inch", "5-8 Inch"]
};

const units = ["kg", "ton", "bag", "piece", "cubic meter", "cubic feet"];

export default function MaterialDealerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [loading, setLoading] = useState(true);
  const [dealerId, setDealerId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedMaterialForCarousel, setSelectedMaterialForCarousel] = useState<Material | null>(null);

  const [materialForm, setMaterialForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    quantity: "",
    unit: "",
    minOrder: "",
    image: "",
    images: ["", "", "", "", ""] as string[]
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.userType !== "material_dealer") {
      toast({
        title: "Access Denied",
        description: "This dashboard is only accessible to material dealers.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    fetchDealerInfo();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (dealerId) {
      fetchMaterials();
      fetchOrders();
      fetchReviews();
    }
  }, [dealerId]);

  const fetchDealerInfo = async () => {
    try {
      const response = await fetch(`/api/dealers/user/${user?.id}`, {
        credentials: "include"
      });

      if (response.ok) {
        const dealer = await response.json();
        setDealerId(dealer.id);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dealer information. Please contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching dealer info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dealer information.",
        variant: "destructive"
      });
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/materials/dealer/${dealerId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch materials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/dealer/${dealerId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive"
      });
    }
  };

  const fetchReviews = async () => {
    setReviews([]);
  };

  const handleAddMaterial = async () => {
    if (!dealerId) return;

    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          dealerId,
          name: materialForm.name,
          description: materialForm.description,
          category: materialForm.category,
          subcategory: materialForm.subcategory,
          price: parseFloat(materialForm.price),
          unit: materialForm.unit,
          quantity: parseInt(materialForm.quantity),
          minOrder: materialForm.minOrder,
          image: materialForm.images[0] || "",
          images: materialForm.images.filter(img => img.trim() !== ""),
          inStock: true
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Material added successfully."
        });
        setIsAddModalOpen(false);
        resetForm();
        fetchMaterials();
      } else {
        toast({
          title: "Error",
          description: "Failed to add material.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast({
        title: "Error",
        description: "Failed to add material.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return;

    try {
      const response = await fetch(`/api/materials/${selectedMaterial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: materialForm.name,
          description: materialForm.description,
          category: materialForm.category,
          subcategory: materialForm.subcategory,
          price: parseFloat(materialForm.price),
          unit: materialForm.unit,
          quantity: parseInt(materialForm.quantity),
          minOrder: materialForm.minOrder,
          image: materialForm.images[0] || "",
          images: materialForm.images.filter(img => img.trim() !== ""),
          inStock: parseInt(materialForm.quantity) > 0
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Material updated successfully."
        });
        setIsEditModalOpen(false);
        setSelectedMaterial(null);
        resetForm();
        fetchMaterials();
      } else {
        toast({
          title: "Error",
          description: "Failed to update material.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast({
        title: "Error",
        description: "Failed to update material.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Material deleted successfully."
        });
        fetchMaterials();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete material.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Error",
        description: "Failed to delete material.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (material: Material) => {
    setSelectedMaterial(material);
    const materialImages = material.images || [];
    const imagesArray: string[] = Array.isArray(materialImages) ? materialImages : [];
    const paddedImages = [...imagesArray, "", "", "", "", ""].slice(0, 5);
    
    setMaterialForm({
      name: material.name,
      description: material.description,
      category: material.category,
      subcategory: material.subcategory,
      price: material.price.toString(),
      quantity: material.quantity.toString(),
      unit: material.unit,
      minOrder: material.minOrder,
      image: material.image,
      images: paddedImages as [string, string, string, string, string]
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setMaterialForm({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      price: "",
      quantity: "",
      unit: "",
      minOrder: "",
      image: "",
      images: ["", "", "", "", ""]
    });
  };

  const profileData = {
    username: user?.username || "",
    displayName: user?.fullName || "Material Dealer",
    bio: "Construction Materials Supplier",
    occupation: "Material Dealer",
    additionalInfo: user?.companyName || "",
    stats: {
      posts: materials.length,
      followers: orders.length,
      following: orders.filter(o => o.status === "pending").length
    },
    profileImage: "/images/profiles/sarah johnson.png",
    isLive: false
  };

  const createCarouselData = (material: Material, clickedIndex: number = 0): CardProps[] => {
    const images = material.images || [material.image];
    
    return images.map((image: string, index: number) => ({
      category: material.category || 'Material',
      title: material.name,
      src: image,
      content: (
        <div className="bg-black">
          <div className="px-4 pt-1 pb-2 md:px-8">
            <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-center mb-4">
              {material.name}
            </h1>
            <ImageSlider 
              images={images}
              title={material.name}
              initialSlide={clickedIndex}
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Material Details
              </h2>
              <p className="text-gray-300 text-base md:text-lg">
                {material.description || 'No description available.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Category</h3>
                <p className="text-lg font-medium text-white">{material.category || 'N/A'}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Subcategory</h3>
                <p className="text-lg font-medium text-white">{material.subcategory || 'N/A'}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Price</h3>
                <p className="text-lg font-medium text-white">₹{material.price}/{material.unit}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">In Stock</h3>
                <p className="text-lg font-medium text-white">{material.inStock ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {material.specifications && Object.keys(material.specifications).length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Specifications
                </h2>
                <ul className="space-y-3">
                  {Object.entries(material.specifications).map(([key, value], i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{key}: {value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ),
    }));
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
              <h3 className="text-lg font-semibold">My Materials</h3>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>

            {materials.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No materials listed yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {materials.map((material) => (
                  <div 
                    key={material.id}
                    onClick={() => setSelectedMaterialForCarousel(material)}
                    className="relative w-full pb-[177.78%] bg-gray-900 overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0">
                      {material.image ? (
                        <img 
                          src={material.image} 
                          alt={material.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-900 to-gray-900 flex flex-col items-center justify-center p-2">
                          <Package className="w-8 h-8 mb-2 text-green-400" />
                          <p className="text-xs font-semibold text-center line-clamp-2">{material.name}</p>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold line-clamp-1">{material.name}</p>
                      <p className="text-xs text-gray-400">₹{material.price}/{material.unit}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(material);
                        }}
                        className="bg-black/60 rounded-full p-1.5 hover:bg-black/80"
                      >
                        <Edit className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this material?")) {
                            handleDeleteMaterial(material.id);
                          }
                        }}
                        className="bg-black/60 rounded-full p-1.5 hover:bg-black/80"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    {material.quantity > 0 && (
                      <div className="absolute top-2 left-2 bg-green-500/80 rounded-full px-2 py-1">
                        <span className="text-[10px] font-medium">{material.quantity} in stock</span>
                      </div>
                    )}
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
                  <span className="text-gray-400">Total Materials</span>
                  <span className="font-medium">{materials.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Orders</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Orders</span>
                  <span className="font-medium">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Revenue</span>
                  <span className="font-medium">₹{orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? Number(o.total) : 0), 0).toLocaleString()}</span>
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
            
            <div className="text-center py-12 text-gray-400">
              <div className="bg-gray-900/50 rounded-lg p-8">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Reviews Coming Soon</h3>
                <p className="text-sm text-gray-500">
                  Customer reviews for material dealers will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        )}

        {false && activeTab === "reviews" && reviews.length > 0 && (
          <div className="px-4 py-6">
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
          </div>
        )}

        <div className="h-20"></div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription className="text-gray-400">Add a new material to your inventory</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Material Name</Label>
              <Input
                id="name"
                value={materialForm.name}
                onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                placeholder="e.g., Premium OPC Cement"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                placeholder="Describe the material"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={materialForm.category}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, category: value, subcategory: "" })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={materialForm.subcategory}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, subcategory: value })}
                  disabled={!materialForm.category}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {materialForm.category && subcategoriesByCategory[materialForm.category]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={materialForm.price}
                  onChange={(e) => setMaterialForm({ ...materialForm, price: e.target.value })}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={materialForm.unit}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, unit: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Stock Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={materialForm.quantity}
                  onChange={(e) => setMaterialForm({ ...materialForm, quantity: e.target.value })}
                  placeholder="0"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minOrder">Minimum Order</Label>
                <Input
                  id="minOrder"
                  value={materialForm.minOrder}
                  onChange={(e) => setMaterialForm({ ...materialForm, minOrder: e.target.value })}
                  placeholder="e.g., 10 bags"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <CloudinaryMultiImageUpload
                images={materialForm.images}
                onImagesChange={(newImages) => {
                  setMaterialForm({ ...materialForm, images: newImages, image: newImages[0] || "" });
                }}
                maxImages={5}
                maxSizeMB={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMaterial}>Add Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription className="text-gray-400">Update material information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Material Name</Label>
              <Input
                id="edit-name"
                value={materialForm.name}
                onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select 
                  value={materialForm.category}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, category: value, subcategory: "" })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Subcategory</Label>
                <Select
                  value={materialForm.subcategory}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, subcategory: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {materialForm.category && subcategoriesByCategory[materialForm.category]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={materialForm.price}
                  onChange={(e) => setMaterialForm({ ...materialForm, price: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Select
                  value={materialForm.unit}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, unit: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={materialForm.quantity}
                  onChange={(e) => setMaterialForm({ ...materialForm, quantity: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label>Minimum Order</Label>
                <Input
                  value={materialForm.minOrder}
                  onChange={(e) => setMaterialForm({ ...materialForm, minOrder: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <CloudinaryMultiImageUpload
                images={materialForm.images}
                onImagesChange={(newImages) => {
                  setMaterialForm({ ...materialForm, images: newImages, image: newImages[0] || "" });
                }}
                maxImages={5}
                maxSizeMB={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMaterial}>Update Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedMaterialForCarousel && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="h-16 w-full bg-black flex-shrink-0"></div>
          
          <div className="flex-1 relative flex flex-col">
            <button
              onClick={() => setSelectedMaterialForCarousel(null)}
              className="fixed top-20 right-4 z-[100] p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X className="w-4 h-4 text-black" strokeWidth={2.5} />
            </button>
            
            <div className="w-full h-full pt-16">
              <Carousel 
                items={createCarouselData(selectedMaterialForCarousel).map((card, index) => (
                  <CardComponent key={card.src + index} card={card} index={index} />
                ))}
                onClose={() => setSelectedMaterialForCarousel(null)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
