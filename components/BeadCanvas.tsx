
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Tool } from '../types';

interface BeadCanvasProps {
  grid: string[][];
  setGrid: (grid: string[][]) => void;
  onActionStart?: () => void;
  selectedColor: string;
  selectedTool: Tool;
}

export interface BeadCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

const BeadCanvas = forwardRef<BeadCanvasHandle, BeadCanvasProps>(({ grid, setGrid, onActionStart, selectedColor, selectedTool }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const size = grid.length;

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }));

  // Draw the entire grid on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // 优化性能
    if (!ctx) return;

    const width = canvas.width;
    const cellSize = width / size;

    // 填充底色
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, width);

    // Draw background grid dots and beads
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cellColor = grid[y][x];
        const centerX = x * cellSize + cellSize / 2;
        const centerY = y * cellSize + cellSize / 2;
        const radius = (cellSize / 2) * 0.85;

        if (cellColor) {
          // Draw bead
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fillStyle = cellColor;
          ctx.fill();

          // Highlight for bead effect
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = Math.max(0.5, cellSize * 0.05);
          ctx.stroke();

          // Inner highlight shine
          ctx.beginPath();
          ctx.arc(centerX - radius/3, centerY - radius/3, radius/4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fill();
        } else {
          // Draw empty peg
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(1, radius * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = '#e5e7eb';
          ctx.fill();
        }
      }
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [grid, size]);

  const getEventCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.floor(((clientX - rect.left) / rect.width) * size);
    const y = Math.floor(((clientY - rect.top) / rect.height) * size);
    
    if (x >= 0 && x < size && y >= 0 && y < size) {
      return { x, y };
    }
    return null;
  };

  const updateCell = (x: number, y: number) => {
    const targetColor = selectedTool === 'pencil' ? selectedColor : "";
    if (grid[y][x] !== targetColor) {
      const newGrid = grid.map(row => [...row]);
      newGrid[y][x] = targetColor;
      setGrid(newGrid);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    // 阻止默认行为以防止页面滚动（尤其是触摸屏上）
    if (e.cancelable) e.preventDefault();
    
    onActionStart?.(); // 绘制开始前保存历史
    setIsDrawing(true);
    const coords = getEventCoords(e);
    if (coords) updateCell(coords.x, coords.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    
    const coords = getEventCoords(e);
    if (coords) updateCell(coords.x, coords.y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const stopDrawing = () => setIsDrawing(false);
    window.addEventListener('mouseup', stopDrawing);
    return () => window.removeEventListener('mouseup', stopDrawing);
  }, []);

  return (
    <div className="w-full flex justify-center p-1">
      <div className="relative w-full max-w-[500px] aspect-square bg-gray-50 rounded-2xl shadow-inner overflow-hidden cursor-crosshair border-4 border-pingo-dark/10">
        <canvas
          ref={canvasRef}
          width={1000} // 高分辨率缓冲区
          height={1000}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="w-full h-full touch-none"
        />
      </div>
    </div>
  );
});

export default BeadCanvas;
