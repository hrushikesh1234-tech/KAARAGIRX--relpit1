import { cn } from "@/lib/utils";
import { VehicleIcon } from "./VehicleIcon";

interface Order {
  id: string;
  material: string;
  vehicle: "truck" | "tractor" | "tempo";
  quantity: string;
  from: string;
  to: string;
  status: "loading" | "in_transit" | "delivered";
  progress: number;
  estimatedDelivery: string;
  driverName: string;
  driverPhone: string;
  orderSummary: {
    items: Array<{
      name: string;
      supplier: string;
      quantity: string;
      price: number;
    }>;
    subtotal: number;
    delivery: number;
    taxRate: number;
    advancePercentage: number;
    deliveryInfo: {
      contact: string;
      address: string;
    };
    currentStatus: number;
  };
}

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
}

export const OrderCard = ({ order, isSelected, onClick }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "loading":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "loading":
        return "Loading";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50",
        "bg-card"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <VehicleIcon type={order.vehicle} />
          <div>
            <h4 className="font-medium text-foreground">
              {order.material} ({order.quantity})
            </h4>
            <p className="text-sm text-muted-foreground">
              Order #{order.id}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getStatusColor(order.status)
          )}
        >
          {getStatusText(order.status)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div>
          <p className="text-muted-foreground">From</p>
          <p className="font-medium">{order.from}</p>
        </div>
        <div className="w-8 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">To</p>
          <p className="font-medium">{order.to}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated Delivery</span>
          <span className="font-medium">{order.estimatedDelivery}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Driver</span>
          <span className="font-medium">{order.driverName}</span>
        </div>
      </div>
    </div>
  );
};
