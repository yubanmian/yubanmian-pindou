
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BeadColor, PERLER_PALETTE, Tool, GridState } from './types';
import BeadCanvas, { BeadCanvasHandle } from './components/BeadCanvas';
import { generatePixelArtFromPrompt, convertImageToPixelArt, imageToGrid } from './services/aiService';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState(50);
  const [grid, setGrid] = useState<string[][]>([]);
  const [history, setHistory] = useState<string[][][]>([]);
  const [selectedColor, setSelectedColor] = useState(PERLER_PALETTE[0].hex);
  const [selectedTool, setSelectedTool] = useState<Tool>('pencil');
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [tab, setTab] = useState<'create' | 'convert' | 'inspiration'>('create');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasHandleRef = useRef<BeadCanvasHandle>(null);

  // 模拟深度致敬像素艺术网站的灵感数据
  const [inspirations] = useState([
    { 
      id: 1, 
      title: "粗像素·可爱鸭子 (Dotown Style)", 
      author: "前田像素", 
      likes: "5.8k", 
      style: "Dotown", 
      beads: "84", 
      isWiggly: false,
      img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=duck&backgroundColor=ffd5dc" 
    },
    { 
      id: 2, 
      title: "3D像素字: 'LOVE' (Textcraft)", 
      author: "字体专家", 
      likes: "3.2k", 
      style: "艺术字", 
      beads: "450", 
      isWiggly: false,
      img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=love&backgroundColor=b6e3f4" 
    },
    { 
      id: 3, 
      title: "手绘抖抖猫 (Wiggly Paint)", 
      author: "动态画师", 
      likes: "1.2w", 
      style: "手绘抖抖", 
      beads: "120", 
      isWiggly: true,
      img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=cat&backgroundColor=c0aede" 
    },
    { 
      id: 4, 
      title: "红白机怀旧：像素爱心", 
      author: "Retro8Bit", 
      likes: "4.5k", 
      style: "经典游戏", 
      beads: "64", 
      isWiggly: false,
      img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=heart&backgroundColor=ffdfbf" 
    },
    { 
      id: 5, 
      title: "极简ICON：咖啡时间", 
      author: "图标库", 
      likes: "920", 
      style: "Lo-Fi", 
      beads: "32", 
      isWiggly: false,
      img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=coffee&backgroundColor=d1d4f9" 
    },
    { 
      id: 6, 
      title: "像素花园：向日葵", 
      author: "花园匠人", 
      likes: "2.1k", 
      style: "精细像素", 
      beads: "2200", 
      isWiggly: true,
      img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sunflower&backgroundColor=ffd5dc" 
    },
  ]);

  useEffect(() => {
    const newGrid = Array(gridSize).fill("").map(() => Array(gridSize).fill(""));
    setGrid(newGrid);
    setHistory([]); 
  }, [gridSize]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const currentClone = grid.map(row => [...row]);
      const newHistory = [...prev, currentClone];
      return newHistory.slice(-30);
    });
  }, [grid]);

  const handleUndo = () => {
    if (history.length === 0) {
      showToast("没有可以撤销的操作了");
      return;
    }
    const lastState = history[history.length - 1];
    setGrid(lastState);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleGridChange = (newGrid: string[][]) => {
    setGrid(newGrid);
  };

  const handleGenerate = async () => {
    if (!prompt) return showToast("请输入关键词哦！");
    setIsGenerating(true);
    saveToHistory();
    try {
      const imgUrl = await generatePixelArtFromPrompt(prompt);
      const newGrid = await imageToGrid(imgUrl, gridSize);
      setGrid(newGrid);
      showToast("灵感已传达！✨");
    } catch (e) {
      showToast("生成失败了，重试一下？");
    } finally {
      setIsGenerating(false);
    }
  };

  const useInspiration = async (imgUrl: string, style: string) => {
    setIsGenerating(true);
    saveToHistory();
    
    // 根据灵感风格智能调整网格
    if (style === 'Dotown' || style === 'Lo-Fi') setGridSize(20);
    else if (style === '精细像素') setGridSize(80);
    else setGridSize(40);

    setTab('create');
    try {
      const newGrid = await imageToGrid(imgUrl, gridSize);
      setGrid(newGrid);
      showToast("图纸已提取到画布！🌈");
    } catch (err) {
      showToast("加载灵感失败 T_T");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setIsGenerating(true);
      saveToHistory();
      try {
        const imgUrl = await convertImageToPixelArt(base64);
        const newGrid = await imageToGrid(imgUrl, gridSize);
        setGrid(newGrid);
        showToast("像素转换成功！🌈");
      } catch (err) {
        showToast("转换像素失败了 T_T");
      } finally {
        setIsGenerating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasHandleRef.current?.getCanvas();
    if (!canvas) {
      showToast("无法获取画布 T_T");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.download = `pingo-art-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("专业图纸已生成并保存！💾");
    } catch (err) {
      showToast("保存失败，请重试");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("分享链接已复制到剪贴板！🔗");
    } catch (err) {
      showToast("复制失败，请手动复制浏览器地址栏");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-pingo">
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg("")} />

      <header className="p-4 bg-pingo-primary text-white flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">grid_view</span>
          <h1 className="text-2xl tracking-wider">拼豆艺术馆</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleUndo} 
            className={`p-2 rounded-full transition-all flex items-center justify-center ${history.length > 0 ? 'bg-white/20 hover:bg-white/30' : 'opacity-40 cursor-not-allowed'}`}
          >
            <span className="material-symbols-outlined">undo</span>
          </button>
          <button onClick={handleDownload} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
            <span className="material-symbols-outlined">download</span>
          </button>
          <button onClick={handleShare} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      <div className="flex bg-gray-50 border-b border-gray-200">
        {['create', 'convert', 'inspiration'].map((t) => (
          <button 
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-3 text-[11px] font-bold transition-all uppercase tracking-tighter ${tab === t ? 'text-pingo-primary border-b-4 border-pingo-primary bg-white' : 'text-gray-400'}`}
          >
            {t === 'create' ? 'AI 创意生成' : t === 'convert' ? 'AI 照片转换' : '像素灵感宇宙'}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto bg-pingo-bg">
        {tab === 'inspiration' ? (
          <div className="p-4 grid grid-cols-2 gap-4 animate-fade-in">
            {inspirations.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm flex flex-col group border-b-4 border-gray-200 active:translate-y-1 transition-all">
                <div className={`relative aspect-square flex items-center justify-center p-6 ${item.isWiggly ? 'animate-wiggle' : ''}`}>
                  <div className="absolute inset-2 border-2 border-dashed border-gray-100 rounded-[1.5rem]"></div>
                  <img src={item.img} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 z-10" />
                  <div className="absolute top-3 left-3 flex gap-1 z-20">
                    <span className="px-2 py-0.5 rounded-full text-[7px] font-bold text-white bg-pingo-dark/80 backdrop-blur-sm">
                      {item.style}
                    </span>
                  </div>
                  <button 
                    onClick={() => useInspiration(item.img, item.style)}
                    className="absolute bottom-3 right-3 bg-pingo-secondary text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center z-20 active:scale-125 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
                <div className="p-3 bg-white">
                  <h3 className="text-[10px] font-bold text-pingo-dark line-clamp-1">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[9px] text-gray-400 font-mono">#{item.beads} beads</span>
                    <span className="text-[9px] text-red-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[9px] fill-current">favorite</span>
                      {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-2 py-6 text-center">
              <p className="text-[10px] text-gray-300 tracking-widest uppercase">更多像素灵感 正在加载...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
             <div className="w-full p-4 bg-white space-y-3">
              {tab === 'create' ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="输入灵感，如 '可爱的柯基'..."
                    className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-pingo-primary outline-none transition-all font-sans text-sm"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-xl text-white font-bold transition-all flex items-center justify-center min-w-[80px] ${isGenerating ? 'bg-gray-300' : 'bg-pingo-primary shadow-lg active:scale-95'}`}
                  >
                    {isGenerating ? <span className="material-symbols-outlined animate-spin">refresh</span> : '生成'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating}
                    className={`w-full py-2 rounded-xl border-2 border-dashed border-pingo-secondary text-pingo-secondary font-bold flex items-center justify-center gap-2 hover:bg-pingo-secondary/5 transition-all ${isGenerating ? 'opacity-50' : 'active:scale-95'}`}
                  >
                    <span className="material-symbols-outlined">{isGenerating ? 'refresh' : 'add_photo_alternate'}</span>
                    {isGenerating ? '处理中...' : '点击上传照片'}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
              )}
              
              <div className="px-1 pt-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                 <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-pingo-primary text-sm">square_foot</span>
                     <span className="text-sm font-bold text-gray-700">网格精度: {gridSize} x {gridSize}</span>
                   </div>
                 </div>
                 <input 
                  type="range" min="10" max="120" step="10" 
                  value={gridSize} 
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pingo-primary"
                 />
              </div>
            </div>

            <div className="w-full p-4 flex flex-col items-center">
              {grid.length > 0 && (
                <div className="w-full mb-4">
                  <BeadCanvas 
                    ref={canvasHandleRef}
                    grid={grid} 
                    setGrid={handleGridChange} 
                    onActionStart={saveToHistory} 
                    selectedColor={selectedColor} 
                    selectedTool={selectedTool} 
                  />
                </div>
              )}

              <div className="w-full bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex flex-col gap-4 sticky bottom-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedTool('pencil')} className={`p-3 rounded-2xl transition-all ${selectedTool === 'pencil' ? 'bg-pingo-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}><span className="material-symbols-outlined">edit</span></button>
                    <button onClick={() => setSelectedTool('eraser')} className={`p-3 rounded-2xl transition-all ${selectedTool === 'eraser' ? 'bg-pingo-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}><span className="material-symbols-outlined">ink_eraser</span></button>
                    <button onClick={() => { saveToHistory(); setGrid(Array(gridSize).fill("").map(() => Array(gridSize).fill(""))); }} className="p-3 rounded-2xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"><span className="material-symbols-outlined">delete_sweep</span></button>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-inner bead-shadow ring-2 ring-gray-100" style={{ backgroundColor: selectedColor || '#fff' }} />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {PERLER_PALETTE.map((color) => (
                    <button key={color.id} onClick={() => { setSelectedColor(color.hex); setSelectedTool('pencil'); }} className={`flex-shrink-0 w-8 h-8 rounded-full bead-shadow border-2 transition-transform active:scale-90 ${selectedColor === color.hex ? 'border-pingo-dark scale-110 ring-2 ring-pingo-primary/20' : 'border-transparent'}`} style={{ backgroundColor: color.hex }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="p-3 bg-white text-center text-gray-400 text-[10px] tracking-widest uppercase font-sans">
        Pingo Art • Created for Pixel Lovers • v2.2
      </footer>
    </div>
  );
};

export default App;
