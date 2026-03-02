
import React, { useState } from 'react';
import { CalendarEntry } from '../types';
import Toast from '../components/Toast';

const Calendar: React.FC = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  // Fixed Anchor Date: 2026年2月3日
  const baseYear = 2026;
  const baseMonth = 2; // February
  const baseDay = 3;

  const displayYear = baseYear + Math.floor((baseMonth - 1 + monthOffset) / 12);
  const displayMonth = ((baseMonth - 1 + monthOffset) % 12 + 12) % 12 + 1;

  // Mock entries for Feb 2026
  const entries: CalendarEntry[] = [
    { day: 1, icon: 'science', color: 'text-blue-500', title: '万有引力', discipline: '物理', date: '2月1日' },
    { day: 2, icon: 'palette', color: 'text-amber-500', title: '印象主义', discipline: '艺术', date: '2月2日' },
    { day: 3, icon: 'lightbulb', color: 'text-primary', title: '深度学习', discipline: '人工智能', date: '2月3日' },
  ];

  const handleEntryClick = (entry: CalendarEntry) => {
    setToastMsg(`回顾: ${entry.title}`);
  };

  // February 2026 starts on a Sunday (0)
  // Number of days in Feb 2026 is 28
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth - 1, 1).getDay();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display pb-32">
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg('')} />
      
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
        <div className="size-12 flex items-center">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">history</span>
        </div>
        <h2 className="text-[#0d121b] dark:text-white text-lg font-bold flex-1 text-center">智慧历程回顾</h2>
        <div className="size-12 flex items-center justify-end">
          <span onClick={() => setToastMsg('搜索功能研发中')} className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">search</span>
        </div>
      </div>

      <div className="px-4 py-2">
        {/* Streak Card */}
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-2xl p-5 flex items-center justify-between shadow-sm group">
          <div>
            <p className="text-sm font-semibold text-primary/80 dark:text-blue-400">连续学习</p>
            <p className="text-3xl font-bold text-primary dark:text-blue-300">128 天</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-active:scale-110 transition-transform">
            <span className="material-symbols-outlined material-symbols-fill">auto_awesome</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setMonthOffset(prev => prev - 1)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <p className="text-[#0d121b] dark:text-white text-base font-bold">{displayYear}年 {displayMonth}月</p>
            <button 
              onClick={() => setMonthOffset(prev => prev + 1)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <p key={day} className="text-[#4c669a] dark:text-slate-400 text-xs font-bold uppercase">{day}</p>
            ))}
            
            {/* Blank placeholders */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const entry = monthOffset === 0 ? entries.find(e => e.day === dayNum) : null;
              const isToday = dayNum === baseDay && monthOffset === 0;
              
              return (
                <div 
                  key={dayNum} 
                  onClick={() => entry && handleEntryClick(entry)}
                  className={`flex flex-col items-center justify-center h-14 w-full gap-1 rounded-xl transition-all cursor-pointer ${isToday ? 'bg-primary/10 dark:bg-primary/30 border-2 border-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{dayNum}</span>
                  {entry && (
                    <span className={`material-symbols-outlined text-[18px] ${entry.color} material-symbols-fill`}>{entry.icon}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Insights Grid */}
        <div className="mt-8 flex items-center justify-between">
          <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">每日洞察</h3>
          <span className="text-primary text-sm font-semibold cursor-pointer active:underline">查看全部</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {entries.map((entry, idx) => (
            <div 
              key={idx} 
              onClick={() => handleEntryClick(entry)}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md"
            >
              <div className={`size-10 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center ${entry.color}`}>
                <span className="material-symbols-outlined material-symbols-fill">{entry.icon}</span>
              </div>
              <div>
                <h4 className="text-[#0d121b] dark:text-white font-bold text-base truncate">{entry.title}</h4>
                <p className="text-[#4c669a] dark:text-slate-400 text-[10px] mt-0.5">{entry.date} • {entry.discipline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
