import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookedOR() {
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
          <p className="text-muted-foreground mb-6">It seems you haven't made any bookings yet.</p>
          <Link to="/onrent">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rentals
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">You've successfully booked {booking.equipmentName}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Booking ID</h3>
              <p className="font-medium">{booking.bookingId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="font-medium">Pending Confirmation</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Equipment</h3>
              <p className="font-medium">{booking.equipmentName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
              <p className="font-medium">
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
              <p className="font-medium">₹{booking.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Advance Paid</h3>
              <p className="font-medium">₹{booking.advanceAmount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/onrent" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rentals
          </Button>
        </Link>
        <Link to="/onrent/bookings" state={{ booking }} className="w-full sm:w-auto">
          <Button className="w-full">
            View All Bookings
          </Button>
        </Link>
      </div>
    </div>
  );
}
