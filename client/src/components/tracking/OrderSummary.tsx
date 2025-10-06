import { cn } from "@/lib/utils";

interface OrderItem {
  name: string;
  supplier: string;
  quantity: string;
  price: number;
}

interface DeliveryInfo {
  contact: string;
  address: string;
}

interface OrderSummaryProps {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  taxRate: number;
  advancePercentage: number;
  deliveryInfo: DeliveryInfo;
  currentStatus: number;
}

export const OrderSummary = ({
  orderId,
  items,
  subtotal,
  delivery,
  taxRate,
  advancePercentage,
  deliveryInfo,
  currentStatus,
}: OrderSummaryProps) => {
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + delivery + tax;
  const advancePaid = (total * advancePercentage) / 100;
  const dueAmount = total - advancePaid;

  const statusSteps = [
    { id: 1, name: 'Order Placed', description: 'Your order has been received' },
    { id: 2, name: 'Processing', description: 'We are preparing your order' },
    { id: 3, name: 'Dispatched', description: 'Your order is on the way' },
    { id: 4, name: 'In Transit', description: 'Your order is in transit' },
    { id: 5, name: 'Out for Delivery', description: 'Your order is out for delivery' },
    { id: 6, name: 'Delivered', description: 'Your order has been delivered' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} • {item.supplier}
                </p>
              </div>
              <p className="font-medium">₹{item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>₹{delivery.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-medium">Total</span>
            <span className="font-medium">₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Advance Paid ({advancePercentage}%)</span>
            <span className="text-green-600">-₹{advancePaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-border">
            <span>Due Amount</span>
            <span>₹{dueAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-medium mb-3">Delivery Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-24 text-muted-foreground">Contact</span>
            <span>{deliveryInfo.contact}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-muted-foreground">Address</span>
            <span className="flex-1">{deliveryInfo.address}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-medium mb-3">Order Status</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div 
            className="absolute left-4 top-0 w-0.5 bg-primary transition-all duration-500"
            style={{ height: `${((currentStatus - 1) / (statusSteps.length - 1)) * 100}%` }}
          ></div>
          <div className="space-y-6">
            {statusSteps.map((step) => (
              <div key={step.id} className="relative pl-10">
                <div
                  className={cn(
                    "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2",
                    currentStatus >= step.id
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {step.id}
                </div>
                <div>
                  <h4 className={cn(
                    "font-medium",
                    currentStatus >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
