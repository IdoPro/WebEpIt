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

  const handleBeginMemorial = () => {
    setConfig({
      ...config,
      prototype: PrototypeType.MEMORIAL,
      primaryColor: COLORS[0].value,
    });
    setStep(2);
  };

  return (
    <div className={`min-h-screen ${isRtl ? 'text-right' : 'text-left'}`}>

      {/* Hero */}
      <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs font-bold text-amber-800 shadow-sm backdrop-blur">
            <span className="block w-2 h-2 rounded-full bg-amber-500" />
            {lang === 'he' ? 'הנצחה דיגיטלית' : 'Digital Memorial'}
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-8 leading-tight text-center">
          {t.heroTitle}
        </h1>

        <p className="text-lg md:text-2xl text-stone-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light text-center">
          {t.heroSub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
          <button
            onClick={handleBeginMemorial}
            className="px-10 py-4 bg-gradient-to-r from-stone-900 to-amber-700 hover:from-stone-800 hover:to-amber-600 text-white font-bold text-lg rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] duration-300"
          >
            {t.heroCtaPrimary}
          </button>
          <button className="px-10 py-4 border-2 border-stone-200 bg-white/80 text-stone-800 font-bold text-lg rounded-2xl hover:bg-white transition-all duration-300 shadow-sm">
            {t.heroCtaSecondary}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            lang === 'he' ? 'השקה מהירה' : 'Fast Launch',
            lang === 'he' ? 'תמיכה בעברית' : 'Hebrew Ready',
            lang === 'he' ? 'עיצוב מכובד' : 'Dignified Design',
            lang === 'he' ? 'זמין לנצח' : 'Forever Online',
          ].map(item => (
            <div key={item} className="rounded-xl border border-stone-200/80 bg-white/70 px-4 py-3 text-center text-xs font-bold text-stone-700 shadow-sm backdrop-blur">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Value Props */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div>
              <h3 className="text-2xl font-black text-stone-900 mb-4">{t.valueSimple}</h3>
              <p className="text-stone-600 text-lg leading-relaxed font-light rounded-2xl border border-stone-100 bg-white/80 p-6 shadow-sm">
                {t.valueSimpleDesc}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-stone-900 mb-4">{t.valuePowerful}</h3>
              <p className="text-stone-600 text-lg leading-relaxed font-light rounded-2xl border border-stone-100 bg-white/80 p-6 shadow-sm">
                {t.valuePowerfulDesc}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-stone-900 mb-4">{t.valueLasting}</h3>
              <p className="text-stone-600 text-lg leading-relaxed font-light rounded-2xl border border-stone-100 bg-white/80 p-6 shadow-sm">
                {t.valueLastingDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-16 text-center">
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
              title={lang === 'he' ? 'ספר זיכרונות' : 'Memory Book'}
              desc={lang === 'he' ? 'משפחה וחברים יכולים לשתף זיכרונות שלהם' : 'Family and friends can share their memories'}
            />
            <FeatureItem
              title={lang === 'he' ? 'תזכורות יארצייט' : 'Yahrzeit Reminders'}
              desc={lang === 'he' ? 'תזכורות אוטומטיות בימי הזיכרון' : 'Automatic reminders on anniversary dates'}
            />
            <FeatureItem
              title={lang === 'he' ? 'נגיש מכל מקום' : 'Global Accessibility'}
              desc={lang === 'he' ? 'משפחה בכל העולם יכולה להתחבר בכל עת' : 'Family anywhere in the world can connect anytime'}
            />
            <FeatureItem
              title={lang === 'he' ? 'שמור לנצח' : 'Preserved Forever'}
              desc={lang === 'he' ? 'האתר מוגן ומגובה ללא עלות נוספת' : 'Your memorial is protected and backed up at no extra cost'}
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-6 bg-[#fdfbf7] rounded-[2rem]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 text-center">
            {t.testimonialTitle}
          </h2>
          <p className="text-xl text-stone-500 mb-16 text-center max-w-2xl mx-auto">
            {t.testimonialSubtitle}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-stone-100 hover:-translate-y-1">
                <div className="mb-6 text-amber-500">★★★★★</div>
                <p className="text-stone-700 text-lg leading-relaxed mb-6 font-light italic">
                  "{testimonial.quote[lang]}"
                </p>
                <div className="border-t border-stone-100 pt-4">
                  <p className="font-semibold text-stone-900">{testimonial.name[lang]}</p>
                  <p className="text-sm text-stone-500">{testimonial.relationship[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-24 px-6 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white rounded-[2.5rem] mx-4 md:mx-8 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">🕯️</div>
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            {lang === 'he' ? 'צרו מרחב הנצחה ליקיריכם' : 'Create a Living Memorial Today'}
          </h2>
          <p className="text-xl md:text-2xl text-stone-300 mb-12 font-light max-w-2xl mx-auto">
            {lang === 'he'
              ? 'תוך פחות משעה, תהיה לכם אתר הנצחה יפה, משמעותי, ומשמר לנצח.'
              : "In under an hour, you'll have a beautiful, meaningful memorial that will last forever."}
          </p>
          <button
            onClick={handleBeginMemorial}
            className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-lg rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] duration-300"
          >
            {t.heroCtaPrimary}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-stone-400 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm">
          <p className="mb-2">
            {lang === 'he' ? '© 2026 Memorial Studio. כל הזכויות שמורות.' : '© 2026 Memorial Studio. All rights reserved.'}
          </p>
          <p>{lang === 'he' ? 'בנוי באהבה ולזיכרון' : 'Built with love and purpose'}</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="p-7 bg-white/90 border border-stone-100 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
    <div className="w-10 h-[2px] bg-gradient-to-r from-amber-500 to-stone-900 mb-5" />
    <h3 className="text-lg font-bold text-stone-900 mb-3">{title}</h3>
    <p className="text-stone-600 font-light leading-relaxed">{desc}</p>
  </div>
);

export default Step1;
