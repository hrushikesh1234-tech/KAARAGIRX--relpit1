
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  customTabs?: Tab[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, customTabs }) => {
  const defaultTabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const tabs = customTabs || defaultTabs;

  return (
    <div className="border-t border-gray-800 sticky top-0 z-40 bg-black">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
