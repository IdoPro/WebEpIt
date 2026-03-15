import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GenerationResult, Language, SiteConfig } from '../../types';
import { UI_STRINGS } from '../../constants';
import CodeViewer from '../CodeViewer';
import { CheckCircle2, Zap, Heart, Lock, Copy } from 'lucide-react';
import { deployProject, DeploymentResponse } from '../../services/deploymentService';
import { DeploymentResponse as CreatedDeploymentResponse } from '../../services/projectService';
import {
  capturePayPalOrder,
  createPayPalOrder,
  getPayPalClientConfig,
  PayPalClientConfig,
  PayPalRequestError,
} from '../../services/paypalService';

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        isEligible?: () => boolean;
        render: (selector: string | HTMLElement) => Promise<void>;
        close?: () => Promise<void> | void;
      };
    };
  }
}

interface Step3Props {
  lang: Language;
  setStep: (step: 1 | 2 | 3) => void;
  setResult: (result: GenerationResult | null) => void;
  result?: GenerationResult | null;
  config?: SiteConfig | null;
  preDeployed?: CreatedDeploymentResponse | null;
}

const Step3: React.FC<Step3Props> = ({ lang, setStep, setResult, result, config, preDeployed }) => {
  const t = UI_STRINGS[lang];
  const isRtl = lang === 'he';
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [deploymentDone, setDeploymentDone] = useState(false);
  const [deployment, setDeployment] = useState<DeploymentResponse | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [paypalConfig, setPayPalConfig] = useState<PayPalClientConfig | null>(null);
  const [paypalLoading, setPayPalLoading] = useState(true);
  const [paypalError, setPayPalError] = useState<string | null>(null);
  const [paymentApproved, setPaymentApproved] = useState(false);

  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const paypalButtonsRef = useRef<{ close?: () => Promise<void> | void } | null>(null);

  const formattedPrice = useMemo(() => {
    const currency = paypalConfig?.currency || 'USD';
    const price = paypalConfig?.price || 49;

    try {
      return new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${currency} ${price}`;
    }
  }, [lang, paypalConfig]);

  const finalizeDeployment = useCallback(async () => {
    setProcessing(true);
    setDeploymentError(null);

    try {
      if (preDeployed?.projectId && preDeployed?.url) {
        setDeployment({
          success: true,
          projectId: preDeployed.projectId,
          url: preDeployed.url,
          customDomain: preDeployed.customDomain,
          message: preDeployed.message || 'Payment completed successfully',
        });
        setDeploymentDone(true);
        return;
      }

      if (!config || !result) {
        throw new Error('Missing configuration or result');
      }

      const deploymentResponse = await deployProject(config, result);
      setDeployment(deploymentResponse);
      setDeploymentDone(true);
    } catch (error) {
      console.error('Deployment error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setDeploymentError(errorMsg);
    } finally {
      setProcessing(false);
    }
  }, [config, preDeployed, result]);

  useEffect(() => {
    let isMounted = true;

    const loadPayPalConfig = async () => {
      try {
        setPayPalLoading(true);
        setPayPalError(null);
        const config = await getPayPalClientConfig();
        if (isMounted) {
          setPayPalConfig(config);
        }
      } catch (error) {
        if (isMounted) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to load PayPal configuration';
          setPayPalError(errorMsg);
        }
      } finally {
        if (isMounted) {
          setPayPalLoading(false);
        }
      }
    };

    loadPayPalConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!paypalConfig) {
      return;
    }

    const existingScript = document.querySelector('script[data-paypal-sdk="true"]') as HTMLScriptElement | null;
    if (window.paypal) {
      setPayPalLoading(false);
      return;
    }

    if (existingScript) {
      setPayPalLoading(true);
      existingScript.addEventListener('load', () => setPayPalLoading(false));
      existingScript.addEventListener('error', () => {
        setPayPalError(lang === 'he' ? 'טעינת PayPal נכשלה' : 'Failed to load PayPal SDK');
        setPayPalLoading(false);
      });
      return;
    }

    setPayPalLoading(true);
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalConfig.clientId)}&currency=${encodeURIComponent(paypalConfig.currency)}&intent=${encodeURIComponent(paypalConfig.intent)}`;
    script.async = true;
    script.dataset.paypalSdk = 'true';
    script.onload = () => setPayPalLoading(false);
    script.onerror = () => {
      setPayPalError(lang === 'he' ? 'טעינת PayPal נכשלה' : 'Failed to load PayPal SDK');
      setPayPalLoading(false);
    };

    document.body.appendChild(script);
  }, [lang, paypalConfig]);

  useEffect(() => {
    if (!paypalConfig || !acceptedTerms || paypalLoading || !window.paypal || deploymentDone || paymentApproved) {
      if (paypalContainerRef.current && !acceptedTerms) {
        paypalContainerRef.current.innerHTML = '';
      }
      return;
    }

    const container = paypalContainerRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = '';

    const buttons = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        shape: 'pill',
        label: 'paypal',
        height: 46,
      },
      createOrder: async () => {
        const description =
          lang === 'he'
            ? `תשלום עבור אתר הנצחה: ${config?.name || 'Memorial Project'}`
            : `Payment for memorial website: ${config?.name || 'Memorial Project'}`;
        return createPayPalOrder(description);
      },
      onApprove: async (
        data: { orderID?: string },
        actions: { restart?: () => Promise<void> | void }
      ) => {
        try {
          if (!data.orderID) {
            throw new Error('Missing PayPal order ID');
          }

          setProcessing(true);
          setPayPalError(null);
          const captureResult = await capturePayPalOrder(data.orderID);
          if (captureResult?.status !== 'COMPLETED') {
            throw new Error(lang === 'he' ? 'התשלום לא הושלם' : 'Payment was not completed');
          }

          setPaymentApproved(true);
          await finalizeDeployment();
        } catch (error) {
          if (
            error instanceof PayPalRequestError
            && (error.recoverable || error.code === 'INSTRUMENT_DECLINED')
            && actions?.restart
          ) {
            setPayPalError(
              lang === 'he'
                ? 'אמצעי התשלום נדחה. נסה/י אמצעי אחר בחלון PayPal.'
                : 'Payment method was declined. Please try another method in PayPal.'
            );
            setProcessing(false);
            await actions.restart();
            return;
          }

          const errorMsg = error instanceof Error ? error.message : 'PayPal approval failed';
          setPayPalError(errorMsg);
          setProcessing(false);
        }
      },
      onCancel: () => {
        setPayPalError(lang === 'he' ? 'התשלום בוטל. אפשר לנסות שוב.' : 'Payment was canceled. You can try again.');
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'PayPal error';
        setPayPalError(errorMsg);
      },
    });

    if (buttons.isEligible && !buttons.isEligible()) {
      setPayPalError(lang === 'he' ? 'PayPal לא זמין במכשיר/דפדפן זה' : 'PayPal is not available in this browser');
      return;
    }

    buttons.render(container);
    paypalButtonsRef.current = buttons;

    return () => {
      if (paypalButtonsRef.current?.close) {
        paypalButtonsRef.current.close();
      }
      paypalButtonsRef.current = null;
    };
  }, [acceptedTerms, config?.name, deploymentDone, finalizeDeployment, lang, paymentApproved, paypalConfig, paypalLoading]);

  if (deploymentDone && deployment) {
    return (
      <div className="animate-in fade-in duration-500 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full mb-6 animate-bounce shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              {lang === 'he' ? 'ההנצחה נוצרה!' : 'Memorial is Live!'}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              {lang === 'he' 
                ? 'ההנצחה שלך נוצרה בהצלחה והיא כעת פעילה באינטרנט לנצח.' 
                : 'Your memorial has been created and is now live forever online.'}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.14)] p-10 border border-green-200/60 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              {lang === 'he' ? 'פרטי ההנצחה שלך' : 'Your Memorial Details'}
            </h2>

            {/* Project ID */}
            <div className="mb-6 p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
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
                  className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Site URL */}
            <div className="mb-6 p-6 bg-green-50/80 rounded-2xl border border-green-200">
              <label className="block text-sm font-bold text-green-700 mb-2">
                {lang === 'he' ? 'כתובת ההנצחה שלך' : 'Your Memorial URL'}
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
                  className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors text-sm font-bold"
                >
                  {lang === 'he' ? 'ביקור' : 'Visit'}
                </a>
              </div>
            </div>

            {/* Custom Domain */}
            <div className="mb-6 p-6 bg-blue-50/80 rounded-2xl border border-blue-100">
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
            <div className="bg-amber-50/80 rounded-2xl p-6 border-l-4 border-amber-500 shadow-sm">
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
              className="px-8 py-4 bg-gradient-to-r from-slate-900 to-indigo-700 text-white font-bold rounded-xl hover:from-slate-800 hover:to-indigo-600 transition-all shadow-lg"
            >
              {lang === 'he' ? 'הנצח נוסף' : 'Create Another Memorial'}
            </button>
            <a
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              {lang === 'he' ? 'בקר בהנצחה' : 'Visit Memorial'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section with Success Message */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full mb-6 shadow">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            {lang === 'he' ? 'ההנצחה שלך מוכנה!' : 'Your Memorial is Ready!'}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            {lang === 'he' 
              ? 'ההנצחה נוצרה בהצלחה וממתינה להתפרסמות. זה פשוט, יפה וכל מה שאתה צריך כדי להנציח ולשמור על המורשת.' 
              : 'Your memorial is created and ready to launch. Beautiful, simple, and exactly what you need to honor and preserve their memory.'}
          </p>
        </div>

        {/* Simplicity Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/90 rounded-2xl p-6 text-center border border-blue-100 shadow-sm hover:shadow-md transition-all">
            <Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'פעיל כעת' : 'Live Now'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'שתף מיד עם המשפחה' : 'Share with family instantly'}</p>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 text-center border border-amber-100 shadow-sm hover:shadow-md transition-all">
            <Heart className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'מכובד וקר' : 'Dignified & Elegant'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'עיצוב מעודן וקל' : 'Respectful & beautiful'}</p>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 text-center border border-purple-100 shadow-sm hover:shadow-md transition-all">
            <Lock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'בטוח לתמיד' : 'Forever Secure'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'מוגן ונשמר לנצח' : 'Protected & preserved forever'}</p>
          </div>
          <div className="bg-white/90 rounded-2xl p-6 text-center border border-green-100 shadow-sm hover:shadow-md transition-all">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'he' ? 'תמיכה' : 'Support'}</h3>
            <p className="text-sm text-slate-600">{lang === 'he' ? 'סיוע בפריסה מלא' : '24/7 dedicated support'}</p>
          </div>
        </div>
      </div>

      {/* Main Content: Preview + Payment */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Site Preview / Code Viewer Toggle */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-white/90 overflow-hidden backdrop-blur">
              {!showCodeViewer ? (
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 p-8 min-h-[600px] flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <h3 className="text-lg font-bold mb-3 text-slate-900">
                      {lang === 'he' ? 'תצוגה מקדימה' : 'Live Preview'}
                    </h3>
                    <p className="text-slate-600 mb-6 text-sm">
                      {lang === 'he' 
                        ? 'האתר שלך יוצג כאן. בעת הפריסה תוכל לצפות בו ישירות מה-URL המקצועי שלך.'
                        : 'Your site preview will appear here. After launch, view it from your custom URL.'}
                    </p>
                    <div className="inline-block px-6 py-3 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-mono text-sm shadow-sm">
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
                className="w-full px-4 py-3 bg-slate-100/80 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                {showCodeViewer ? (lang === 'he' ? 'חזרה לתצוגה מקדימה' : 'Back to Preview') : (lang === 'he' ? 'הצג קוד (עבור מפתחים)' : 'Show Code (Developers)')}
              </button>
            </div>
          </div>

          {/* Payment Panel */}
          <aside className="lg:col-span-1">
            <div className="bg-white/90 rounded-3xl p-8 border border-indigo-100 shadow-[0_20px_50px_rgba(15,23,42,0.12)] sticky top-8 backdrop-blur">
              <h2 className="text-2xl font-black text-slate-900 mb-1">{lang === 'he' ? 'השלם את ההנצחה' : 'Complete Your Memorial'}</h2>
              <p className="text-sm text-slate-600 mb-6">
                {lang === 'he' ? 'תשלום חד-פעמי, ההנצחה שלך לנצח.' : 'One-time payment, your memorial forever.'}
              </p>

              {deploymentError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {lang === 'he' ? 'שגיאת פריסה:' : 'Deployment error:'} {deploymentError}
                </div>
              )}

              {paypalError && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {paypalError}
                </div>
              )}

              {/* Pricing Box */}
              <div className="bg-white rounded-xl p-6 mb-6 border border-indigo-100">
                <div className="flex items-end justify-between mb-1">
                  <span className="text-slate-600 font-medium text-sm">{lang === 'he' ? 'מחיר סופי' : 'Final Price'}</span>
                  <span className="text-xs text-slate-400">{lang === 'he' ? 'יותר מערך' : 'Great value'}</span>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
                  {formattedPrice}
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
              <label className="flex items-start gap-3 mb-6 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-sm">
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

              <div className="rounded-2xl border border-indigo-100 bg-white p-4 mb-3">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{lang === 'he' ? 'תשלום מאובטח על ידי' : 'Secure checkout powered by'}</span>
                  <span className="font-bold text-[#003087]">PayPal</span>
                </div>

                {!acceptedTerms && (
                  <p className="text-xs text-slate-500 mb-3">
                    {lang === 'he' ? 'כדי להמשיך לתשלום, אשר/י את התנאים.' : 'Accept the terms to continue to payment.'}
                  </p>
                )}

                {paypalLoading && (
                  <div className="w-full rounded-xl bg-slate-100 py-3 text-center text-sm text-slate-500">
                    {lang === 'he' ? 'טוען את PayPal...' : 'Loading PayPal...'}
                  </div>
                )}

                <div ref={paypalContainerRef} className={!acceptedTerms || paypalLoading ? 'pointer-events-none opacity-50' : ''} />

                {processing && (
                  <div className="mt-3 w-full rounded-xl bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-700">
                    {lang === 'he' ? 'מעבד תשלום ופורס את האתר...' : 'Processing payment and deploying your site...'}
                  </div>
                )}
              </div>

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
