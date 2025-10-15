import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Home } from "lucide-react";

interface LocationState {
  message: string;
  orderId: string;
  orderNumber: string;
  phone: string;
  total: string;
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!state) {
    // If no state, redirect to home
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Submitted Successfully!
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 mt-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {state.message}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold text-gray-900">{state.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Contact Phone:</span>
              <span className="font-semibold text-gray-900 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {state.phone}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">₹{parseFloat(state.total).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Your order is now pending confirmation. Our team will contact you shortly to confirm your order details.
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/track-order')}
            >
              Track Your Orders
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
