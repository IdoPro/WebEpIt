import React, { useState } from 'react';
import { Language } from '@/types';

export interface DeploymentSuccessProps {
  projectId: string;
  url: string;
  customDomain: string;
  lang: Language;
  onClose?: () => void;
  onViewSite?: () => void;
  onProceedToPayment?: () => void;
}

const DeploymentSuccess: React.FC<DeploymentSuccessProps> = ({
  projectId,
  url,
  customDomain,
  lang,
  onClose,
  onViewSite,
  onProceedToPayment,
}) => {
  const isRtl = lang === 'he';
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleViewSite = () => {
    if (onViewSite) {
      onViewSite();
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div
        className={`bg-white/95 backdrop-blur rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.2)] max-w-md w-full p-8 space-y-6 border border-white/80 ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {lang === 'he' ? 'הפריסה הצליחה' : 'Deployment Successful'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {lang === 'he'
              ? 'האתר שלך פורסם בהצלחה וזמין כעת'
              : 'Your site has been successfully deployed and is now live'}
          </p>
        </div>

        {/* Project Details */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
          {/* Project ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'he' ? 'מזהה פרויקט' : 'Project ID'}
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 break-all">
                {projectId}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(projectId);
                }}
                className="p-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                title="Copy ID"
              >
                {lang === 'he' ? 'העתק' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Custom Domain */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'he' ? 'דומיין מותאם' : 'Custom Domain'}
            </label>
            <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-mono break-all">
              {customDomain}
            </div>
          </div>

          {/* Full URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'he' ? 'כתובת URL מלאה' : 'Full URL'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-blue-600 font-mono break-all focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copied ? '✓' : (lang === 'he' ? 'העתק' : 'Copy')}
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
          <p className="text-xs font-semibold text-slate-600">
            {lang === 'he' ? 'שתף את הקישור' : 'Share This Link'}
          </p>
          <div className="w-32 h-32 bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs">
            {lang === 'he' ? 'QR Code' : 'QR Code'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onProceedToPayment && (
            <button
              onClick={onProceedToPayment}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {lang === 'he' ? 'לתשלום וסיום' : 'Proceed to Payment'}
            </button>
          )}
          <button
            onClick={handleViewSite}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {lang === 'he' ? 'צפה באתר' : 'View Site'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
            >
              {lang === 'he' ? 'סיום' : 'Finish'}
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            {lang === 'he'
              ? 'הקישור שלך זמין כעת וניתן לשמור ולשתף עם חברים ומשפחה'
              : 'Your link is now live and can be saved and shared with friends and family'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeploymentSuccess;
