
import React, { useState, useEffect, useRef } from 'react';
import { Inspiration } from '../types';
import { fetchDailyInspiration } from '../services/geminiService';
import Toast from '../components/Toast';

const Home: React.FC = () => {
  const [inspiration, setInspiration] = useState<Inspiration | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  
  // Swipe detection refs
  const touchStartX = useRef<number | null>(null);
  const swipeThreshold = 50;

  // For display purposes, we anchor to 2026-02-03
  const anchorDate = new Date(2026, 1, 3); // Feb is 1 in JS Date

  const loadData = async (topic?: string, silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchDailyInspiration(topic);
      setInspiration(data);
    } catch (error) {
      setToastMsg('加载灵感失败，请重试');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerNext = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setAnimationClass('animate-slide-out-left');
    
    // Fetch data early for a smoother transition
    const data = await fetchDailyInspiration("random unique fact in chinese");
    
    setTimeout(() => {
      setInspiration(data);
      setAnimationClass('animate-slide-in-right');
      setIsRefreshing(false);
      setToastMsg('发现新知识');
      
      // Reset to fade-in after slide-in animation finishes
      setTimeout(() => {
        setAnimationClass('animate-fade-in');
      }, 300);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Swipe Left
    if (diff > swipeThreshold) {
      triggerNext();
    }
    
    touchStartX.current = null;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData("random interesting trivia in chinese");
    setIsRefreshing(false);
    setToastMsg('灵感已刷新');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: inspiration?.title,
        text: inspiration?.explanation,
        url: window.location.href,
      }).catch(() => setToastMsg('分享失败'));
    } else {
      setToastMsg('链接已复制到剪贴板');
    }
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-primary">
            <span className="material-symbols-outlined text-4xl">sync</span>
          </div>
          <p className="text-gray-500 font-medium">寻找灵感中...</p>
        </div>
      </div>
    );
  }

  const dateString = `${anchorDate.getMonth() + 1}月${anchorDate.getDate()}日`;
  const weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][anchorDate.getDay()];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display flex flex-col pb-32">
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg('')} />
      
      {/* Header */}
      <div className="flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between sticky top-0 z-20">
        <span className="text-[#0d121b] dark:text-white text-xl font-bold tracking-tight">每日灵感</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className={`flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm transition-transform active:rotate-180 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <span className="material-symbols-outlined text-[24px] text-gray-700 dark:text-gray-200">refresh</span>
          </button>
          <button onClick={handleShare} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm active:scale-90">
            <span className="material-symbols-outlined text-[24px] text-gray-700 dark:text-gray-200">share</span>
          </button>
          <button onClick={() => setToastMsg('用户中心即将上线')} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm active:scale-90">
            <span className="material-symbols-outlined text-[24px] text-gray-700 dark:text-gray-200">account_circle</span>
          </button>
        </div>
      </div>

      <div className="px-4 overflow-y-auto">
        <div className="pt-6 pb-6">
          <p className="text-[#4c669a] dark:text-gray-400 text-sm font-medium">2026年{dateString} · {weekDay}</p>
          <h1 className="text-[#0d121b] dark:text-white text-3xl font-bold mt-1">早安，探索者</h1>
        </div>

        {inspiration && (
          <div className="flex flex-col">
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-white dark:bg-gray-900 group transition-all cursor-grab active:cursor-grabbing ${animationClass}`}
            >
              <div className="aspect-[4/5] w-full relative overflow-hidden">
                <img 
                  alt="Inspiration" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={inspiration.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-semibold mb-3 tracking-widest">
                    {inspiration.category}
                  </span>
                  <h2 className="text-white text-4xl font-bold leading-tight drop-shadow-lg" dangerouslySetInnerHTML={{ __html: inspiration.title.replace(' ', '<br/>') }}></h2>
                  <div 
                    onClick={() => setToastMsg('向左滑动或点击探索功能即将上线')}
                    className="mt-6 flex items-center gap-2 text-white/90 text-sm font-medium transition-colors"
                  >
                    <span>向左滑动切换下一个知识</span>
                    <span className="material-symbols-outlined text-sm animate-pulse">swipe_left</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-8 px-2 ${animationClass}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-primary"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">极简解析</span>
              </div>
              <p className="text-[#0d121b] dark:text-gray-200 text-lg leading-relaxed font-medium">
                {inspiration.explanation}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#1a2131] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="material-symbols-outlined text-blue-500 mb-2 material-symbols-fill">light_mode</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">相关知识</p>
                  <p className="text-sm font-bold dark:text-white">{inspiration.tags[0]}</p>
                </div>
                <div className="bg-white dark:bg-[#1a2131] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="material-symbols-outlined text-orange-400 mb-2 material-symbols-fill">school</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">学科分类</p>
                  <p className="text-sm font-bold dark:text-white">{inspiration.discipline}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
