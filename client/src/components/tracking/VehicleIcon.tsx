import { cn } from "@/lib/utils";

interface VehicleIconProps {
  type: "truck" | "tractor" | "tempo";
  className?: string;
}

export const VehicleIcon = ({ type, className }: VehicleIconProps) => {
  const baseClasses = "w-10 h-10 p-2 rounded-full";
  
  const getIcon = () => {
    switch (type) {
      case "truck":
        return (
          <>
            <path d="M5 16h2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z" />
            <path d="M16 3H2v13h1a3 3 0 1 1 6 0h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 10h-2V5h2v8z" />
            <path d="M20 8h-3v6h1a2 2 0 1 1 0 4h-1v1a1 1 0 1 1-2 0v-1H8v1a1 1 0 1 1-2 0v-1H5a3 3 0 0 1 0-6h1V8H2a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2z" />
          </>
        );
      case "tractor":
        return (
          <>
            <path d="M5 14h2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z" />
            <path d="M16 3H2v13h1a3 3 0 1 1 6 0h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 10h-2V5h2v8z" />
            <circle cx="7" cy="17" r="2" />
            <path d="M19 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-1 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
          </>
        );
      case "tempo":
        return (
          <>
            <path d="M5 14h2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z" />
            <path d="M16 3H2v13h1a3 3 0 1 1 6 0h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 10h-2V5h2v8z" />
            <path d="M18 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            <path d="M7 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
          </>
        );
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "truck":
        return "text-blue-500 bg-blue-100";
      case "tractor":
        return "text-green-500 bg-green-100";
      case "tempo":
        return "text-purple-500 bg-purple-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className={cn(baseClasses, getColorClasses(), className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full"
      >
        {getIcon()}
      </svg>
    </div>
  );
};
