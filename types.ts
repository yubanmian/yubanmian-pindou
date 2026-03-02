
export interface BeadColor {
  id: string;
  hex: string;
  name: string;
}

export type Tool = 'pencil' | 'eraser' | 'bucket';

export const PERLER_PALETTE: BeadColor[] = [
  { id: '1', hex: '#FF0000', name: '红色' },
  { id: '2', hex: '#FF7F00', name: '橙色' },
  { id: '3', hex: '#FFFF00', name: '黄色' },
  { id: '4', hex: '#00FF00', name: '绿色' },
  { id: '5', hex: '#0000FF', name: '蓝色' },
  { id: '6', hex: '#4B0082', name: '靛蓝' },
  { id: '7', hex: '#9400D3', name: '紫色' },
  { id: '8', hex: '#FFFFFF', name: '白色' },
  { id: '9', hex: '#000000', name: '黑色' },
  { id: '10', hex: '#FFC0CB', name: '粉色' },
  { id: '11', hex: '#A52A2A', name: '棕色' },
  { id: '12', hex: '#808080', name: '灰色' },
];

export interface GridState {
  size: number;
  data: string[][]; // Array of hex strings
}

// Added missing types for the Daily Inspiration app
export type TabType = 'home' | 'calendar' | 'settings' | 'widget-preview';

export interface Inspiration {
  title: string;
  category: string;
  explanation: string;
  tags: string[];
  discipline: string;
  imageUrl: string;
}

export interface CalendarEntry {
  day: number;
  icon: string;
  color: string;
  title: string;
  discipline: string;
  date: string;
}
