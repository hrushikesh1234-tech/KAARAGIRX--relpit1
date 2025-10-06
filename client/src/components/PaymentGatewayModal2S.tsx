import { useState } from 'react';
// Icons replaced with emojis
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
                <span>✕</span>
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
              <span>✕</span>
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
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Pay ₹' + amount.toLocaleString()}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is a demo payment gateway. No real transactions will be processed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
