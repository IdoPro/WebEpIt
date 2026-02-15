
import React from 'react';
import { Prototype } from '../constants';
import { Language } from '../types';

interface PrototypeCardProps {
  prototype: Prototype;
  isSelected: boolean;
  onSelect: (id: string) => void;
  lang: Language;
}

const PrototypeCard: React.FC<PrototypeCardProps> = ({ prototype, isSelected, onSelect, lang }) => {
  return (
    <div 
      onClick={() => onSelect(prototype.id)}
      className={`group cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
        isSelected 
        ? 'border-indigo-600 bg-white shadow-2xl shadow-indigo-100 -translate-y-2' 
        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
      } ${lang === 'he' ? 'text-right' : 'text-left'}`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 p-3">
          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
      )}
      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{prototype.icon}</div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{prototype.title[lang]}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{prototype.description[lang]}</p>
      <div className={`flex flex-wrap gap-2 ${lang === 'he' ? 'justify-start' : 'justify-start'}`}>
        {prototype.features[lang].slice(0, 3).map((f, i) => (
          <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PrototypeCard;
