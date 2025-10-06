
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dealer } from "@/types";

interface DealerCardProps {
  dealer: Dealer;
  onBuyRequest: () => void;
}

export const DealerCard = ({ dealer, onBuyRequest }: DealerCardProps) => {
  const handleHeartClick = () => {
    console.log("Added to favorites:", dealer.name);
    // TODO: Implement favorite functionality
  };

  const handleCartClick = () => {
    console.log("Added to cart:", dealer.name);
    // TODO: Implement cart functionality
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">{dealer.name}</h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>📍</span>
              {dealer.location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{dealer.rating}</span>
            </div>
            <Badge variant="secondary" className="text-xs">Verified</Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>🚚</span>
            {dealer.deliveryTime}
          </div>
          <span className="text-xl font-bold text-green-600">₹{dealer.price}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={onBuyRequest} size="sm" className="flex-1">
              Buy Request
            </Button>
            <Button variant="outline" size="sm">
              <span>📞</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleHeartClick} variant="outline" size="sm" className="flex-1">
              <span className="mr-1">❤️</span>
              Like
            </Button>
            <Button onClick={handleCartClick} variant="outline" size="sm" className="flex-1">
              <span className="mr-1">🛒</span>
              Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
