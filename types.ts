
export interface BeadColor {
  id: string;
  hex: string;
  name: string;
}

export type Tool = 'pencil' | 'eraser' | 'bucket';

export const PERLER_PALETTE: BeadColor[] = [
  { id: 'A10', hex: '#FF6B6B', name: '珊瑚红' },
  { id: 'A26', hex: '#FF9F43', name: '亮橙' },
  { id: 'B1', hex: '#FECA57', name: '向日葵黄' },
  { id: 'B3', hex: '#1DD1A1', name: '薄荷绿' },
  { id: 'B15', hex: '#48DBFB', name: '天蓝' },
  { id: 'B17', hex: '#54A0FF', name: '湛蓝' },
  { id: 'C3', hex: '#5F27CD', name: '丁香紫' },
  { id: 'C4', hex: '#341F97', name: '深海蓝' },
  { id: 'C6', hex: '#222F3E', name: '暗夜黑' },
  { id: 'C7', hex: '#FFFFFF', name: '纯净白' },
  { id: 'C10', hex: '#8395A7', name: '风暴灰' },
  { id: 'E5', hex: '#EE5253', name: '胭脂红' },
  { id: 'E6', hex: '#FF9FF3', name: '樱花粉' },
  { id: 'F5', hex: '#00D2D3', name: '青色' },
  { id: 'H7', hex: '#576574', name: '石板灰' },
  { id: 'H13', hex: '#F7F1E3', name: '象牙白' },
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
