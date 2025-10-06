import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  professionType?: 'contractor' | 'architect';
}

const PageBackground: React.FC<PageBackgroundProps> = ({ 
  children, 
  professionType = 'contractor' 
}) => {
  const backgroundColor = professionType === 'contractor' 
    ? 'bg-[#51504f]' // fuscous gray for contractors
    : 'bg-[#bcbcbd]'; // french gray for architects

  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      {children}
    </div>
  );
};

export default PageBackground;
