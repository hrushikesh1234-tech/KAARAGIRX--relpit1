import { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { PaymentGateway } from "@/components/onrent/PaymentGateway";
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Calendar, MapPin, Star, Clock, Loader2 } from "lucide-react";

const BookingPageOR = () => {
  const { equipmentId } = useParams();
  const location = useLocation();
  // Get equipment data and selected duration/price from route state or use defaults
  const {
    equipment = {
      id: equipmentId,
      name: "Equipment Not Found",
      supplier: "Unknown",
      location: "N/A",
      dailyPrice: 0,
      hourlyPrice: 0,
      image: "/placeholder-equipment.jpg",
      rating: 0,
      reviews: 0
    },
    selectedDuration: initialDuration = "daily",
    selectedPrice = 0
  } = location.state || {};

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [duration, setDuration] = useState(initialDuration);
  const [basePrice, setBasePrice] = useState(selectedPrice);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    
    // Calculate time difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime();
    
    // Convert to different time units
    const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(days / 7);
    const months = Math.max(1, Math.ceil(days / 30)); // Minimum 1 month
    
    // Calculate based on selected duration type
    switch (duration) {
      case "hourly":
        // Minimum 4 hours for hourly rental
        const billableHours = Math.max(4, hours);
        return billableHours * (basePrice || equipment.hourlyPrice || 0);
        
      case "daily":
        // Minimum 1 day
        const billableDays = Math.max(1, days);
        return billableDays * (basePrice || equipment.dailyPrice || 0);
        
      case "weekly":
        // Use the selected weekly price or calculate based on daily rate
        if (duration === initialDuration) {
          return Math.max(basePrice, Math.ceil(days / 7) * basePrice);
        }
        const weeklyRate = (equipment.dailyPrice || 0) * 6.5;
        return Math.max(weeklyRate, weeks * weeklyRate);
        
      case "monthly":
        // Use the selected monthly price or calculate based on daily rate
        if (duration === initialDuration) {
          return Math.max(basePrice, Math.ceil(days / 30) * basePrice);
        }
        const monthlyRate = (equipment.dailyPrice || 0) * 25;
        return Math.max(monthlyRate, months * monthlyRate);
        
      default:
        return days * (basePrice || equipment.dailyPrice || 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate total amount
    const totalAmount = calculateTotal();
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    const bookingId = `BK-${Date.now()}`;
    const totalAmount = calculateTotal();
    const advanceAmount = totalAmount * 0.3;
    
    // Prepare booking data
    const bookingData = {
      bookingId,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      startDate: startDate?.toISOString() || new Date().toISOString(),
      endDate: endDate?.toISOString() || new Date().toISOString(),
      durationType: duration,
      basePrice: basePrice,
      totalAmount,
      advanceAmount,
      paymentStatus: 'advance_paid',
      status: 'confirmed',
      paymentDetails: {
        transactionId: paymentData.transactionId,
        paymentDate: new Date().toISOString(),
        amount: advanceAmount,
        paymentMethod: 'credit_card',
        status: 'completed'
      },
      createdAt: new Date().toISOString()
    };
    
    // In a real app, you would save this to your backend
    console.log('Booking confirmed:', bookingData);
    
    // Save to local storage for demo purposes
    const bookings = JSON.parse(localStorage.getItem('equipmentBookings') || '[]');
    localStorage.setItem('equipmentBookings', JSON.stringify([...bookings, bookingData]));
    
    // Redirect to booking confirmation page
    navigate('/onrent/booked', { state: { booking: bookingData } });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    toast({
      title: "Payment Cancelled",
      description: "Your booking is not confirmed until payment is complete.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6 pb-32">
        <div className="mb-6">
          <Link 
            to={`/onrent/equipment/${equipmentId}`}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Equipment Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" required />
                    </div>
                  </div>

                  <div>
                    <Label>Rental Duration Type</Label>
                    <Select 
                      value={duration} 
                      onValueChange={(value) => {
                        setDuration(value);
                        // Reset base price when duration changes
                        setBasePrice(0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <DatePicker 
                        date={startDate} 
                        onDateChange={(date) => {
                          if (date && endDate && date > endDate) {
                            setEndDate(undefined);
                          }
                          setStartDate(date);
                        }}
                        placeholder="Select start date"
                        minDate={new Date()}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <DatePicker 
                        date={endDate} 
                        onDateChange={setEndDate}
                        placeholder="Select end date"
                        minDate={startDate || new Date()}
                        disabled={!startDate}
                      />
                    </div>
                  </div>
                  
                  {/* Price Breakdown */}
                  {startDate && endDate && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Price Breakdown</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Base Rate ({duration}):</span>
                          <span>₹{basePrice > 0 
                            ? basePrice.toLocaleString() 
                            : (
                                duration === 'hourly' ? (equipment.hourlyPrice || 0) :
                                duration === 'daily' ? (equipment.dailyPrice || 0) :
                                duration === 'weekly' ? ((equipment.dailyPrice || 0) * 6.5) :
                                duration === 'monthly' ? ((equipment.dailyPrice || 0) * 25) : 0
                              ).toLocaleString()
                          }</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>
                            {duration === 'hourly' 
                              ? `${Math.max(4, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))} hours`
                              : duration === 'daily' 
                                ? `${Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))} days`
                                : duration === 'weekly'
                                  ? `${Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)))} weeks`
                                  : `${Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))} months`
                            }
                          </span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between font-medium">
                          <span>Total Amount:</span>
                          <span className="text-orange-600">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="projectDetails">Project Details</Label>
                    <Textarea 
                      id="projectDetails" 
                      placeholder="Describe your project and specific requirements..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea 
                      id="deliveryAddress" 
                      placeholder="Enter complete delivery address with landmarks..."
                      rows={3}
                      required
                    />
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <img 
                    src={equipment.image} 
                    alt={equipment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{equipment.supplier}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{equipment.location}</span>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{equipment.rating}</span>
                  <span className="text-sm text-muted-foreground">({equipment.reviews} reviews)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Duration Type:</span>
                  <span className="font-medium capitalize">{duration}</span>
                </div>
                
                {startDate && (
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-medium">{startDate.toLocaleDateString()}</span>
                  </div>
                )}
                
                {endDate && (
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span className="font-medium">{endDate.toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-orange-500">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  *Final amount may vary based on actual usage and additional services
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom Button */}
      {showPayment && (
        <PaymentGateway 
          amount={calculateTotal()}
          bookingData={{
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            durationType: duration,
            totalAmount: calculateTotal()
          }}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4 shadow-lg">
        <div className="container mx-auto flex justify-center">
          <Button 
            type="submit" 
            form="booking-form" 
            size="lg" 
            className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Submit Buy Request'
            )}
          </Button>
        </div>
      </div>
      
      {/* Submit Button at Bottom - Only show when payment gateway is closed */}
      {!showPayment && (
        <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4 shadow-lg z-50">
          <div className="container mx-auto max-w-4xl">
            <Button 
              type="submit" 
              form="booking-form" 
              size="lg" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Buy Request'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPageOR;
