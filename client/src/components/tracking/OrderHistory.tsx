import { OrderCard } from "./OrderCard";

interface OrderHistoryProps {
  className?: string;
}

export const OrderHistory = ({ className }: OrderHistoryProps) => {
  // Mock data for completed orders
  const completedOrders = [
    {
      id: "ORD004",
      material: "Cement",
      vehicle: "truck" as const,
      quantity: "50 Bags",
      from: "Cement Factory",
      to: "Construction Site A",
      status: "delivered" as const,
      progress: 100,
      estimatedDelivery: "Delivered on June 5, 2023",
      driverName: "Rajesh Kumar",
      driverPhone: "+919876543210",
      orderSummary: {
        items: [
          { 
            name: "Portland Cement", 
            supplier: "Cement Factory Direct", 
            quantity: "50 Bags (50kg each)", 
            price: 25000 
          }
        ],
        subtotal: 25000,
        delivery: 1500,
        taxRate: 18,
        advancePercentage: 30,
        deliveryInfo: {
          contact: "Rajesh Kumar",
          address: "Construction Site A, Sector 22"
        },
        currentStatus: 6
      }
    },
    {
      id: "ORD005",
      material: "Steel Rods",
      vehicle: "tractor" as const,
      quantity: "2 Tons",
      from: "Steel Plant",
      to: "Residential Project",
      status: "delivered" as const,
      progress: 100,
      estimatedDelivery: "Delivered on May 28, 2023",
      driverName: "Vikram Singh",
      driverPhone: "+919876543211",
      orderSummary: {
        items: [
          { 
            name: "TMT Steel Rods", 
            supplier: "Steel Plant Direct", 
            quantity: "2 Tons", 
            price: 14000 
          }
        ],
        subtotal: 14000,
        delivery: 800,
        taxRate: 18,
        advancePercentage: 30,
        deliveryInfo: {
          contact: "Vikram Singh",
          address: "Residential Project, Phase 3"
        },
        currentStatus: 6
      }
    },
    {
      id: "ORD006",
      material: "Sand",
      vehicle: "tempo" as const,
      quantity: "5 Tons",
      from: "River Quarry",
      to: "Commercial Complex",
      status: "delivered" as const,
      progress: 100,
      estimatedDelivery: "Delivered on May 15, 2023",
      driverName: "Suresh Patel",
      driverPhone: "+919876543212",
      orderSummary: {
        items: [
          { 
            name: "River Sand", 
            supplier: "River Quarry Direct", 
            quantity: "5 Tons", 
            price: 4000 
          }
        ],
        subtotal: 4000,
        delivery: 500,
        taxRate: 18,
        advancePercentage: 30,
        deliveryInfo: {
          contact: "Suresh Patel",
          address: "Commercial Complex, Main Road"
        },
        currentStatus: 6
      }
    }
  ];

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Order History</h3>
      {completedOrders.length > 0 ? (
        <div className="space-y-4">
          {completedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={false}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No completed orders found.</p>
        </div>
      )}
    </div>
  );
};
