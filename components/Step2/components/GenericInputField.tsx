import React from 'react';

// קומפוננטה קטנה לשדה קלט
interface InputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
  isRtl?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, placeholder, type = 'text', onChange, isRtl }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-slate-700 tracking-wide">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/70 ${
        isRtl ? 'text-right' : ''
      }`}
    />
  </div>
);

export default InputField;