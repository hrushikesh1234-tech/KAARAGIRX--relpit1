
import React from 'react';

const tabs = ['Chats', 'Calls', 'Help'] as const;

type Tab = typeof tabs[number];

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <div className="bg-[#0B141A] border-b border-gray-800">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-[#D4AF37] font-semibold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
