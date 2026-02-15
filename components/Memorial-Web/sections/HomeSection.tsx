import React ,{ReactNode, useState} from 'react';
import {
  Flame, Book, Star, Quote, ArrowRight, Users, CheckCircle2, Image as ImageIcon
} from 'lucide-react';
import { ensureZL } from '../helpers/formatDeceasedName';
import { SectionType } from '../types';
import { ACTS_OF_LIGHT, DECEASED_NAME, YEARS_LIFE, HEBREW_YEARS, MOTTO } from '../constants';

interface Props {
  isCandleLit: boolean;
  candleCount: number;
  actCommitments: Record<string, number>;
  userCommitments: Set<string>;
  onLightCandle: () => void;
  onTakeAct: (id: string) => void;
  onNavigate: (s: SectionType) => void;
  getIcon: (name: string) => ReactNode;
  config?: any;
}

const HomeSection: React.FC<Props> = ({
  isCandleLit,
  candleCount,
  actCommitments,
  userCommitments,
  onLightCandle,
  onTakeAct,
  onNavigate,
  getIcon,
  config
}) => {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold mb-4">{ensureZL(config?.deceasedName || DECEASED_NAME)}</h1>
          <p className="text-xl text-amber-200">{config?.yearsLife || YEARS_LIFE}</p>
          <p className="text-sm tracking-widest text-amber-300">{config?.hebrewYears || HEBREW_YEARS}</p>

          <div
            onClick={onLightCandle}
            className={`mt-10 mx-auto w-28 h-28 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all
              ${isCandleLit ? 'border-amber-400 shadow-[0_0_60px_rgba(251,191,36,.6)]' : 'border-white/20'}`}
          >
            <Flame className={`w-14 h-14 ${isCandleLit ? 'text-amber-400' : 'text-white/20'}`} />
          </div>

          <p className="mt-4 text-sm text-slate-300">
            {candleCount.toLocaleString()} נרות דולקים
          </p>
        </div>
      </section>

      {/* BIO PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-32">
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center">

          <div className="lg:w-3/5 text-right flex flex-col justify-center animate-fadeInLeft">
            <div className="flex items-center gap-2 text-amber-600 mb-6 font-sans-hebrew">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-[11px] font-black tracking-widest uppercase">האדם שבלבנו</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">איש של אור, חיוך ואהבה</h2>
            <div className="w-20 h-1.5 bg-amber-500 rounded-full mb-10"></div>
            <p className="text-base md:text-xl text-slate-700 leading-relaxed font-normal mb-10 max-w-2xl">
              {ensureZL(config?.deceasedName || DECEASED_NAME)} היה אדם שהשאיר חותם בכל מקום אליו הגיע. הוא האמין שחיוך פשוט יכול לשנות יום שלם של אדם אחר, והשאיר אחריו מורשת של רעות שתישאר איתנו תמיד.
            </p>

            <div className="bg-amber-50/50 p-8 md:p-10 rounded-3xl border-r-4 border-amber-400 italic mb-10 relative">
              <Quote className="absolute top-4 left-4 w-12 h-12 text-amber-200 opacity-30" />
              <p className="text-base md:text-xl text-slate-800 font-medium leading-relaxed relative z-10">
                "{MOTTO.replace(/״|״/g, '')}"
              </p>
            </div>

            <div className="flex flex-wrap gap-4 font-sans-hebrew">
              <button
                onClick={() => onNavigate(SectionType.BIO)}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs md:text-base hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl active:scale-95"
              >
                לסיפור חייו המלא <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>

          <div className="lg:w-2/5 w-full flex items-center justify-center animate-fadeInRight">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-4 bg-amber-100/50 rounded-[3rem] -rotate-3 transition-transform duration-700 group-hover:rotate-0"></div>
              <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 group-hover:scale-[1.02] transition-all duration-700">
                <div className="overflow-hidden rounded-[2rem]">
                  <img
                    src={config?.memorialImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                    alt={ensureZL(config?.deceasedName || DECEASED_NAME)}
                    className="w-full aspect-[4/5] object-cover shadow-inner grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute bottom-10 right-0 left-0 text-center px-4">
                  <div className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest font-sans-hebrew">
                    זוכרים את {ensureZL(config?.deceasedName || DECEASED_NAME)}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ACTS */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
          {ACTS_OF_LIGHT.map(act => {
            const taken = userCommitments.has(act.id);
            return (
              <div
                key={act.id}
                onClick={() => onTakeAct(act.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition
                  ${taken ? 'ring-2 ring-amber-400 bg-white' : 'bg-white hover:shadow-md'}`}
              >
                <div className="mb-4">
                  {taken ? <CheckCircle2 className="text-amber-500" /> : getIcon(act.icon)}
                </div>
                <h4 className="font-bold mb-2">{act.title}</h4>
                <p className="text-sm text-slate-600 mb-4">{act.description}</p>
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> קבלות
                  </span>
                  <span className="font-bold">{actCommitments[act.id]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-24 text-center">
        <Book className="mx-auto mb-4 text-amber-400" />
        <h3 className="text-3xl font-bold mb-4">לעילוי נשמתו</h3>
        <button
          onClick={() => onNavigate(SectionType.JUDAISM)}
          className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold"
        >
          מעבר לפרק המלא
        </button>
      </section>
    </>
  );
};

export default HomeSection;
