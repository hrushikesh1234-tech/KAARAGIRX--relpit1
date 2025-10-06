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
import { Package, ShoppingCart, Clock, DollarSign, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface DashboardStats {
  totalMaterials: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
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
  const [stats, setStats] = useState<DashboardStats>({
    totalMaterials: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [dealerId, setDealerId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  const [materialForm, setMaterialForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    quantity: "",
    unit: "",
    minOrder: "",
    image: ""
  });

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
    }
  }, [dealerId]);

  const fetchDealerInfo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/dealers/user/${user?.id}`, {
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
      const response = await fetch(`http://127.0.0.1:3001/api/materials/dealer/${dealerId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
        calculateStats(data, orders);
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
      const response = await fetch(`http://127.0.0.1:3001/api/orders/dealer/${dealerId}`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        calculateStats(materials, data);
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

  const calculateStats = (materialsData: Material[], ordersData: Order[]) => {
    const totalRevenue = ordersData
      .filter(order => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total), 0);

    const pendingOrders = ordersData.filter(order => order.status === "pending").length;

    setStats({
      totalMaterials: materialsData.length,
      totalOrders: ordersData.length,
      pendingOrders,
      totalRevenue
    });
  };

  const handleAddMaterial = async () => {
    if (!dealerId) return;

    try {
      const response = await fetch("http://127.0.0.1:3001/api/materials", {
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
          image: materialForm.image,
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
      const response = await fetch(`http://127.0.0.1:3001/api/materials/${selectedMaterial.id}`, {
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
          image: materialForm.image,
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
      const response = await fetch(`http://127.0.0.1:3001/api/materials/${materialId}`, {
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

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/orders/${orderId}/status`, {
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
          description: `Order ${status === "verified" ? "approved" : "rejected"} successfully.`
        });
        fetchOrders();
      } else {
        toast({
          title: "Error",
          description: "Failed to update order status.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (material: Material) => {
    setSelectedMaterial(material);
    setMaterialForm({
      name: material.name,
      description: material.description,
      category: material.category,
      subcategory: material.subcategory,
      price: material.price.toString(),
      quantity: material.quantity.toString(),
      unit: material.unit,
      minOrder: material.minOrder,
      image: material.image
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
      image: ""
    });
  };

  const filteredOrders = orderStatusFilter === "all" 
    ? orders 
    : orders.filter(order => {
        if (orderStatusFilter === "pending") return order.status === "pending";
        if (orderStatusFilter === "approved") return order.status === "verified" || order.status === "processing";
        if (orderStatusFilter === "rejected") return order.status === "cancelled";
        return true;
      });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Material Dealer Dashboard</h1>
        <p className="text-muted-foreground">Manage your materials inventory and orders</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">Active materials in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
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
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Materials Management</CardTitle>
              <CardDescription>Manage your materials inventory</CardDescription>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                  <DialogDescription>Add a new material to your inventory</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Material Name</Label>
                    <Input
                      id="name"
                      value={materialForm.name}
                      onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                      placeholder="e.g., Premium OPC Cement"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={materialForm.description}
                      onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                      placeholder="Describe the material"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={materialForm.category}
                        onValueChange={(value) => setMaterialForm({ ...materialForm, category: value, subcategory: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
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
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={materialForm.unit}
                        onValueChange={(value) => setMaterialForm({ ...materialForm, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
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
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minOrder">Minimum Order</Label>
                      <Input
                        id="minOrder"
                        value={materialForm.minOrder}
                        onChange={(e) => setMaterialForm({ ...materialForm, minOrder: e.target.value })}
                        placeholder="e.g., 10 bags"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={materialForm.image}
                      onChange={(e) => setMaterialForm({ ...materialForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No materials found. Add your first material to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell className="capitalize">{material.category}</TableCell>
                      <TableCell>{material.subcategory}</TableCell>
                      <TableCell>₹{material.price}/{material.unit}</TableCell>
                      <TableCell>{material.quantity}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>
                        <Badge variant={material.inStock ? "default" : "secondary"}>
                          {material.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(material)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Material</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {material.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMaterial(material.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>Update material information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Material Name</Label>
              <Input
                id="edit-name"
                value={materialForm.name}
                onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={materialForm.category}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, category: value, subcategory: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-subcategory">Subcategory</Label>
                <Select
                  value={materialForm.subcategory}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, subcategory: value })}
                  disabled={!materialForm.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={materialForm.price}
                  onChange={(e) => setMaterialForm({ ...materialForm, price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Select
                  value={materialForm.unit}
                  onValueChange={(value) => setMaterialForm({ ...materialForm, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="edit-quantity">Stock Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={materialForm.quantity}
                  onChange={(e) => setMaterialForm({ ...materialForm, quantity: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-minOrder">Minimum Order</Label>
                <Input
                  id="edit-minOrder"
                  value={materialForm.minOrder}
                  onChange={(e) => setMaterialForm({ ...materialForm, minOrder: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={materialForm.image}
                onChange={(e) => setMaterialForm({ ...materialForm, image: e.target.value })}
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>Manage customer orders</CardDescription>
            </div>
            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity} {order.unit}</TableCell>
                      <TableCell>₹{Number(order.total).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "pending" ? "secondary" :
                            order.status === "verified" || order.status === "processing" ? "default" :
                            order.status === "cancelled" ? "destructive" :
                            "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleUpdateOrderStatus(order.id, "verified")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/order/${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
