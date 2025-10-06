
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface CategoryFilterProps {
  categories: Array<{
    id: string;
    name: string;
    count: number;
    subcategories: string[];
    image?: string;
  }>;
  selectedCategory: string;
  selectedSubCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  selectedSubCategory,
  onCategoryChange, 
  onSubCategoryChange 
}: CategoryFilterProps) => {
  const [expandedCategory, setExpandedCategory] = useState(selectedCategory);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      onCategoryChange(categoryId);
      onSubCategoryChange("");
      setExpandedCategory("");
    } else {
      onCategoryChange(categoryId);
      setExpandedCategory(expandedCategory === categoryId ? "" : categoryId);
      onSubCategoryChange("");
    }
  };

  const handleSubCategoryClick = (category: string, subCategory: string) => {
    const location = searchParams.get('location') || '';
    navigate(`/dealers?category=${category}&subcategory=${encodeURIComponent(subCategory)}&location=${location}`);
  };

  // Filter out the "all" category for the grid display
  const gridCategories = categories.filter(cat => cat.id !== "all");

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Categories</h3>
      </CardHeader>
      <CardContent className="p-4">
        {/* All Materials option */}
        <button
          onClick={() => handleCategoryClick("all")}
          className={cn(
            "w-full text-left px-4 py-2 mb-4 rounded-lg border hover:bg-gray-100 transition-colors",
            selectedCategory === "all" && "bg-blue-50 border-blue-600 text-blue-600"
          )}
        >
          <span className="text-sm font-medium">All Materials</span>
        </button>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-3">
          {gridCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="relative">
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    "w-full rounded-lg border-2 overflow-hidden hover:shadow-md transition-all",
                    selectedCategory === category.id ? "border-blue-600" : "border-gray-200"
                  )}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-2xl">📦</div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{category.name}</span>
                      {category.subcategories.length > 0 && (
                        <div className="ml-1">
                          {expandedCategory === category.id ? (
                            <span className="text-xs">▼</span>
                          ) : (
                            <span className="text-xs">▶</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
              
              {/* Subcategories */}
              {expandedCategory === category.id && category.subcategories.length > 0 && (
                <div className="bg-gray-50 border rounded-lg p-2 space-y-1">
                  {category.subcategories.map((subCategory) => (
                    <button
                      key={subCategory}
                      onClick={() => handleSubCategoryClick(category.id, subCategory)}
                      className={cn(
                        "w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors",
                        selectedSubCategory === subCategory && "bg-blue-100 text-blue-700 font-medium"
                      )}
                    >
                      {subCategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
