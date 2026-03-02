
import React, { useState } from 'react';
import Toast from '../components/Toast';

const WidgetPreview: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [size, setSize] = useState('Medium');
  const [style, setStyle] = useState('Classic');
  const [toastMsg, setToastMsg] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const styles = [
    { id: 'Classic', name: '经典纸质', bg: 'bg-[#fdfaf5]', text: 'text-slate-800', accent: 'text-amber-600' },
    { id: 'Modern', name: '现代简约', bg: 'bg-white', text: 'text-slate-700', accent: 'text-primary' },
    { id: 'Art', name: '艺术画布', bg: 'bg-gradient-to-br from-orange-100 to-rose-100', text: 'text-rose-900', accent: 'text-rose-500' },
    { id: 'Tech', name: '科技深邃', bg: 'bg-[#0a0a0a]', text: 'text-white/90', accent: 'text-blue-400' },
  ];

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setToastMsg('已成功添加到桌面！');
    }, 1200);
  };

  const currentStyle = styles.find(s => s.id === style) || styles[0];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display pb-32">
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg('')} />
      
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-50 bg-background-light dark:bg-background-dark backdrop-blur-md">
        <div onClick={onBack} className="text-[#0d121b] dark:text-white flex size-12 shrink-0 items-center cursor-pointer active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <h2 className="text-[#0d121b] dark:text-white text-lg font-bold flex-1 text-center pr-12">小组件样式预览</h2>
      </div>

      <div className="px-4 py-4">
        {/* Phone Mockup */}
        <div className="relative w-full aspect-[9/16] max-w-[280px] mx-auto bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] border-[8px] border-slate-900 dark:border-slate-700 shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800')" }}></div>
          <div className="relative z-10 p-5 flex flex-col items-center">
            {/* Status Bar */}
            <div className="w-full flex justify-between px-2 mb-8 text-white/90">
              <span className="text-[10px] font-bold">9:41</span>
              <div className="flex gap-1">
                <span className="material-symbols-outlined text-[12px] material-symbols-fill">wifi</span>
                <span className="material-symbols-outlined text-[12px] material-symbols-fill">battery_full</span>
              </div>
            </div>

            {/* Widget Itself */}
            <div className={`w-full ${currentStyle.bg} p-5 rounded-3xl shadow-lg border border-white/20 transition-all duration-500 transform ${isApplying ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${currentStyle.accent.replace('text-', 'bg-')}/20 p-1 rounded-lg`}>
                  <span className={`material-symbols-outlined ${currentStyle.accent} text-[12px] material-symbols-fill`}>lightbulb</span>
                </div>
                <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400">每日灵感</span>
              </div>
              <p className={`text-xs font-medium leading-relaxed italic ${currentStyle.text}`}>“成就伟业的唯一途径，就是热爱你所做的工作。”</p>
              <div className="mt-4 flex justify-between items-end">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">史蒂夫·乔布斯</span>
                <span className={`material-symbols-outlined text-[10px] ${currentStyle.accent} opacity-60 material-symbols-fill`}>auto_awesome</span>
              </div>
            </div>

            {/* App Icons Placeholder */}
            <div className="mt-8 grid grid-cols-4 gap-4 w-full px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-square bg-white/20 backdrop-blur-md rounded-xl"></div>)}
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold px-2 pt-4">组件尺寸</h3>
        <div className="flex py-3">
          <div className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-slate-200/50 dark:bg-slate-800 p-1">
            {['小号', '中号', '大号'].map((s, idx) => {
              const sizes = ['Small', 'Medium', 'Large'];
              return (
                <button
                  key={s}
                  onClick={() => setSize(sizes[idx])}
                  className={`flex flex-1 h-full items-center justify-center rounded-xl text-sm font-semibold transition-all ${size === sizes[idx] ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Selection */}
        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold px-2 pt-4">视觉样式</h3>
        <div className="flex overflow-x-auto gap-4 py-3 no-scrollbar pb-6">
          {styles.map((s) => (
            <div key={s.id} onClick={() => setStyle(s.id)} className="flex flex-col items-center shrink-0 w-24 gap-2 cursor-pointer group">
              <div className={`w-full aspect-square rounded-2xl border-2 transition-all flex items-center justify-center overflow-hidden ${style === s.id ? 'border-primary ring-4 ring-primary/10' : 'border-transparent shadow-sm group-hover:border-gray-300'}`}>
                <div className={`w-full h-full ${s.bg} p-2 flex flex-col justify-center`}>
                  <div className="h-1 w-8 bg-gray-300 mb-1 rounded"></div>
                  <div className="h-1 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
              <span className={`text-xs font-bold transition-colors ${style === s.id ? 'text-primary' : 'text-slate-500'}`}>{s.name}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="py-6 mb-24">
          <button 
            onClick={handleApply}
            disabled={isApplying}
            className={`w-full bg-primary text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isApplying ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isApplying ? (
              <span className="material-symbols-outlined animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined material-symbols-fill text-xl">add_to_home_screen</span>
            )}
            {isApplying ? '正在同步...' : '应用到桌面'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetPreview;
