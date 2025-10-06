
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-8">Start building your amazing project here!</p>
        
        <Link to="/bookmarked">
          <Button size="lg" className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            View Bookmarked Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
