
import React, { useState } from 'react';
import { TabType } from '../types';
import Toast from '../components/Toast';

interface SettingsProps {
  onTabChange: (tab: TabType) => void;
}

const Settings: React.FC<SettingsProps> = ({ onTabChange }) => {
  const [toastMsg, setToastMsg] = useState('');
  const [categories, setCategories] = useState([
    { id: '1', name: '脑筋急转弯', checked: true },
    { id: '2', name: '十万个为什么', checked: false },
    { id: '3', name: '一分钟物理', checked: true },
    { id: '4', name: '地理', checked: false },
    { id: '5', name: '生物', checked: false },
    { id: '6', name: '励志名言', checked: true },
    { id: '7', name: '名画欣赏', checked: false },
  ]);

  const [notifications, setNotifications] = useState(true);

  const toggleCategory = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
    setToastMsg('偏好已更新');
  };

  const handleLogout = () => {
    setToastMsg('正在退出...');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display pb-32">
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg('')} />
      
      {/* Navbar */}
      <div className="sticky top-0 z-10 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="w-10"></div>
        <h2 className="text-[#0d121b] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">设置</h2>
        <div className="w-10 flex justify-end">
          <span 
            onClick={() => setToastMsg('帮助中心加载中')}
            className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
          >
            help
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Widget Config */}
        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold px-4 pb-2 pt-6">小组件配置</h3>
        <div className="mt-2 mx-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
          <div 
            onClick={() => onTabChange('widget-preview')}
            className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 size-12 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined material-symbols-fill">palette</span>
              </div>
              <div>
                <p className="text-[#0d121b] dark:text-white text-base font-semibold">小组件样式设置</p>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm">自定义桌面小组件的外观风格</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>

          <div 
            onClick={() => setToastMsg('更新频率已设为: 每小时')}
            className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="text-orange-500 flex items-center justify-center rounded-xl bg-orange-500/10 size-12 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined material-symbols-fill">sync</span>
              </div>
              <div>
                <p className="text-[#0d121b] dark:text-white text-base font-semibold">刷新频率</p>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm">每小时自动更新内容</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>
        </div>

        {/* Categories */}
        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold px-4 pb-2 pt-8">内容类目</h3>
        <div className="mt-2 mx-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm px-4">
          {categories.map((cat, idx) => (
            <label key={cat.id} className={`flex items-center justify-between py-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors ${idx !== categories.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
              <p className="text-[#0d121b] dark:text-white text-base font-medium">{cat.name}</p>
              <input 
                type="checkbox" 
                checked={cat.checked}
                onChange={() => toggleCategory(cat.id)}
                className="h-6 w-6 rounded-full border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* General */}
        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold px-4 pb-2 pt-8">通用设置</h3>
        <div className="mt-2 mx-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="text-pink-500 flex items-center justify-center rounded-xl bg-pink-500/10 size-12">
                <span className="material-symbols-outlined material-symbols-fill">notifications_active</span>
              </div>
              <div>
                <p className="text-[#0d121b] dark:text-white text-base font-semibold">每日提醒</p>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm">每天 08:00 推送新知识</p>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer" onClick={() => {setNotifications(!notifications); setToastMsg(notifications ? '通知已关闭' : '通知已开启')}}>
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${notifications ? 'translate-x-full' : ''}`}></div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setToastMsg('个人信息管理系统维护中')}
            className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-teal-500 flex items-center justify-center rounded-xl bg-teal-500/10 size-12">
                <span className="material-symbols-outlined material-symbols-fill">person</span>
              </div>
              <div>
                <p className="text-[#0d121b] dark:text-white text-base font-semibold">账号与安全</p>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm">管理您的个人信息</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 mt-8 text-center pb-8">
          <button 
            onClick={handleLogout}
            className="w-full bg-white dark:bg-gray-900 text-red-500 font-bold py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-all hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            退出登录
          </button>
          <p className="mt-4 text-gray-400 text-xs">版本号 1.2.4 (Build 42)</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
