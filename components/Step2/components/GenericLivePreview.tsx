
import React, { useState } from 'react';
import { SiteConfig, Language, PrototypeType } from '../../../types';
import Memorial_App from '../../Memorial-Web/App';
import { Maximize2, Minimize2, Fullscreen } from 'lucide-react';

interface LivePreviewProps {
  config: SiteConfig;
  lang: Language;
}

const LivePreview: React.FC<LivePreviewProps> = ({ config, lang }) => {
  const isRtl = lang === 'he';
  const primaryColor = config.primaryColor || '#334155';
  const [candleLit, setCandleLit] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWebsiteMode, setIsWebsiteMode] = useState(false);

  const renderPrototypePreview = () => {
    switch (config.prototype) {
      // case PrototypeType.MEMORIAL:
      //   return (
      //     <div className="flex flex-col min-h-full bg-[#fdfbf7] text-stone-800 font-serif">
      //       {/* Elegant Memorial Header */}
      //       <header className="pt-10 pb-6 text-center border-b border-stone-200 bg-white/50">
      //         <div className="text-stone-400 text-[10px] tracking-[0.2em] uppercase mb-2">
      //           {lang === 'he' ? 'לזכר עולם' : 'In Loving Memory'}
      //         </div>
      //         <h1 className="text-3xl font-bold text-stone-900 mb-1">
      //           {config.deceasedName || (lang === 'he' ? 'שם המנוח/ה' : 'Full Name')}
      //         </h1>
      //         <div className="flex justify-center gap-4 text-xs text-stone-500 mt-2">
      //           <span>{config.dateOfPassing || '01.01.19XX'}</span>
      //           <span>•</span>
      //           <span>{config.hebrewDate || (lang === 'he' ? 'תאריך עברי' : 'Hebrew Date')}</span>
      //         </div>
      //       </header>

      //       {/* Digital Candle Section */}
      //       {config.features.includes(lang === 'he' ? 'הדלקת נר וירטואלי' : 'Digital Candle') && (
      //         <div className="py-12 flex flex-col items-center bg-gradient-to-b from-white to-transparent">
      //           <div
      //             onClick={() => setCandleLit(!candleLit)}
      //             className="relative cursor-pointer group"
      //           >
      //             {/* Candle Base */}
      //             <div className="w-12 h-16 bg-stone-200 rounded-sm border-b-4 border-stone-300 relative z-10" />
      //             {/* Flame Animation */}
      //             {candleLit ? (
      //               <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-10 bg-amber-400 rounded-full blur-[2px] animate-pulse">
      //                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-4 bg-white rounded-full opacity-50" />
      //               </div>
      //             ) : (
      //               <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
      //                 {lang === 'he' ? 'לחץ להדלקה' : 'Click to light'}
      //               </div>
      //             )}
      //           </div>
      //           <p className="mt-4 text-[11px] text-stone-400 italic">
      //             {candleLit
      //               ? (lang === 'he' ? 'נר זיכרון הודלק לזכרו/ה' : 'A memorial candle has been lit')
      //               : (lang === 'he' ? 'הדליקו נר לזכר הנשמה' : 'Light a candle in their memory')}
      //           </p>
      //         </div>
      //       )}

      //       {/* Life Story / Description */}
      //       <div className="px-8 py-10 max-w-lg mx-auto text-center border-t border-stone-100/50">
      //         <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">
      //           {lang === 'he' ? 'על המנוח/ה' : 'About Them'}
      //         </h2>
      //         <p className="text-stone-700 leading-loose text-sm italic">
      //           "{config.description || (lang === 'he' ? 'כאן יופיעו מילים לזכרו של האדם היקר, סיפור חייו ומורשתו.' : 'Heartfelt words about their life, legacy, and the light they brought to the world.')}"
      //         </p>
      //       </div>

      //       {/* Jewish Spiritual Section */}
      //       {config.features.includes(lang === 'he' ? 'פרקי תהילים' : 'Psalms Section') && (
      //         <div className="mx-6 mb-8 p-6 bg-stone-100 rounded-2xl border border-stone-200">
      //           <h3 className="text-xs font-bold text-stone-500 mb-4 flex items-center gap-2">
      //             <span className="w-4 h-[1px] bg-stone-300" />
      //             {lang === 'he' ? 'לעילוי נשמתו' : 'For Their Soul'}
      //             <span className="w-4 h-[1px] bg-stone-300" />
      //           </h3>
      //           <div className="text-right text-stone-800 text-sm leading-relaxed space-y-4">
      //             <p className="font-bold">תפילת "יזכור"</p>
      //             <p className="text-[12px] opacity-80">
      //               יִזְכּוֹר אֱלֹהִים נִשְׁמַת... שֶׁהָלַךְ לְעוֹלָמוֹ, הִנְנִי נוֹדֵב צְדָקָה בְּעַד הַזְכָּרַת נִשְׁמָתוֹ...
      //             </p>
      //           </div>
      //         </div>
      //       )}

      //       {/* Footer Actions */}
      //       <div className="mt-auto p-6 bg-white border-t border-stone-100 flex justify-between items-center">
      //         <div className="flex gap-4">
      //           {config.features.includes(lang === 'he' ? 'מיקום אזכרה (Waze)' : 'Location (Waze)') && (
      //             <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2 text-[10px] font-bold text-stone-600">
      //               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
      //               Waze
      //             </div>
      //           )}
      //         </div>
      //         <div className="text-[9px] text-stone-400 font-sans uppercase tracking-tighter">
      //           {config.relationship || (lang === 'he' ? 'משפחה וחברים' : 'Family & Friends')}
      //         </div>
      //       </div>
      //     </div>
      //   );

      case PrototypeType.MEMORIAL:
        return (
          <Memorial_App config={config} lang={lang} />
        );


      case PrototypeType.LANDING_PAGE:
        return (
          <div className="flex flex-col min-h-full bg-white text-slate-900">
            <nav className="p-4 flex justify-between items-center border-b border-slate-50">
              <div className="font-bold text-xs" style={{ color: primaryColor }}>{config.name || 'SiteName'}</div>
              <div className="flex gap-2">
                <div className="w-4 h-1 bg-slate-100 rounded" />
                <div className="w-4 h-1 bg-slate-100 rounded" />
              </div>
            </nav>
            <div className="p-8 text-center">
              <h2 className="text-xl font-black mb-3">{config.name || 'Main Heading'}</h2>
              <p className="text-[10px] text-slate-500 mb-6">{config.description || 'Elevate your business with our modern platform.'}</p>
              <button style={{ backgroundColor: primaryColor }} className="px-6 py-2 rounded-xl text-white text-[10px] font-bold shadow-lg shadow-indigo-100">
                Get Started
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-6 bg-slate-50">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-6 h-6 rounded-lg mb-2" style={{ backgroundColor: primaryColor + '20' }} />
                  <div className="h-2 w-full bg-slate-100 rounded mb-1" />
                  <div className="h-1.5 w-2/3 bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-full bg-slate-50 text-slate-300 text-xs italic">
            Select a prototype to preview
          </div>
        );
    }
  };

  // Website Mode - Full screen without browser UI
  if (isWebsiteMode) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsWebsiteMode(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            ✕ Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {renderPrototypePreview()}
        </div>
      </div>
    );
  }

  // Fullscreen Modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="h-8 bg-slate-200 flex items-center px-4 gap-1.5 border-b border-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
          <div className="ml-4 bg-white/50 px-3 py-1 rounded-md text-[9px] font-mono text-slate-500 truncate flex-1 ltr">
            {config.name?.toLowerCase().replace(/\s+/g, '-') || 'mysite'}.memorial-cloud.com
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            className="ml-2 p-1 hover:bg-slate-300 rounded transition-colors"
            title="Exit fullscreen"
          >
            <Minimize2 className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
          {renderPrototypePreview()}
        </div>
      </div>
    );
  }

  // Normal Mode
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="h-8 bg-slate-200 flex items-center px-4 gap-1.5 border-b border-slate-300">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
        <div className="ml-4 bg-white/50 px-3 py-1 rounded-md text-[9px] font-mono text-slate-500 truncate flex-1 ltr">
          {config.name?.toLowerCase().replace(/\s+/g, '-') || 'mysite'}.memorial-cloud.com
        </div>
        <button
          onClick={() => setIsWebsiteMode(true)}
          className="ml-2 p-1 hover:bg-slate-300 rounded transition-colors"
          title="View as Website"
        >
          <Fullscreen className="w-4 h-4 text-slate-600" />
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="ml-1 p-1 hover:bg-slate-300 rounded transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-slate-600" />
          ) : (
            <Maximize2 className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {renderPrototypePreview()}
      </div>
    </div>
  );
};

export default LivePreview;
