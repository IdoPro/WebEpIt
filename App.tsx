
import React, { useState, useEffect } from 'react';
import { PrototypeType, SiteConfig, GenerationResult, Language } from './types';
import { PROTOTYPES, COLORS, UI_STRINGS } from './constants';
import Step1 from './components/Step1/Step1';
import Step2 from './components/Step2/Step2';
import Step3 from './components/steps/Step3';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('he');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<SiteConfig>({
    name: '',
    prototype: PrototypeType.MEMORIAL,
    primaryColor: COLORS[0].value,
    secondaryColor: '#ffffff',
    description: '',
    features: [],
    contactEmail: '',
    language: 'he'
  });
  const [result, setResult] = useState<GenerationResult | null>(null);

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'he';

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleGenerate = async () => {
    if (!config.name || !config.description) {
      alert(lang === 'he' ? "נא למלא שם פרויקט ותיאור." : "Please fill in project name and description.");
      return;
    }
    setLoading(true);
    setLogs([]);

    addLog(lang === 'he' ? "מתחיל תהליך בנייה..." : "Starting build process...");
    setTimeout(() => addLog(lang === 'he' ? "מייצר סכימת קונפיגורציה..." : "Generating config schema..."), 1000);
    setTimeout(() => addLog(lang === 'he' ? "מנתח צרכים רוחניים..." : "Analyzing spiritual requirements..."), 2000);
    setTimeout(() => addLog(lang === 'he' ? "מתחבר ל-Gemini AI..." : "Connecting to Gemini AI..."), 3500);

    try {
      // const genResult = await generateSite({ ...config, language: lang });
      addLog(lang === 'he' ? "הקוד נוצר בהצלחה!" : "Code generated successfully!");
      addLog(lang === 'he' ? "מבצע אופטימיזציה לנכסים..." : "Optimizing assets...");

      setTimeout(() => {
        // setResult(genResult);
        setStep(3);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      addLog("ERROR: Generation failed. Check API Key or Network.");
      setLoading(false);
      alert(lang === 'he' ? "היצירה נכשלה. אנא נסה שוב מאוחר יותר." : "Generation failed. Please try again later.");
    }
  };

  const toggleFeature = (feature: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">SiteForge <span className="text-indigo-600">AI</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enterprise Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>EN</button>
              <button onClick={() => setLang('he')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'he' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>עב</button>
            </div>
            <div className={`hidden sm:flex items-center gap-2 text-sm text-slate-400 font-medium ${isRtl ? 'border-r pr-6' : 'border-l pl-6'}`}>
              <span>{t.step} {step}/3</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        {step === 1 && (
          <Step1 lang={lang} setLang={setLang} config={config} setConfig={setConfig} setStep={setStep} />
        )}
        {step === 2 &&
          <Step2 lang={lang} setStep={setStep} config={config} setConfig={setConfig} setResult={setResult} />}


        {step === 3 &&
          <Step3 lang={lang} setStep={setStep} setResult={setResult} result={result} config={config} />}

      </main>

      <footer className="mt-auto py-12 border-t border-slate-200 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">© 2024 SiteForge AI. Build. Deploy. Scale.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest">Docs</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest">Render Guide</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest">Vercel API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
