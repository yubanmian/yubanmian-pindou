
import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: '每日灵感', icon: 'auto_awesome' },
    { id: 'calendar', label: '日历', icon: 'calendar_today' },
    { id: 'settings', label: '设置', icon: 'settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-6 pt-3 pb-8 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id || (activeTab === 'widget-preview' && tab.id === 'settings')
                ? 'text-primary'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === tab.id ? 'material-symbols-fill' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default BottomNav;
