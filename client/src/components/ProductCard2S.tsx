
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Icons replaced with emojis
import { Link, useSearchParams } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    subcategory?: string;
    image: string;
    dealers: Array<{
      name: string;
      price: number;
      rating: number;
      delivery: string;
      location: string;
    }>;
  };
  onBuyRequest: (product: any, dealer: any) => void;
}

export const ProductCard = ({ product, onBuyRequest }: ProductCardProps) => {
  const [searchParams] = useSearchParams();
  const selectedLocation = searchParams.get('location') || '';
  
  const bestPrice = Math.min(...product.dealers.map(d => d.price));
  const bestDealer = product.dealers.find(d => d.price === bestPrice);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 right-2 bg-green-600">
            Best Price ₹{bestPrice}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        
        {/* Best Dealer Info */}
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-blue-900">{bestDealer?.name}</p>
              <div className="flex items-center gap-1 text-sm text-blue-700">
                <span className="mr-1">📍</span>
                {bestDealer?.location}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-medium">{bestDealer?.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="mr-1">🚚</span>
              {bestDealer?.delivery}
            </div>
            <span className="text-lg font-bold text-green-600">₹{bestPrice}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {product.dealers.length} dealers available
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2">
        <Button 
          className="w-full" 
          onClick={() => onBuyRequest(product, bestDealer)}
        >
          Send Buy Request
        </Button>
        <Link 
          to={`/dealers?category=${product.category}&subcategory=${encodeURIComponent(product.subcategory || product.name)}&location=${selectedLocation}`}
          className="w-full"
        >
          <Button variant="outline" className="w-full text-sm">
            View All Dealers ({product.dealers.length})
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
