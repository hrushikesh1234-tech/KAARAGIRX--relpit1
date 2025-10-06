import React, { ReactNode } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-glow ${className}`}>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default GlowingCard;
