
import React, { useState } from 'react';
import { KADDISH_TEXT, TEHILLIM_TEXTS, NESHAMA_MISHNAYOT, PRAYER_FOR_SOUL, HASSIDIC_INSIGHTS, PSALMS_DATABASE } from '../constants';
import { ensureZL, stripZL } from '../helpers/formatDeceasedName';
import { BookOpen, Book, ScrollText, Heart, ShieldCheck, Stars, Sparkles } from 'lucide-react';

interface JewishSectionProps {
  config?: any;
}

const JewishSection: React.FC<JewishSectionProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'kaddish' | 'tehillim' | 'mishna' | 'prayer' | 'hassidism' | 'psalms'>('hassidism');

  // מיפוי של אותיות סופיות לאותיות רגילות
  const finalLettersMap: { [key: string]: string } = {
    'ף': 'פ',
    'ך': 'כ',
    'ם': 'מ',
    'ן': 'נ',
    'ץ': 'צ'
  };

  // קבל את כל האותיות מהשם הנפטר כדי למצוא תהילים מתאימים
  const getRelatedPsalms = () => {
    if (!config?.deceasedName) return [];

    const name = stripZL(config.deceasedName).trim();
    const hebrewLetters = name.split('');
    const psalms: any[] = [];

    // עבור כל אות בשם, הוסף את התהילים המתאימים
    hebrewLetters.forEach((letter) => {
      // אם זו אות סופית, המיר אותה לאות רגילה
      const normalizedLetter = finalLettersMap[letter] || letter;

      if (PSALMS_DATABASE[normalizedLetter]) {
        // הוסף את כל התהילים של אות זו
        psalms.push(...PSALMS_DATABASE[normalizedLetter]);
      }
    });

    return psalms;
  };

  const relatedPsalms = getRelatedPsalms();

  const sanitizeText = (s?: string) => {
    if (!s) return s;
    return s.replaceAll('יְהוָה', "ה'");
  };

  return (
    <div className="max-w-6xl mx-auto py-16 md:py-24 px-4" id="judaism">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-amber-50 rounded-full">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-serif-hebrew mb-3 text-slate-900">מורשת ורוח</h2>
        <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full"></div>
        <p className="mt-6 text-slate-600 max-w-xl mx-auto text-base md:text-lg leading-relaxed font-sans-hebrew font-light">
          "נר ה' נשמת אדם" - אנו מקדישים פרק זה לתפילה, לימוד ומחשבה לעילוי נשמתו הטהורה של חברנו היקר.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-amber-100 flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="md:w-64 bg-slate-50 border-l border-amber-100 flex md:flex-col overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('hassidism')}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center gap-3 py-6 px-4 font-bold transition-all ${activeTab === 'hassidism' ? 'bg-white text-amber-700 md:border-r-4 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm md:text-base font-sans-hebrew">פניני חסידות</span>
          </button>
          <button 
            onClick={() => setActiveTab('prayer')}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center gap-3 py-6 px-4 font-bold transition-all ${activeTab === 'prayer' ? 'bg-white text-amber-700 md:border-r-4 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm md:text-base font-sans-hebrew">אזכרה</span>
          </button>
          <button 
            onClick={() => setActiveTab('kaddish')}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center gap-3 py-6 px-4 font-bold transition-all ${activeTab === 'kaddish' ? 'bg-white text-amber-700 md:border-r-4 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <ScrollText className="w-5 h-5" />
            <span className="text-sm md:text-base font-sans-hebrew">קדיש</span>
          </button>
          {/* <button 
            onClick={() => setActiveTab('tehillim')}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center gap-3 py-6 px-4 font-bold transition-all ${activeTab === 'tehillim' ? 'bg-white text-amber-700 md:border-r-4 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-sm md:text-base font-sans-hebrew">תהילים</span>
          </button> */}
          <button 
            onClick={() => setActiveTab('mishna')}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center gap-3 py-6 px-4 font-bold transition-all ${activeTab === 'mishna' ? 'bg-white text-amber-700 md:border-r-4 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <Book className="w-5 h-5" />
            <span className="text-sm md:text-base font-sans-hebrew">נשמ"ה</span>
          </button>
          <button 
            onClick={() => setActiveTab('psalms')}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center gap-3 py-6 px-4 font-bold transition-all ${activeTab === 'psalms' ? 'bg-white text-amber-700 md:border-r-4 border-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <ScrollText className="w-5 h-5" />
            <span className="text-sm md:text-base font-sans-hebrew">תהילים</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-14 relative bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
          <div className="absolute top-4 right-4 text-amber-200">
            <Stars className="w-12 h-12" />
          </div>

          <div className="max-w-2xl mx-auto text-center">
            {activeTab === 'hassidism' && (
              <div className="animate-fadeIn space-y-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 font-serif-hebrew text-amber-900 border-b-2 border-amber-100 pb-4">אור הנשמה בחסידות</h3>
                <div className="space-y-6 text-right">
                  {HASSIDIC_INSIGHTS.map((insight, idx) => (
                    <div key={idx} className="bg-white/60 p-6 rounded-2xl shadow-inner border border-amber-50/50">
                      <h4 className="text-lg font-bold text-amber-800 mb-2 font-serif-hebrew">{insight.title}</h4>
                      <p className="text-base md:text-lg leading-relaxed font-serif-hebrew text-slate-800 italic">
                        "{insight.content}"
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-sans-hebrew uppercase tracking-widest">{insight.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prayer' && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 font-serif-hebrew text-amber-900 border-b-2 border-amber-100 pb-4">{PRAYER_FOR_SOUL.title}</h3>
                <div className="text-xl md:text-2xl leading-[1.8] font-serif-hebrew text-slate-800 bg-white/60 p-8 rounded-2xl shadow-inner border border-amber-50/50">
                  {sanitizeText(PRAYER_FOR_SOUL.content)}
                </div>
                <p className="mt-8 text-slate-500 italic flex items-center justify-center gap-2 font-sans-hebrew text-sm">
                  <span className="w-10 h-px bg-slate-300"></span>
                  {PRAYER_FOR_SOUL.subtext}
                  <span className="w-10 h-px bg-slate-300"></span>
                </p>
              </div>
            )}

            {activeTab === 'kaddish' && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 font-serif-hebrew text-amber-900 border-b-2 border-amber-100 pb-4">{KADDISH_TEXT.title}</h3>
                <div className="text-xl md:text-2xl leading-[1.8] font-serif-hebrew text-slate-800 bg-white/60 p-8 rounded-2xl shadow-inner border border-amber-50/50">
                  {sanitizeText(KADDISH_TEXT.content)}
                </div>
                <p className="mt-8 text-slate-500 italic font-sans-hebrew text-sm">{KADDISH_TEXT.subtext}</p>
              </div>
            )}

            {activeTab === 'tehillim' && (
              <div className="animate-fadeIn space-y-16">
                {TEHILLIM_TEXTS.map((t, idx) => (
                  <div key={idx} className="relative pb-12 last:pb-0 border-b border-amber-50 last:border-0">
                    <h3 className="text-xl md:text-2xl font-bold mb-6 font-serif-hebrew text-amber-800">{t.title}</h3>
                    <div className="text-lg md:text-2xl leading-[1.8] font-serif-hebrew text-slate-800 px-4">
                      {sanitizeText(t.content)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mishna' && (
              <div className="animate-fadeIn space-y-10">
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold font-serif-hebrew text-amber-900">משניות נשמ"ה</h3>
                  <p className="text-slate-500 mt-2 font-sans-hebrew">לימוד אותיות נשמ"ה מועיל מאוד לעילוי נשמת הנפטר</p>
                </div>
                
                {NESHAMA_MISHNAYOT.map((m, idx) => (
                  <div key={idx} className="text-right bg-amber-50/30 p-8 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg md:text-xl font-bold mb-4 text-amber-700 font-serif-hebrew">{m.title}</h4>
                    <div className="text-lg md:text-xl leading-relaxed font-serif-hebrew text-slate-800">
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'psalms' && (
              <div className="animate-fadeIn space-y-8">
                {config?.deceasedName ? (
                  <>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 font-serif-hebrew text-amber-900">
                      פרקי תהילים לעילוי נשמת {ensureZL(config.deceasedName)}
                    </h3>
                    <p className="text-sm text-amber-700 font-sans-hebrew mb-8 pb-4 border-b-2 border-amber-100">
                      קריאת תהילים קיט (119) בהתאם לאותיות השם: {stripZL(config.deceasedName).split('').filter((letter: string) => PSALMS_DATABASE[finalLettersMap[letter] || letter]).map((letter: string) => finalLettersMap[letter] || letter).join(', ')}
                    </p>
                    {relatedPsalms.length > 0 ? (
                      <div className="space-y-10">
                        {relatedPsalms.map((psalm, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-amber-50/80 to-white p-10 rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-xl transition-all">
                            <div className="mb-6 pb-4 border-b-2 border-amber-100">
                              <h4 className="text-2xl font-bold text-amber-900 mb-1 font-serif-hebrew">{psalm.title}</h4>
                              <p className="text-sm text-amber-700 font-sans-hebrew">{psalm.shortIntro}</p>
                            </div>
                            <div className="text-xl leading-[2.2] font-serif-hebrew text-slate-800 bg-white/70 p-8 rounded-xl mb-6 whitespace-pre-wrap">
                              {sanitizeText(psalm.fullText)}
                            </div>
                            <div className="flex gap-4 items-center justify-center text-center">
                              <p className="text-sm text-amber-600 font-sans-hebrew font-bold">📖 יש לקרוא בתכלית הריכוז לעילוי הנשמה</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-slate-500 font-sans-hebrew text-base">לא נמצאו תהילים מתאימים לשם זה</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 font-sans-hebrew text-lg">אנא הזן את שם הנפטר בטופס כדי לראות את תהילים המתאימים לעילוי נשמתו</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewishSection;
