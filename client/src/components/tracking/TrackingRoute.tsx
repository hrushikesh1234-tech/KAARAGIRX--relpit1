import { useEffect, useState } from "react";
import { VehicleIcon } from "./VehicleIcon";
import { cn } from "@/lib/utils";

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

interface TrackingRouteProps {
  order: Order;
}

export const TrackingRoute = ({ order }: TrackingRouteProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(order.progress);
    }, 500);
    return () => clearTimeout(timer);
  }, [order.progress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "loading":
        return "text-yellow-500";
      case "in_transit":
        return "text-blue-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "loading":
        return "Loading...";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loading":
        return (
          <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        );
      case "in_transit":
        return (
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          </div>
        );
      case "delivered":
        return (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="w-3 h-3 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded-full bg-gray-300"></div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <VehicleIcon type={order.vehicle} />
          <div>
            <h3 className="font-medium text-foreground">
              {order.material} ({order.quantity})
            </h3>
            <p className="text-sm text-muted-foreground">
              {order.from} → {order.to}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              getStatusColor(order.status)
            )}
          >
            {getStatusIcon(order.status)}
            <span className="ml-1">{getStatusText(order.status)}</span>
          </span>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Picked Up</span>
          <span>In Transit</span>
          <span>Delivered</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out"
            style={{ width: `${animatedProgress}%` }}
          ></div>
        </div>
        <div className="absolute -top-1 left-0 right-0 flex justify-between">
          <div className="w-3 h-3 rounded-full bg-blue-500 -mt-0.5"></div>
          <div
            className={cn(
              "w-3 h-3 rounded-full -mt-0.5",
              animatedProgress >= 50
                ? "bg-blue-500"
                : "bg-gray-300 border-2 border-white"
            )}
          ></div>
          <div
            className={cn(
              "w-3 h-3 rounded-full -mt-0.5",
              animatedProgress >= 100
                ? "bg-green-500"
                : "bg-gray-300 border-2 border-white"
            )}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
          <p className="font-medium">{order.estimatedDelivery}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Driver</p>
          <p className="font-medium">{order.driverName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Contact</p>
          <a
            href={`tel:${order.driverPhone}`}
            className="font-medium text-blue-600 hover:underline"
          >
            {order.driverPhone}
          </a>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-mono text-sm">{order.id}</p>
        </div>
      </div>
    </div>
  );
};
