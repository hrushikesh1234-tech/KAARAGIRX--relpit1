import React, { createContext, useContext, useState, ReactNode } from 'react';

type ProfessionType = 'contractor' | 'architect' | null;

interface ProfessionContextType {
  profession: ProfessionType;
  setProfession: (profession: ProfessionType) => void;
}

const ProfessionContext = createContext<ProfessionContextType | undefined>(undefined);

export const ProfessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profession, setProfession] = useState<ProfessionType>(null);

  return (
    <ProfessionContext.Provider value={{ profession, setProfession }}>
      {children}
    </ProfessionContext.Provider>
  );
};

export const useProfession = (): ProfessionContextType => {
  const context = useContext(ProfessionContext);
  if (context === undefined) {
    throw new Error('useProfession must be used within a ProfessionProvider');
  }
  return context;
};
