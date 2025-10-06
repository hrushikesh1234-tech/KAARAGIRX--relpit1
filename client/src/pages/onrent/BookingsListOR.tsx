import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function BookingsListOR() {
  const [bookings, setBookings] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedBooking = location.state?.booking;

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('equipmentBookings') || '[]');
    setBookings(savedBookings);

    // If we have a selected booking from navigation, scroll to it
    if (selectedBooking) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`booking-${selectedBooking.bookingId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-orange-500', 'rounded-lg');
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-orange-500', 'rounded-lg');
          }, 3000);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedBooking]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed
        </Badge>;
      case 'cancelled':
        return <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" /> Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No Bookings Found</h1>
          <p className="text-muted-foreground mb-6">You haven't made any equipment bookings yet.</p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/onrent">
                Browse Equipment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Equipment Bookings</h1>
        <Button variant="outline" asChild>
          <Link to="/onrent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rentals
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card 
            key={booking.bookingId} 
            id={`booking-${booking.bookingId}`}
            className="transition-all duration-200 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">{booking.equipmentName}</CardTitle>
                <p className="text-sm text-muted-foreground">Booking ID: {booking.bookingId}</p>
              </div>
              {getStatusBadge(booking.status || 'pending')}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p>₹{booking.totalAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Advance Paid</p>
                  <p>₹{booking.advanceAmount?.toLocaleString()}</p>
                </div>
                <div className="flex items-end justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/onrent/booked', { state: { booking } })}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
