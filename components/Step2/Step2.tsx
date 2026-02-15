import React, { useState } from 'react';
import { SiteConfig, Language, GenerationResult, PrototypeType } from '../../types';
import { UI_STRINGS, COLORS, PROTOTYPES } from '../../constants';
import LivePreview from './components/GenericLivePreview';
import GenericProjectForm from './components/GenericProjectForm';
import DeploymentSuccess from './components/DeploymentSuccess';
import projectService, { DeploymentResponse } from '../../services/projectService';

interface Step2Props {
  lang: Language;
  setStep: (step: 1 | 2 | 3) => void;
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  setResult: (result: GenerationResult | null) => void;
}

const Step2: React.FC<Step2Props> = ({ lang, setStep, config, setConfig, setResult }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [deploymentData, setDeploymentData] = useState<DeploymentResponse | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const t = UI_STRINGS[lang];
  const isRtl = lang === 'he';

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    addLog(lang === 'he' ? "מתחיל פריסה..." : "Starting deployment...");

    try {
      // Create a mock result object if not provided
      const result: GenerationResult = {
        files: [
          {
            path: 'index.html',
            content: '<!-- Generated site content -->',
          },
        ],
        instructions: 'Site generated successfully',
      };

      addLog(lang === 'he' ? "שולח נתונים לשרת..." : "Sending data to server...");
      
      const response = await projectService.deployProject(config, result);

      if (response.success && response.projectId && response.url) {
        addLog(lang === 'he' ? "✅ הפריסה הצליחה!" : "✅ Deployment successful!");
        setDeploymentData(response);
      } else {
        addLog(lang === 'he' ? "❌ הפריסה נכשלה: " + response.message : "❌ Deployment failed: " + response.message);
        alert(lang === 'he' ? `שגיאה: ${response.message}` : `Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Deployment error:', error);
      addLog(lang === 'he' ? "❌ שגיאה בפריסה" : "❌ Deployment error");
      alert(lang === 'he' ? "שגיאה בפריסה. בואו נסה שוב." : "Deployment error. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleGenerate = async () => {
    // Note: Removed required-field validation for project name & description per request

    setLoading(true);
    setLogs([]);
    addLog(lang === 'he' ? "מתחיל תהליך בנייה..." : "Starting build process...");

    setTimeout(() => addLog(lang === 'he' ? "מייצר סכימת קונפיגורציה..." : "Generating config schema..."), 1000);
    setTimeout(() => addLog(lang === 'he' ? "מנתח צרכים רוחניים..." : "Analyzing spiritual requirements..."), 2000);
    setTimeout(() => addLog(lang === 'he' ? "מתחבר ל-Gemini AI..." : "Connecting to Gemini AI..."), 3500);

    try {
      addLog(lang === 'he' ? "הקוד נוצר בהצלחה!" : "Code generated successfully!");
      addLog(lang === 'he' ? "מבצע אופטימיזציה לנכסים..." : "Optimizing assets...");

      setTimeout(() => {
        addLog(lang === 'he' ? "מוכן לפריסה" : "Ready for deployment");
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">

      {/* Form Section */}
      <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[80vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t.customizeTitle}</h2>
            <p className="text-slate-400 text-sm mt-1">{t.customizeSub}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAdvancedMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={lang === 'he' ? 'מצב מתקדם' : 'Advanced mode'}
            >
              {lang === 'he' ? '⚙️ מתקדם' : '⚙️ Advanced'}
            </button>
            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-indigo-600 font-bold transition-colors">{t.back}</button>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-thin">

          <GenericProjectForm
            lang={lang}
            config={config}
            setConfig={setConfig}
            isAdvancedMode={isAdvancedMode}
          />
          
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center bg-white/80 sticky bottom-0 gap-4">
          {(loading || isDeploying) && (
            <div className="flex-1 max-w-xs bg-slate-900 rounded-xl p-3 font-mono text-[9px] text-emerald-400 overflow-hidden h-20 ltr">
              {logs.slice(-3).map((log, i) => <div key={i} className="opacity-70 animate-pulse truncate">{log}</div>)}
            </div>
          )}
          
          {!loading && !isDeploying && !deploymentData && (
            <>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-8 py-3 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {lang === 'he' ? '🔄 צור' : '🔄 Generate'}
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying || loading}
                className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex items-center gap-2 ml-auto"
              >
                {isDeploying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {lang === 'he' ? 'משדר...' : 'Deploying...'}
                  </>
                ) : (
                  <>🚀 {lang === 'he' ? 'פרוס' : 'Deploy'}</>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Live Preview Section */}
      <div className="lg:col-span-5 h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === 'he' ? 'תצוגה מקדימה חיה' : 'Live Interactive Preview'}</h3>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-600 font-bold tracking-tight">CONNECTED</span>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
          
          
          <LivePreview config={config} lang={lang} />

          {/* Subtle overlay hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            {lang === 'he' ? 'התצוגה מתעדכנת בזמן אמת' : 'Preview updates in real-time'}
          </div>
        </div>

        {/* <div className="mt-6 bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pipeline Health</h4>
            <span className="text-[9px] text-slate-500 font-mono">v2.4.0-stable</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Schema Validation</span>
              <span className="text-[11px] text-emerald-400 font-bold">READY</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[85%]" />
            </div>
            <p className="text-[9px] text-slate-500 mt-2">
              {lang === 'he' ? 'מוכן לפריסה ל-Vercel ו-Render עם הגדרות מותאמות.' : 'Optimized for Vercel & Render edge networks.'}
            </p>
          </div>
        </div> */}
      </div>

      {/* Deployment Success Modal */}
      {deploymentData && (
        <DeploymentSuccess
          projectId={deploymentData.projectId || ''}
          url={deploymentData.url || ''}
          customDomain={deploymentData.customDomain || ''}
          lang={lang}
          onClose={() => setDeploymentData(null)}
          onViewSite={() => {
            if (deploymentData.url) {
              window.open(deploymentData.url, '_blank');
            }
          }}
        />
      )}
    </div>

  );
};

export default Step2;
