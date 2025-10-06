import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface PaymentGatewayProps {
  amount: number;
  bookingData: any;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

export function PaymentGateway({ amount, bookingData, onSuccess, onCancel }: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fillDemoCard = () => {
    setCardNumber("4111111111111111"); // Test Visa card number
    setExpiry("1230"); // MM/YY format (12/30)
    setCvv("123");
    setName("Test User");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !expiry || !cvv || !name) {
      alert("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    // Simulate API call to payment gateway
    try {
      // In a real app, you would integrate with a payment gateway like Razorpay, Stripe, etc.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const paymentData = {
        transactionId: `TXN${Math.random().toString(36).substring(2, 15)}`,
        amount: amount,
        status: "success",
        timestamp: new Date().toISOString()
      };

      onSuccess(paymentData);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Secure Payment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your booking by paying the advance amount
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Advance Amount (30%):</span>
              <span className="font-medium">₹{(amount * 0.3).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold mb-3">
              <span>Total Amount:</span>
              <span>₹{amount.toLocaleString()}</span>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={fillDemoCard}
            >
              Use Demo Card (Test Payment)
            </Button>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (value.length > 2) {
                      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
                    } else {
                      setExpiry(value);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${(amount * 0.3).toLocaleString()}`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
