import { useState } from 'react';
import { X, CreditCard, Smartphone, Landmark, Wallet, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallets' | 'emi';

interface PaymentGatewayModalProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function PaymentGatewayModal({ amount, onSuccess, onClose }: PaymentGatewayModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fillDemoDetails = () => {
    setCardNumber('4111 1111 1111 1111');
    setCardName('Demo User');
    setExpiry('12/25');
    setCvv('123');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Call success callback after showing success message
      setTimeout(onSuccess, 1500);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md relative">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment Successful!</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment of ₹{amount.toLocaleString()} Successful</h3>
              <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Secure Payment</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4">
              <span className="font-medium">Amount to Pay:</span>
              <span className="text-lg font-bold">₹{amount.toLocaleString()}</span>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mb-4 text-sm"
              onClick={fillDemoDetails}
              type="button"
            >
              Fill Demo Card Details
            </Button>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="expiry"
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${amount.toLocaleString()}`
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
