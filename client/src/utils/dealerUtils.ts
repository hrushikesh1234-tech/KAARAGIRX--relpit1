export const safeDealerId = (id: number | string): string => 
  typeof id === 'number' ? id.toString() : id;

export const getRating = (rating?: number): number => rating || 0;

export const formatCategory = (category?: string): string => {
  if (!category) return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return 'Price not available';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};
