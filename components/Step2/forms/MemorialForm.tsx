import React, { useState } from 'react';
import { SiteConfig, Language, Milestone } from '@/types';
import { APP_NAME, DECEASED_NAME, YEARS_LIFE, HEBREW_YEARS, MOTTO } from '@/components/Memorial-Web/constants';
import InputField from '@/components/Step2/components/GenericInputField';

interface MemorialFormProps {
  lang: Language;
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
}

const MemorialForm: React.FC<MemorialFormProps> = ({ lang, config, setConfig }) => {
  const isRtl = lang === 'he';
  const [newMilestone, setNewMilestone] = useState<Milestone>({ year: '', title: '', description: '' });
  
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

      {/* Memorial Image */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
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
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700
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
        <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-xl">
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
            className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
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
