import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
// Icons temporarily removed due to import issues

export default function NotFound() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <div className="h-10 w-10 flex items-center justify-center text-2xl font-bold text-red-600">!</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="mr-2">←</span>
              Go back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
