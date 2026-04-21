
import React, { useState, useEffect } from 'react';
import { PrototypeType, SiteConfig, GenerationResult, Language } from './types';
import { PROTOTYPES, COLORS, UI_STRINGS } from './constants';
import Memorial_App from './components/Memorial-Web/App';
import { getPublicWebsite } from './services/serverIntegrationService';
import Step1 from './components/Step1/Step1';
import Step2 from './components/Step2/Step2';
import Step3 from './components/steps/Step3';
import { DeploymentResponse } from './services/projectService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import MyMemorials from './components/dashboard/MyMemorials';
import ManagementShell from './components/dashboard/ManagementShell';

// ── App view state machine ──────────────────────────────────────────────────
type AppView =
  | { screen: 'public'; config: any }
  | { screen: 'create' }
  | { screen: 'my-sites' }
  | { screen: 'manage'; memorialId: string }
  | { screen: 'login' };

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
    accentColor: '#f59e0b',
    description: '',
    features: [],
    contactEmail: '',
    language: 'he'
  });
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [completedDeployment, setCompletedDeployment] = useState<DeploymentResponse | null>(null);
  const [publicSiteConfig, setPublicSiteConfig] = useState<any | null>(null);

  const t = UI_STRINGS[lang];
  const isRtl = lang === 'he';

  // If the app is opened with ?site=identifier then load public site data
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const site = params.get('site');
      if (site) {
        (async () => {
          try {
            const data = await getPublicWebsite(site);
            const loadedConfig = data?.website?.content || data?.website || data;
            setPublicSiteConfig(loadedConfig);
          } catch (err) {
            console.error('Failed to load public site:', err);
          }
        })();
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

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

  if (publicSiteConfig) {
    return (
      <div className="min-h-screen bg-[#f8fafc]" dir={isRtl ? 'rtl' : 'ltr'}>
        <Memorial_App config={publicSiteConfig} lang={lang} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      </div>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] motion-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="block w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-none">Digital Memorial <span className="text-indigo-700">Builder</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Create a Lasting Legacy</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-white/70 p-1 rounded-xl border border-slate-200/70 shadow-sm">
              <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'en' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>EN</button>
              <button onClick={() => setLang('he')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'he' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>עב</button>
            </div>
            <div className={`hidden sm:flex items-center gap-2 text-sm text-slate-500 font-semibold ${isRtl ? 'border-r pr-6 border-slate-200' : 'border-l pl-6 border-slate-200'}`}>
              <span>{t.step} {step}/3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-7 rounded-full transition-all duration-300 ${step >= s ? 'bg-gradient-to-r from-indigo-600 to-slate-900' : 'bg-slate-200'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-10">
        {step === 1 && (
          <Step1 lang={lang} setLang={setLang} config={config} setConfig={setConfig} setStep={setStep} />
        )}
        {step === 2 &&
          <Step2 lang={lang} setStep={setStep} config={config} setConfig={setConfig} setResult={setResult} setCompletedDeployment={setCompletedDeployment} />}


        {step === 3 &&
          <Step3 lang={lang} setStep={setStep} setResult={setResult} result={result} config={config} preDeployed={completedDeployment} />}

      </main>

      <footer className="relative z-10 mt-16 py-12 border-t border-white/70 text-center bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-semibold">© 2026 Digital Memorial. Honor. Remember. Preserve.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors">Support</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
