import { useState, useEffect } from 'react';
import { Bookmark, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarked' | 'booked'>('bookmarked');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setIsVisible(rect.bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={cn(
        'fixed top-16 left-0 right-0 bg-white shadow-md z-40 transition-all duration-300 transform',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 p-1 bg-muted rounded-md">
          <Button
            variant={activeTab === 'bookmarked' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'flex-1 justify-center gap-2',
              activeTab === 'bookmarked' ? 'bg-orange-500 hover:bg-orange-600' : ''
            )}
            onClick={() => setActiveTab('bookmarked')}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarked</span>
          </Button>
          <Button
            variant={activeTab === 'booked' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'flex-1 justify-center gap-2',
              activeTab === 'booked' ? 'bg-green-500 hover:bg-green-600' : ''
            )}
            onClick={() => {
              setActiveTab('booked');
              navigate('/onrent/bookings');
            }}
          >
            <BookCheck className="h-4 w-4" />
            <span>Booked</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
