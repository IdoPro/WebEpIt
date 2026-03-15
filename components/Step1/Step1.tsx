import React from 'react';
import { SiteConfig, PrototypeType, Language } from '../../types';
import { PROTOTYPES, COLORS, UI_STRINGS, TESTIMONIALS } from '../../constants';

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

  // Set default to MemorialWeb when proceeding
  const handleBeginMemorial = () => {
    setConfig({
      ...config,
      prototype: PrototypeType.MEMORIAL,
      primaryColor: COLORS[0].value
    });
    setStep(2);
  };

  return (
    <div className={`min-h-screen ${isRtl ? 'text-right' : 'text-left'}`}>

      {/* Hero Section */}
      <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
        <div className="motion-fade-up">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
              <span className="block w-2 h-2 rounded-full bg-indigo-600" />
              {lang === 'he' ? 'הנצחה דיגיטלית חכמה' : 'Smart Digital Memorials'}
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight text-center">
            {t.heroTitle}
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light text-center">
            {t.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
            <button
              onClick={handleBeginMemorial}
              className="px-10 py-4 bg-gradient-to-r from-slate-900 to-indigo-700 hover:from-slate-800 hover:to-indigo-600 text-white font-bold text-lg rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] duration-300"
            >
              {t.heroCtaPrimary}
            </button>
            <button
              className="px-10 py-4 border-2 border-slate-300 bg-white/80 text-slate-900 font-bold text-lg rounded-2xl hover:bg-white transition-all duration-300 shadow-sm"
            >
              {t.heroCtaSecondary}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 motion-fade-up motion-delay-1">
            {[
              lang === 'he' ? 'השקה מהירה' : 'Fast Launch',
              lang === 'he' ? 'תמיכה בעברית' : 'Hebrew Ready',
              lang === 'he' ? 'עיצוב פרימיום' : 'Premium UI',
              lang === 'he' ? 'זמין מכל מקום' : 'Global Access',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-center text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Propositions Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Simple */}
            <div className="motion-fade-up motion-delay-1">
              <h3 className="text-2xl font-black text-slate-900 mb-4">{t.valueSimple}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                {t.valueSimpleDesc}
              </p>
            </div>

            {/* Powerful */}
            <div className="motion-fade-up motion-delay-2">
              <h3 className="text-2xl font-black text-slate-900 mb-4">{t.valuePowerful}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                {t.valuePowerfulDesc}
              </p>
            </div>

            {/* Lasting */}
            <div className="motion-fade-up motion-delay-3">
              <h3 className="text-2xl font-black text-slate-900 mb-4">{t.valueLasting}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                {t.valueLastingDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 text-center">
            {lang === 'he' ? 'כל מה שצריך לבנות הנצחה יפה' : 'Everything you need for a beautiful memorial'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureItem
              title={lang === 'he' ? 'סיפור חיים מלא' : 'Complete Life Story'}
              desc={lang === 'he' ? 'שתפו ביוגרפיה, תמונות, וזיכרונות יקרים' : 'Share biography, photos, and cherished memories'}
            />
            <FeatureItem
              title={lang === 'he' ? 'נר וירטואלי' : 'Digital Candle'}
              desc={lang === 'he' ? 'מבקרים יכולים להדליק נר וירטואלי באתר' : 'Visitors can light a virtual candle on the memorial'}
            />
            <FeatureItem
              title={lang === 'he' ? 'ספר תנחומים' : 'Guest Contributions'}
              desc={lang === 'he' ? 'משפחה וחברים יכולים לשתף זיכרונות שלהם' : 'Family and friends can share their memories'}
            />
            <FeatureItem
              title={lang === 'he' ? 'תזכורות יארצייט' : 'Yahrzeit Reminders'}
              desc={lang === 'he' ? 'התזכורות אוטומטיות בימי יארצייט' : 'Automatic reminders on Yahrzheit anniversaries'}
            />
            <FeatureItem
              title={lang === 'he' ? 'נגיש מכל מקום' : 'Global Accessibility'}
              desc={lang === 'he' ? 'משפחה בעולם יכולה להתחבר בכל עת' : 'Family anywhere can connect anytime'}
            />
            <FeatureItem
              title={lang === 'he' ? 'אבטחה וערך' : 'Secure & Eternal'}
              desc={lang === 'he' ? 'הנצחה בטוחה המתומכת ולעולם' : 'Safe, backed-up memorial forever'}
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-slate-100/70 rounded-[2rem]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 text-center">
            {t.testimonialTitle}
          </h2>
          <p className="text-xl text-slate-600 mb-16 text-center max-w-2xl mx-auto">
            {t.testimonialSubtitle}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-white/90 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
                <div className="mb-6 text-amber-500">★★★★★</div>
                <p className="text-slate-700 text-lg leading-relaxed mb-6 font-light italic">
                  "{testimonial.quote[lang]}"
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">{testimonial.name[lang]}</p>
                  <p className="text-sm text-slate-600">{testimonial.relationship[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 text-white rounded-[2.5rem] mx-4 md:mx-8 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            {lang === 'he' ? 'בואו נחל מרחב הנצחה ליקיריכם' : 'Create a Living Memorial Today'}
          </h2>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 font-light max-w-2xl mx-auto">
            {lang === 'he' ? 'תוך פחות משעה, תהיה לכם אתר הנצחה יפה, משמעותי, וקבע לנצח.' : 'In under an hour, you\'ll have a beautiful, meaningful memorial that will last forever.'}
          </p>
          <button
            onClick={handleBeginMemorial}
            className="px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] duration-300"
          >
            {t.heroCtaPrimary}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-slate-500 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm">
          <p className="mb-2">
            {lang === 'he' ? '© 2026 הנצחה דיגיטלית. כל הזכויות שמורות.' : '© 2026 Digital Memorial. All rights reserved.'}
          </p>
          <p>
            {lang === 'he' ? 'בנוי בעם וללב' : 'Built with love and purpose'}
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureItemProps {
  title: string;
  desc: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, desc }) => (
  <div className="p-7 bg-white/90 border border-slate-100 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
    <div className="w-10 h-[2px] bg-gradient-to-r from-indigo-600 to-slate-900 mb-5" />
    <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 font-light leading-relaxed">{desc}</p>
  </div>
);

export default Step1;
