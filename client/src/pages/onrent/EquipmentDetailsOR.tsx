import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Star, Heart, Check, Building2, ChevronDown, ArrowRight } from "lucide-react";
import { useRentalEquipmentItem, useRentalEquipmentByMerchant } from "@/hooks/useRentalEquipment";
import { useLikedItems } from "@/contexts/LikedItemsContext";
import { toast } from 'sonner';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const EquipmentDetailsOR = () => {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDuration, setSelectedDuration] = useState("daily");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addLikedItem, removeLikedItem, isLiked } = useLikedItems();

  // Fetch equipment details
  const { data: equipment, isLoading: isLoadingEquipment } = useRentalEquipmentItem(equipmentId || '');
  
  // Fetch merchant's other equipment
  const { data: merchantEquipment = [], isLoading: isLoadingMerchantEquipment } = useRentalEquipmentByMerchant(
    equipment?.merchantId || 0
  );

  // Get equipment images
  const getEquipmentImages = () => {
    if (!equipment) return [];
    
    if (equipment.images && equipment.images.length > 0) {
      return equipment.images.map((img, idx) => ({
        url: img,
        alt: `${equipment.name} - Image ${idx + 1}`
      }));
    }
    
    const imageUrl = equipment.image || '/placeholder-equipment.jpg';
    return [{
      url: imageUrl,
      alt: equipment.name
    }];
  };

  const equipmentImages = getEquipmentImages();
  const selectedImage = equipmentImages[selectedImageIndex]?.url || equipmentImages[0]?.url || '';

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Handle swipe navigation
  const handleSwipeLeft = useCallback(() => {
    if (equipmentImages.length <= 1) return;
    setSelectedImageIndex(prevIndex => 
      prevIndex === 0 ? equipmentImages.length - 1 : prevIndex - 1
    );
  }, [equipmentImages.length]);

  const handleSwipeRight = useCallback(() => {
    if (equipmentImages.length <= 1) return;
    setSelectedImageIndex(prevIndex => 
      prevIndex === equipmentImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [equipmentImages.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeRight,
    onSwipedRight: handleSwipeLeft,
    trackMouse: true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const toggleLike = () => {
    if (!equipment) return;
    
    const id = equipment.id.toString();
    
    if (isLiked(id)) {
      removeLikedItem(id);
      toast.success('Removed from favorites');
    } else {
      addLikedItem({
        id,
        name: equipment.name,
        price: Number(equipment.dailyRate),
        image: equipment.image || '',
        unit: 'day',
        dealerName: equipment.merchantName || '',
        dealerId: equipment.merchantId.toString()
      });
      toast.success('Added to favorites');
    }
  };

  const handleMerchantClick = () => {
    if (!equipment?.merchantId) return;
    navigate(`/rental-merchant-public/${equipment.merchantId}`);
  };

  const handleEquipmentClick = (equipmentId: number) => {
    navigate(`/onrent/equipment/${equipmentId}`);
  };

  if (isLoadingEquipment || !equipment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Calculate prices
  const dailyPrice = Number(equipment.dailyRate) || 0;
  const weeklyPrice = Number(equipment.weeklyRate) || dailyPrice * 6.5;
  const monthlyPrice = Number(equipment.monthlyRate) || dailyPrice * 25;
  const hourlyPrice = Math.round(dailyPrice / 8);

  const priceOptions = [
    { id: "hourly", label: "Per Hour", price: hourlyPrice },
    { id: "daily", label: "Per Day", price: dailyPrice },
    { id: "weekly", label: "Per Week", price: weeklyPrice },
    { id: "monthly", label: "Per Month", price: monthlyPrice }
  ];

  // Filter out current equipment from merchant's equipment
  const otherMerchantEquipment = merchantEquipment.filter(e => e.id !== equipment.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-24 -mt-16 pb-6">
        {/* Breadcrumb */}
        <Link 
          to="/onrent" 
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Category
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-3">
            {/* Main Image with Heart Icon */}
            <div 
              className="relative bg-gray-100 rounded-lg overflow-hidden group" 
              style={{ aspectRatio: '4/3' }}
              {...swipeHandlers}
            >
              {/* Heart Icon */}
              <Button
                variant={isLiked(equipment.id.toString()) ? "default" : "outline"}
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
                onClick={toggleLike}
              >
                <Heart 
                  className={`h-5 w-5 ${isLiked(equipment.id.toString()) ? 'fill-current text-red-500' : 'text-gray-700'}`} 
                />
              </Button>

              <div className="w-full h-full">
                <Zoom>
                  <img
                    src={selectedImage}
                    alt={equipment.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-equipment.jpg';
                    }}
                  />
                </Zoom>
                
                {/* Navigation arrows */}
                {equipmentImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={handleSwipeLeft}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={handleSwipeRight}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {equipmentImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {equipmentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-equipment.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Info */}
          <div>
            <div className="mb-4">
              <Badge className="mb-2 bg-green-500">
                {equipment.availability || (equipment.available && equipment.available > 0 ? 'Available' : 'Not Available')}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">{equipment.name}</h1>
              <p className="text-muted-foreground mb-2">{equipment.merchantName || equipment.supplier}</p>
              {(equipment.merchantLocation || equipment.location) && (
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{equipment.merchantLocation || equipment.location}</span>
                </div>
              )}
              {equipment.merchantRating && (
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{equipment.merchantRating}</span>
                  {equipment.merchantReviewCount && (
                    <span className="text-muted-foreground">({equipment.merchantReviewCount} reviews)</span>
                  )}
                </div>
              )}
            </div>

            {/* Pricing */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Select Rental Duration</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {priceOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={selectedDuration === option.id ? "default" : "outline"}
                      className={selectedDuration === option.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                      onClick={() => setSelectedDuration(option.id)}
                    >
                      <div className="text-center">
                        <div className="font-medium">₹{option.price.toLocaleString()}</div>
                        <div className="text-xs">{option.label}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Link 
                  to={`/onrent/booking/${equipment.id}`}
                  state={{ 
                    equipment,
                    selectedDuration,
                    selectedPrice: priceOptions.find(opt => opt.id === selectedDuration)?.price || 0
                  }}
                >
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                    Rent Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Features */}
            {equipment.features && equipment.features.length > 0 && (
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold">Key Features</h3>
                <ul>
                  {equipment.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="policies">Rental Policies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">
                    {equipment.description || 'No description available.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {equipment.specifications && Object.entries(equipment.specifications).map(([key, value]: [string, string]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value || 'N/A'}</span>
                      </div>
                    ))}
                    {equipment.condition && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Condition:</span>
                        <span className="text-muted-foreground capitalize">{equipment.condition}</span>
                      </div>
                    )}
                    {equipment.minRentalPeriod && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Min Rental Period:</span>
                        <span className="text-muted-foreground">{equipment.minRentalPeriod}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="policies" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                      <span>Full payment required at the time of booking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                      <span>Security deposit of ₹{equipment.securityDeposit || 'TBD'} will be refunded after equipment return</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                      <span>Equipment must be returned in the same condition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                      <span>Late return charges apply after agreed rental period</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Merchant Information Section */}
        <div className="bg-white shadow-sm rounded-lg p-4 mt-8">
          <h3 className="font-semibold text-lg mb-3">Rented By</h3>
          <div 
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-gray-50 rounded-lg cursor-pointer hover:from-orange-100 hover:to-gray-100 transition-all duration-200 border border-orange-100 hover:border-orange-200 group"
            onClick={handleMerchantClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleMerchantClick();
              }
            }}
          >
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center border-3 border-orange-200 group-hover:border-orange-300 transition-colors shadow-md">
                <Building2 className="h-10 w-10 text-orange-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg text-gray-900 truncate">
                  {equipment.merchantName || equipment.supplier || 'Rental Merchant'}
                </h4>
              </div>
              {(equipment.merchantLocation || equipment.location) && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{equipment.merchantLocation || equipment.location}</span>
                </div>
              )}
              {equipment.merchantRating && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">{equipment.merchantRating}</span>
                  </div>
                  {equipment.merchantReviewCount && (
                    <span className="text-sm text-gray-500">({equipment.merchantReviewCount} reviews)</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-1 text-orange-600 group-hover:text-orange-700 transition-colors">
              <ChevronDown className="h-6 w-6 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              <span className="text-xs font-medium whitespace-nowrap">View Profile</span>
            </div>
          </div>
        </div>

        {/* Other Equipment from This Merchant */}
        {otherMerchantEquipment.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-lg mb-4">
              More from {equipment.merchantName || equipment.supplier}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {otherMerchantEquipment.slice(0, 8).map((item) => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleEquipmentClick(item.id)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img 
                        src={item.image || '/placeholder-equipment.jpg'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-equipment.jpg';
                        }}
                      />
                    </div>
                    <h4 className="font-medium text-sm mb-1 truncate">{item.name}</h4>
                    <p className="text-orange-600 font-semibold text-sm">
                      ₹{Number(item.dailyRate).toLocaleString()}
                      <span className="text-gray-500 text-xs ml-1">/ day</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {otherMerchantEquipment.length > 8 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleMerchantClick}
                >
                  View All Equipment from {equipment.merchantName || equipment.supplier}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pb-16"></div>
    </div>
  );
};

export default EquipmentDetailsOR;
