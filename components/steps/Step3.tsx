import React, { useState } from 'react';
import { GenerationResult, Language, SiteConfig } from '../../types';
import { UI_STRINGS } from '../../constants';
import CodeViewer from '../CodeViewer';
import { CheckCircle2, Zap, Heart, Lock, Copy } from 'lucide-react';
import { deployProject, DeploymentResponse } from '../../services/deploymentService';

interface Step3Props {
  lang: Language;
  setStep: (step: 1 | 2 | 3) => void;
  setResult: (result: GenerationResult | null) => void;
  result?: GenerationResult | null;
  config?: SiteConfig | null;
}

const Step3: React.FC<Step3Props> = ({ lang, setStep, setResult, result, config }) => {
  const t = UI_STRINGS[lang];
  const isRtl = lang === 'he';
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [deploymentDone, setDeploymentDone] = useState(false);
  const [deployment, setDeployment] = useState<DeploymentResponse | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  const price = 49; // default price in USD

  const handlePayment = async () => {
    if (!acceptedTerms) {
      alert(lang === 'he' ? 'אנא אשרו את התנאים לפני התשלום.' : 'Please accept the terms before payment.');
      return;
    }
    
    setProcessing(true);
    setDeploymentError(null);

    try {
      // Process payment (placeholder)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Deploy project to server
      if (config && result) {
        const deploymentResponse = await deployProject(config, result);
        setDeployment(deploymentResponse);
        setDeploymentDone(true);
      } else {
        throw new Error('Missing configuration or result');
      }

      setProcessing(false);
    } catch (error) {
      console.error('Payment/Deployment error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setDeploymentError(errorMsg);
      setProcessing(false);
      alert(lang === 'he' ? `שגיאה: ${errorMsg}` : `Error: ${errorMsg}`);
    }
  };

  // Deployment success screen
  if (deploymentDone && deployment) {
    return (
      <div className="animate-in fade-in duration-500 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-6 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              {lang === 'he' ? '🚀 אתרך פעיל!' : '🚀 Site is Live!'}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              {lang === 'he' 
                ? 'התשלום הושלם בהצלחה ואתרך כעת פעיל באינטרנט.' 
                : 'Payment successful and your site is now live on the internet.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-green-200 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              {lang === 'he' ? 'פרטי האתר שלך' : 'Your Site Details'}
            </h2>

            {/* Project ID */}
            <div className="mb-6 p-6 bg-slate-50 rounded-xl">
              <label className="block text-sm font-bold text-slate-600 mb-2">
                {lang === 'he' ? 'ID הפרויקט' : 'Project ID'}
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900">
                  {deployment.projectId}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deployment.projectId);
                    alert(lang === 'he' ? 'הועתק!' : 'Copied!');
                  }}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Site URL */}
            <div className="mb-6 p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <label className="block text-sm font-bold text-green-700 mb-2">
                {lang === 'he' ? 'כתובת האתר שלך' : 'Your Site URL'}
              </label>
              <div className="flex items-center gap-2">
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-200 rounded-lg font-mono text-sm text-green-700 font-bold hover:underline"
                >
                  {deployment.url}
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deployment.url);
                    alert(lang === 'he' ? 'הועתק!' : 'Copied!');
                  }}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold"
                >
                  {lang === 'he' ? 'ביקור' : 'Visit'}
                </a>
              </div>
            </div>

            {/* Custom Domain */}
            <div className="mb-6 p-6 bg-blue-50 rounded-xl">
              <label className="block text-sm font-bold text-slate-600 mb-2">
                {lang === 'he' ? 'דומיין מותאם אישית' : 'Custom Domain'}
              </label>
              <p className="text-sm text-slate-700 mb-2">
                {lang === 'he' 
                  ? 'אתה יכול להוסיף דומיין שלך משלך בעזרת DNS pointing:' 
                  : 'You can connect your own domain using DNS pointing:'}
              </p>
              <code className="block px-4 py-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 mb-2">
                {deployment.customDomain}
              </code>
            </div>

            {/* Next Steps */}
            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
              <h3 className="font-bold text-slate-900 mb-3">
                {lang === 'he' ? 'השלבים הבאים' : 'Next Steps'}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <strong>{lang === 'he' ? '1. בדוק את האתר' : '1. Check your site'}</strong> - {lang === 'he' ? 'בקר בכתובת למעלה' : 'Visit the URL above'}
                </li>
                <li>
                  <strong>{lang === 'he' ? '2. עדכן את הדומיין' : '2. Update domain'}</strong> - {lang === 'he' ? 'חבר דומיין משלך אם רוצה' : 'Connect your own domain if you want'}
                </li>
                <li>
                  <strong>{lang === 'he' ? '3. שתף את הקישור' : '3. Share the link'}</strong> - {lang === 'he' ? 'שתף עם משפחה וחברים' : 'Share with family and friends'}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setStep(1); setResult(null); }}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
            >
              {lang === 'he' ? '✨ הצור אתר חדש' : '✨ Create Another Site'}
            </button>
            <a
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              {lang === 'he' ? '👁️ צפה בעד עכשיו' : '👁️ View Now'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Regular pre-payment screen
  return (
    <div className="animate-in fade-in duration-500 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section with Success Message */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            {lang === 'he' ? '🎉 אתרך מוכן!' : '🎉 Your Site is Ready!'}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            {lang === 'he' 
              ? 'האתר שלך נוצר בהצלחה וממתין לפריסה. זה פשוט, יעיל וזה בדיוק מה שאתה צריך.' 
              : 'Your site has been created and is ready to launch. Simple, effective, and exactly what you need.'}
          </p>
        </div>

        {/* Simplicity Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'מיד פעיל' : 'Instant Launch'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'הפעל בדקה אחת' : 'Live in minutes'}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-6 text-center">
            <Heart className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'עיצוב מעודן' : 'Beautiful Design'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'מוכן מיד' : 'Zero design work'}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 text-center">
            <Lock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'בטוח' : 'Secure'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'SSL ו-HTTPS' : 'SSL & HTTPS built-in'}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'תמיכה' : 'Support'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'פריסה מסייעת' : 'Assisted deployment'}</p>
          </div>
        </div>
      </div>

      {/* Main Content: Preview + Payment */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Site Preview / Code Viewer Toggle */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              {!showCodeViewer ? (
                <div className="bg-slate-50 p-8 min-h-[600px] flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <h3 className="text-lg font-bold mb-3 text-slate-900">
                      {lang === 'he' ? 'תצוגה מקדימה' : 'Live Preview'}
                    </h3>
                    <p className="text-slate-600 mb-6 text-sm">
                      {lang === 'he' 
                        ? 'האתר שלך יוצג כאן. בעת הפריסה תוכל לצפות בו ישירות מה-URL המקצועי שלך.'
                        : 'Your site preview will appear here. After launch, view it from your custom URL.'}
                    </p>
                    <div className="inline-block px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-mono text-sm">
                      yoursite-memorial.cloud
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <CodeViewer result={result} lang={lang} />
                </div>
              )}
              <button
                onClick={() => setShowCodeViewer(!showCodeViewer)}
                className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
              >
                {showCodeViewer ? (lang === 'he' ? 'חזרה לתצוגה מקדימה' : 'Back to Preview') : (lang === 'he' ? 'הצג קוד (עבור מפתחים)' : 'Show Code (Developers)')}
              </button>
            </div>
          </div>

          {/* Payment Panel */}
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border-2 border-indigo-200 sticky top-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">{lang === 'he' ? 'השלם את הפריסה' : 'Complete Launch'}</h2>
              <p className="text-sm text-slate-600 mb-6">
                {lang === 'he' ? 'תשלום חד-פעמי, וזה שלך לנצח.' : 'One-time payment, and it\'s yours forever.'}
              </p>

              {/* Pricing Box */}
              <div className="bg-white rounded-xl p-6 mb-6 border border-indigo-100">
                <div className="flex items-end justify-between mb-1">
                  <span className="text-slate-600 font-medium text-sm">{lang === 'he' ? 'מחיר סופי' : 'Final Price'}</span>
                  <span className="text-xs text-slate-400">{lang === 'he' ? 'יותר מערך' : 'Great value'}</span>
                </div>
                <div className="text-4xl font-black text-indigo-600 mb-2">
                  ${price}
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'he' ? 'כולל פריסה, SSL, ותמיכה' : 'Includes deployment, SSL, support'}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6 bg-white rounded-xl p-4">
                {[
                  lang === 'he' ? '✓ אתר מוכן לשימוש מיידי' : '✓ Ready-to-use site',
                  lang === 'he' ? '✓ דומיין מותאם אישית' : '✓ Custom domain setup',
                  lang === 'he' ? '✓ אחסון אבטוח' : '✓ Secure hosting',
                  lang === 'he' ? '✓ תמיכה טכנית 30 ימים' : '✓ 30 days of tech support',
                ].map((feature, idx) => (
                  <div key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    {feature.replace('✓ ', '')}
                  </div>
                ))}
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 mb-6 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms} 
                  onChange={(e) => setAcceptedTerms(e.target.checked)} 
                  className="w-4 h-4 mt-1 accent-indigo-600" 
                />
                <div>
                  <div className="font-semibold text-sm text-slate-900">{lang === 'he' ? 'אני מסכים לתנאים' : 'I agree to the Terms'}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {lang === 'he' 
                      ? 'אני מאשר שהמידע מדויק וקוראים את תנאי השירות שלנו'
                      : 'I confirm the info is accurate and accept our Terms of Service'}
                  </div>
                </div>
              </label>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={!acceptedTerms || processing}
                className={`w-full py-4 rounded-xl font-bold text-lg mb-3 transition-all ${
                  acceptedTerms && !processing
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {processing ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {lang === 'he' ? 'מעבד...' : 'Processing...'}
                  </span>
                ) : (
                  lang === 'he' ? '💳 לשלם עכשיו' : '💳 Pay Now'
                )}
              </button>

              <button 
                onClick={() => window.open('/terms', '_blank')} 
                className="w-full text-xs text-slate-500 hover:text-indigo-600 underline py-2 transition-colors"
              >
                {lang === 'he' ? 'קרא את התנאים המלאים' : 'Read full terms'}
              </button>

              {/* Fallback to new project */}
              <div className="mt-6 pt-6 border-t border-indigo-200">
                <button 
                  onClick={() => { setStep(1); setResult(null); }}
                  className="w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  {lang === 'he' ? '← חזור לתחילה' : '← Start Over'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Step3;
