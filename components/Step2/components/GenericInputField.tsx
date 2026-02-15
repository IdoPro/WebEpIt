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
  <div>
    <label className="block text-xs font-bold text-slate-600 mb-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-stone-400 ${
        isRtl ? 'text-right' : ''
      }`}
    />
  </div>
);

export default InputField;