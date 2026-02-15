import React from 'react';
import { COLORS } from '@/constants';

// קומפוננטת בחירת צבע
interface ColorPickerProps {
  colors: typeof COLORS;
  selected: string;
  onSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selected, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {colors.map(c => (
      <button
        key={c.name}
        onClick={() => onSelect(c.value)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          selected === c.value ? 'ring-4 ring-indigo-100 scale-110' : 'hover:scale-105'
        }`}
        style={{ backgroundColor: c.value }}
      >
        {selected === c.value && (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    ))}
  </div>
);

export default ColorPicker;