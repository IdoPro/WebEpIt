import React from 'react';

interface BioSectionProps {
  config?: any;
  theme: {
    accent: string;
  };
}

const BioSection: React.FC<BioSectionProps> = ({ config, theme }) => {
  // אם יש milestones בconfig, הצג אותם, אחרת הצג ערכים ברירת מחדל
  const milestones = config?.milestones && config.milestones.length > 0
    ? config.milestones
    : [
        {
          year: '1981',
          title: 'שנות הילדות והנעורים',
          description: 'ישראל נולד בחיפה, בן זקונים למשפחה שורשית. כבר מגיל צעיר בלט בסקרנותו ובאהבתו לים. הוא בילה שעות על החוף, בונה חלומות וקשרים חברתיים שילוו אותו לכל החיים.'
        },
        {
          year: '2000',
          title: 'שירות צבאי ותחילת הדרך',
          description: 'שירת ביחידה מובחרת, שם למד את ערך הרעות וההקרבה. חבריו לצוות מספרים על אדם שתמיד הציע את הכתף שלו למסע והיה ראשון לעזור בכל משימה.'
        },
        {
          year: '2010',
          title: 'משפחה וקריירה',
          description: 'ישראל הקים משפחה לתפארת והתפתח בתחום הטכנולוגיה. הוא היה אבא מסור וחבר נאמן שתמיד ידע למצוא את המשותף בין אנשים.'
        }
      ];

  return (
    <div className="max-w-4xl mx-auto py-16 md:py-28 px-4">
      <div className="text-center mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
          סיפור חיים
          <div className="absolute -bottom-2 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: theme.accent }}></div>
        </h2>
      </div>

      <div className="space-y-12 md:space-y-16 relative px-4 md:px-0">
        <div className="absolute right-6 md:right-auto md:left-1/2 top-4 bottom-4 w-px bg-slate-200 hidden sm:block -translate-x-1/2"></div>

        {milestones.map((milestone, index) => (
          <section key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 items-center group relative md:even:flex-row-reverse">
            <div className="absolute right-4 md:right-auto md:left-1/2 top-8 w-3 h-3 bg-white border-2 rounded-full z-10 hidden sm:block -translate-x-1/2 group-hover:scale-125 transition-transform" style={{ borderColor: theme.accent }}></div>
            <div className="w-full md:w-1/2 text-4xl md:text-5xl font-black text-slate-100 transition-all text-right md:text-center" style={{ color: `${theme.accent}33` }}>{milestone.year}</div>
            <div className="w-full md:w-1/2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md transition-all relative">
              <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-900">{milestone.title}</h3>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base font-light">
                {milestone.description}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BioSection;
