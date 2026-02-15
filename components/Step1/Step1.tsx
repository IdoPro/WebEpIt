import React from 'react';
import { SiteConfig, PrototypeType, Language } from '../../types';
import { PROTOTYPES, COLORS, UI_STRINGS } from '../../constants';
import PrototypeCard from './components/PrototypeCard';

interface Step1Props {
  lang: Language;
  setLang: (lang: Language) => void;
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  setStep: (step: 1 | 2 | 3) => void;
}

const Step1: React.FC<Step1Props> = ({ lang, setLang, config, setConfig, setStep }) => {
  const t = UI_STRINGS[lang];
  const isRtl = lang === 'he';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">{t.heroTitle}</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">{t.heroSub}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {PROTOTYPES.map((p) => (
          <PrototypeCard 
            key={p.id}
            prototype={p}
            isSelected={config.prototype === p.id}
            lang={lang}
            onSelect={(id) => setConfig({ 
              ...config, 
              prototype: id as PrototypeType, 
              features: [],
              primaryColor: id === PrototypeType.MEMORIAL ? COLORS[0].value : COLORS[1].value 
            })}
          />
        ))}
      </div>

      <div className="flex justify-center pb-20">
        <button 
          onClick={() => setStep(2)}
          className="group px-16 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-2xl hover:scale-105"
        >
          {t.configureBtn}
        </button>
      </div>
    </div>
  );
};

export default Step1;
