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
    <div className={`min-h-screen bg-gradient-to-b from-white via-slate-50 to-white ${isRtl ? 'text-right' : 'text-left'}`}>

      {/* Hero Section */}
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex justify-center">
            <span className="text-6xl">🕯️</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
            {t.heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed font-light">
            {t.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={handleBeginMemorial}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
            >
              {t.heroCtaPrimary}
            </button>
            <button
              className="px-8 py-4 border-2 border-slate-900 text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all duration-300"
            >
              {t.heroCtaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Value Propositions Section */}
      <div className="py-24 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Simple */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="mb-6 text-5xl">✨</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{t.valueSimple}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                {t.valueSimpleDesc}
              </p>
            </div>

            {/* Powerful */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="mb-6 text-5xl">💫</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{t.valuePowerful}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                {t.valuePowerfulDesc}
              </p>
            </div>

            {/* Lasting */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="mb-6 text-5xl">♾️</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{t.valueLasting}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                {t.valueLastingDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 text-center">
            {lang === 'he' ? 'כל מה שצריך לבנות הנצחה יפה' : 'Everything you need for a beautiful memorial'}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureItem
              icon="📖"
              title={lang === 'he' ? 'סיפור חיים מלא' : 'Complete Life Story'}
              desc={lang === 'he' ? 'שתפו ביוגרפיה, תמונות, וזיכרונות יקרים' : 'Share biography, photos, and cherished memories'}
            />
            <FeatureItem
              icon="🕯️"
              title={lang === 'he' ? 'נר וירטואלי' : 'Digital Candle'}
              desc={lang === 'he' ? 'מבקרים יכולים להדליק נר וירטואלי באתר' : 'Visitors can light a virtual candle on the memorial'}
            />
            <FeatureItem
              icon="📝"
              title={lang === 'he' ? 'ספר תנחומים' : 'Guest Contributions'}
              desc={lang === 'he' ? 'משפחה וחברים יכולים לשתף זיכרונות שלהם' : 'Family and friends can share their memories'}
            />
            <FeatureItem
              icon="🗓️"
              title={lang === 'he' ? 'תזכורות יארצייט' : 'Yahrzeit Reminders'}
              desc={lang === 'he' ? 'התזכורות אוטומטיות בימי יארצייט' : 'Automatic reminders on Yahrzheit anniversaries'}
            />
            <FeatureItem
              icon="🌍"
              title={lang === 'he' ? 'נגיש מכל מקום' : 'Global Accessibility'}
              desc={lang === 'he' ? 'משפחה בעולם יכולה להתחבר בכל עת' : 'Family anywhere can connect anytime'}
            />
            <FeatureItem
              icon="🔒"
              title={lang === 'he' ? 'אבטחה וערך' : 'Secure & Eternal'}
              desc={lang === 'he' ? 'הנצחה בטוחה המתומכת ולעולם' : 'Safe, backed-up memorial forever'}
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 text-center">
            {t.testimonialTitle}
          </h2>
          <p className="text-xl text-slate-600 mb-16 text-center max-w-2xl mx-auto">
            {t.testimonialSubtitle}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
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
      <div className="py-32 px-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            {lang === 'he' ? 'בואו נחל מרחב הנצחה ליקיריכם' : 'Create a Living Memorial Today'}
          </h2>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 font-light max-w-2xl mx-auto">
            {lang === 'he' ? 'תוך פחות משעה, תהיה לכם אתר הנצחה יפה, משמעותי, וקבע לנצח.' : 'In under an hour, you\'ll have a beautiful, meaningful memorial that will last forever.'}
          </p>
          <button
            onClick={handleBeginMemorial}
            className="px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
          >
            {t.heroCtaPrimary}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
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
  icon: string;
  title: string;
  desc: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, desc }) => (
  <div className="p-8 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 font-light leading-relaxed">{desc}</p>
  </div>
);

export default Step1;
