
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Tool, PERLER_PALETTE } from '../types';

interface BeadCanvasProps {
  grid: string[][];
  setGrid: (grid: string[][]) => void;
  onActionStart?: () => void;
  selectedColor: string;
  selectedTool: Tool;
}

export interface BeadCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  generateBlueprint: () => string;
}

const BeadCanvas = forwardRef<BeadCanvasHandle, BeadCanvasProps>(({ grid, setGrid, onActionStart, selectedColor, selectedTool }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const localGridRef = useRef<string[][]>([]);
  const size = grid.length;

  // Sync local grid when prop grid changes (e.g. from AI generation or Undo)
  useEffect(() => {
    localGridRef.current = grid.map(row => [...row]);
    drawCanvas();
  }, [grid, size]);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    generateBlueprint: () => {
      const blueprintCanvas = document.createElement('canvas');
      const ctx = blueprintCanvas.getContext('2d');
      if (!ctx) return "";

      const padding = 60;
      const cellSize = 30;
      const gridWidth = size * cellSize;
      const footerHeight = 200;
      
      blueprintCanvas.width = gridWidth + padding * 2;
      blueprintCanvas.height = gridWidth + padding * 2 + footerHeight;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, blueprintCanvas.width, blueprintCanvas.height);

      // Draw Grid Numbers (Top & Left)
      ctx.fillStyle = '#999';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < size; i++) {
        // Top numbers
        ctx.fillText((i + 1).toString(), padding + i * cellSize + cellSize / 2, padding / 2);
        // Left numbers
        ctx.fillText((i + 1).toString(), padding / 2, padding + i * cellSize + cellSize / 2);
      }

      // Draw Grid Lines
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 1;
      for (let i = 0; i <= size; i++) {
        // Vertical
        ctx.beginPath();
        ctx.moveTo(padding + i * cellSize, padding);
        ctx.lineTo(padding + i * cellSize, padding + gridWidth);
        ctx.stroke();
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(padding, padding + i * cellSize);
        ctx.lineTo(padding + gridWidth, padding + i * cellSize);
        ctx.stroke();
      }

      // Statistics
      const colorCounts: Record<string, number> = {};
      let totalBeads = 0;

      // Draw Beads
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const color = localGridRef.current[y][x];
          if (color) {
            totalBeads++;
            colorCounts[color] = (colorCounts[color] || 0) + 1;

            const centerX = padding + x * cellSize + cellSize / 2;
            const centerY = padding + y * cellSize + cellSize / 2;
            const radius = cellSize * 0.4;

            // Bead Circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.stroke();

            // Find Color ID
            const beadInfo = PERLER_PALETTE.find(p => p.hex.toLowerCase() === color.toLowerCase());
            if (beadInfo) {
              ctx.fillStyle = (parseInt(color.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
              ctx.font = 'bold 8px sans-serif';
              ctx.fillText(beadInfo.id, centerX, centerY);
            }
          }
        }
      }

      // Footer Section
      const footerY = padding + gridWidth + 40;
      ctx.fillStyle = '#333';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`像素总量: ${totalBeads}`, padding, footerY);

      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('画布统计', padding, footerY + 30);

      // Color Palette Summary
      const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      let currentX = padding;
      let currentY = footerY + 60;
      const itemWidth = 80;
      const itemHeight = 60;

      sortedColors.forEach(([color, count]) => {
        const beadInfo = PERLER_PALETTE.find(p => p.hex.toLowerCase() === color.toLowerCase());
        const label = beadInfo ? beadInfo.id : '??';

        // Swatch
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(currentX, currentY, 40, 30, 8);
        ctx.fill();
        ctx.strokeStyle = '#eee';
        ctx.stroke();

        // Label & Count
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, currentX + 20, currentY - 10);
        ctx.font = '12px sans-serif';
        ctx.fillText(count.toString(), currentX + 20, currentY + 45);

        currentX += itemWidth;
        if (currentX + itemWidth > blueprintCanvas.width - padding) {
          currentX = padding;
          currentY += itemHeight + 20;
        }
      });

      // Watermark
      ctx.fillStyle = '#ccc';
      ctx.font = 'italic 12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Generated by Pingo Art AI', blueprintCanvas.width - padding, blueprintCanvas.height - 20);

      return blueprintCanvas.toDataURL('image/png');
    }
  }));

  const drawBead = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, cellSize: number) => {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const radius = (cellSize / 2) * 0.85;

    if (color) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = Math.max(0.5, cellSize * 0.05);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX - radius/3, centerY - radius/3, radius/4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();
    } else {
      // Clear area first
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      // Draw empty peg
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.max(1, radius * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = '#e5e7eb';
      ctx.fill();
    }
  };

  // Draw the entire grid on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const width = canvas.width;
    const cellSize = width / size;

    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, width);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        drawBead(ctx, x, y, localGridRef.current[y][x], cellSize);
      }
    }
  };

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
    
    if (localGridRef.current[y][x] !== targetColor) {
      localGridRef.current[y][x] = targetColor;
      
      // Direct Canvas Drawing for instant feedback
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const cellSize = canvas.width / size;
          drawBead(ctx, x, y, targetColor, cellSize);
        }
      }
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    
    onActionStart?.();
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
    if (isDrawing) {
      setIsDrawing(false);
      // Sync back to parent state only when finished drawing a stroke
      setGrid([...localGridRef.current.map(row => [...row])]);
    }
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
