
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <div className="text-gray-500 max-w-sm mx-auto">{description}</div>
    </div>
  );
}
