
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Import Lucide icons using require
import { MapPin, Star, Truck, Package } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OrderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: {
    product: any;
    dealer: any;
  } | null;
}

export const OrderRequestModal = ({ isOpen, onClose, productData }: OrderRequestModalProps) => {
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate order request submission
    toast({
      title: "Buy Request Sent!",
      description: "Our team will contact you within 2 hours to confirm your order details.",
    });
    
    // Reset form
    setQuantity("");
    setAddress("");
    setPhone("");
    setNotes("");
    onClose();
  };

  if (!productData) return null;

  const { product, dealer } = productData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Buy Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product & Dealer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex gap-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{dealer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {dealer.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    {dealer.delivery} delivery
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {dealer.rating} rating
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">₹{dealer.price}</span>
                <p className="text-sm text-gray-600">per unit</p>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity Required *</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 100 bags"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                placeholder="Complete delivery address with pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or delivery instructions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            {/* Price Estimate */}
            {quantity && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Estimated Total</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate per unit:</span>
                    <span>₹{dealer.price}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-semibold">
                    <span>Estimated Total:</span>
                    <span>₹{(parseInt(quantity) || 0) * dealer.price}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    *Final price will be confirmed by our team after verification
                  </p>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="bg-yellow-50 p-3 rounded text-sm">
              <h5 className="font-medium mb-1">Important:</h5>
              <ul className="space-y-1 text-gray-700">
                <li>• Our team will call you within 2 hours to confirm details</li>
                <li>• Advance payment (20-30%) required before delivery</li>
                <li>• Remaining payment due on delivery</li>
                <li>• Delivery charges may apply based on location</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Send Buy Request
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
