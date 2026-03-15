import React, { useState } from 'react';
import { SiteConfig, Language, Milestone } from '@/types';
import InputField from '@/components/Step2/components/GenericInputField';

const CONCEPT_PALETTES = [
  {
    key: 'זיכרון קלאסי',
    primaryColor: '#2c3e50',
    secondaryColor: '#ffffff',
    accentColor: '#f59e0b',
  },
  {
    key: 'אבן ושלווה',
    primaryColor: '#475569',
    secondaryColor: '#f8fafc',
    accentColor: '#8b6f47',
  },
  {
    key: 'אור רך',
    primaryColor: '#6b5b95',
    secondaryColor: '#fdfbf7',
    accentColor: '#fbbf24',
  },
  {
    key: 'שקד ועדינות',
    primaryColor: '#78716c',
    secondaryColor: '#fff7ed',
    accentColor: '#d97706',
  },
];

interface MemorialFormProps {
  lang: Language;
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
}

const MemorialForm: React.FC<MemorialFormProps> = ({ lang, config, setConfig }) => {
  const isRtl = lang === 'he';
  const [newMilestone, setNewMilestone] = useState<Milestone>({ year: '', title: '', description: '' });

  const selectedConcept = CONCEPT_PALETTES.find(
    (palette) =>
      palette.primaryColor === config.primaryColor &&
      palette.secondaryColor === config.secondaryColor &&
      palette.accentColor === (config.accentColor || '#f59e0b')
  )?.key;
  
  console.log('Rendering MemorialForm with config:', config);

  const addMilestone = () => {
    if (!newMilestone.year || !newMilestone.title) {
      alert(lang === 'he' ? 'נא למלא שנה וכותרת' : 'Please fill in year and title');
      return;
    }
    const milestones = [...(config.milestones || []), newMilestone];
    setConfig({ ...config, milestones });
    setNewMilestone({ year: '', title: '', description: '' });
  };

  const removeMilestone = (index: number) => {
    const milestones = config.milestones?.filter((_, i) => i !== index) || [];
    setConfig({ ...config, milestones });
  };
  return (
    <div className="space-y-6">
      {/* Contact Information Section */}
      <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 tracking-wide">
          {lang === 'he' ? 'פרטי יצירת קשר' : 'Contact Information'}
        </h3>
        
        <InputField
          label={lang === 'he' ? 'שם הפרויקט' : 'Project Name'}
          value={config.projectName ?? ''}
          onChange={(val) => setConfig({ ...config, projectName: val })}
          isRtl={isRtl}
          placeholder={lang === 'he' ? 'זכרון אבא' : 'E.g., Memorial for Dad'}
        />
        
        <InputField
          label={lang === 'he' ? 'אימייל' : 'Email Address'}
          value={config.email ?? ''}
          onChange={(val) => setConfig({ ...config, email: val })}
          isRtl={isRtl}
          placeholder={lang === 'he' ? 'your@email.com' : 'your@email.com'}
          type="email"
        />
        
        <p className="text-xs text-slate-500 italic">
          {lang === 'he' 
            ? '✓ נשתמש באימייל זה כדי לשמור על ההרשאות שלך ולשלוח עדכונים חשובים'
            : '✓ We\'ll use this email to save your site access and send important updates'}
        </p>
      </div>

      <InputField
        label="שם הנפטר"
        value={config.deceasedName ?? ''}
        onChange={(val) => setConfig({ ...config, deceasedName: val })}
        isRtl={isRtl}
      />

      <InputField
        label="שנות חיים"
        value={config.yearsLife ?? ''}
        onChange={(val) => setConfig({ ...config, yearsLife: val })}
        isRtl={isRtl}
      />

      <InputField
        label="שנות עבריות"
        value={config.hebrewYears ?? ''}
        onChange={(val) => setConfig({ ...config, hebrewYears: val })}
        isRtl={isRtl}
      />

      <InputField
        label="מוטו"
        value={config.motto ?? ''}
        onChange={(val) => setConfig({ ...config, motto: val })}
        isRtl={isRtl}
      />

      <div className="p-5 bg-white/90 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">{lang === 'he' ? 'קונספט' : 'Concept'}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'he' ? 'בחרו פלטת צבעים לאתר או התאימו ידנית' : 'Pick a site palette or customize manually'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONCEPT_PALETTES.map((palette) => {
            const isSelected = selectedConcept === palette.key;
            return (
              <button
                key={palette.key}
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    concept: palette.key,
                    primaryColor: palette.primaryColor,
                    secondaryColor: palette.secondaryColor,
                    accentColor: palette.accentColor,
                  })
                }
                className={`p-3 rounded-xl border text-right transition-all ${
                  isSelected ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 mb-2">{palette.key}</div>
                <div className="flex gap-2">
                  <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: palette.primaryColor }} />
                  <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: palette.secondaryColor }} />
                  <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: palette.accentColor }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            {lang === 'he' ? 'ראשי' : 'Primary'}
            <input
              type="color"
              value={config.primaryColor || '#2c3e50'}
              onChange={(e) => setConfig({ ...config, concept: lang === 'he' ? 'מותאם אישית' : 'Custom', primaryColor: e.target.value })}
              className="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>

          <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            {lang === 'he' ? 'רקע' : 'Background'}
            <input
              type="color"
              value={config.secondaryColor || '#ffffff'}
              onChange={(e) => setConfig({ ...config, concept: lang === 'he' ? 'מותאם אישית' : 'Custom', secondaryColor: e.target.value })}
              className="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>

          <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            {lang === 'he' ? 'הדגשה' : 'Accent'}
            <input
              type="color"
              value={config.accentColor || '#f59e0b'}
              onChange={(e) => setConfig({ ...config, concept: lang === 'he' ? 'מותאם אישית' : 'Custom', accentColor: e.target.value })}
              className="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Memorial Image */}
      <div className="p-5 bg-white/90 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {lang === 'he' ? 'תמונת זכרון' : 'Memorial Image'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setConfig({ ...config, memorialImage: dataUrl });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="block w-full text-sm text-slate-500
            file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-slate-900 file:text-white
            hover:file:bg-slate-800
            transition-colors"
        />
        {config.memorialImage && (
          <div className="mt-4">
            <img
              src={config.memorialImage}
              alt="Preview"
              className="max-h-32 rounded-lg object-cover"
            />
          </div>
        )}
      </div>

      {/* Milestones Section */}
      <div className="border-t border-slate-100 pt-6 mt-8">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          {lang === 'he' ? 'תחנות בחיים' : 'Life Milestones'}
        </h3>

        {/* Add New Milestone */}
        <div className="space-y-3 mb-6 p-5 bg-white/90 border border-slate-200 rounded-2xl shadow-sm">
          <InputField
            label={lang === 'he' ? 'שנה' : 'Year'}
            value={newMilestone.year}
            onChange={(val) => setNewMilestone({ ...newMilestone, year: val })}
            isRtl={isRtl}
          />
          <InputField
            label={lang === 'he' ? 'כותרת' : 'Title'}
            value={newMilestone.title}
            onChange={(val) => setNewMilestone({ ...newMilestone, title: val })}
            isRtl={isRtl}
          />
          <InputField
            label={lang === 'he' ? 'תיאור' : 'Description'}
            value={newMilestone.description}
            onChange={(val) => setNewMilestone({ ...newMilestone, description: val })}
            isRtl={isRtl}
          />
          <button
            onClick={addMilestone}
            className="w-full px-4 py-2 bg-gradient-to-r from-slate-900 to-indigo-700 text-white text-sm font-bold rounded-lg hover:from-slate-800 hover:to-indigo-600 transition-colors"
          >
            {lang === 'he' ? '+ הוסף תחנה' : '+ Add Milestone'}
          </button>
        </div>

        {/* List of Milestones */}
        <div className="space-y-2">
          {config.milestones && config.milestones.length > 0 ? (
            config.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-lg ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-indigo-600 text-sm">{milestone.year}</span>
                    <span className="font-semibold text-slate-900 text-sm">{milestone.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{milestone.description}</p>
                </div>
                <button
                  onClick={() => removeMilestone(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">
              {lang === 'he' ? 'אין תחנות עדיין' : 'No milestones yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemorialForm;
