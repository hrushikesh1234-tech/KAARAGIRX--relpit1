
import React from 'react';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookmarkItem } from '@/data/bookmarkData';

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  viewMode: 'grid' | 'list';
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, viewMode }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'architect': 'bg-blue-100 text-blue-800',
      'contractor': 'bg-green-100 text-green-800',
      'material': 'bg-yellow-100 text-yellow-800',
      'machine/vehicle': 'bg-purple-100 text-purple-800',
      'dealer': 'bg-red-100 text-red-800',
      'rental company': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-20 sm:h-20 flex-shrink-0">
            <img
              src={bookmark.image}
              alt={bookmark.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{bookmark.title}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor(bookmark.category)}`}>
                {bookmark.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{bookmark.description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{bookmark.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(bookmark.dateAdded)}</span>
                </div>
              </div>
              <Button size="sm" className="w-full sm:w-auto h-8">
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative">
        <img
          src={bookmark.image}
          alt={bookmark.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span className={`absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(bookmark.category)}`}>
          {bookmark.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{bookmark.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bookmark.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{bookmark.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(bookmark.dateAdded)}</span>
          </div>
        </div>
        <Button size="sm" className="w-full h-8">
          <ExternalLink className="h-3 w-3 mr-1" />
          Visit
        </Button>
      </div>
    </div>
  );
};

export default BookmarkCard;
