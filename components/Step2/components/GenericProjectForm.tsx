import React, { useCallback, useEffect } from 'react';
import { SiteConfig, Language, PrototypeType } from '@/types';
import { UI_STRINGS, COLORS, PROTOTYPES } from '@/constants';
import MemorialForm from '@/components/Step2/forms/MemorialForm';
import InputField from './GenericInputField';
import ColorPicker from './GenericColorPicker';


interface ProjectFormProps {
  lang: Language;
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  isAdvancedMode?: boolean;
}

const GenericProjectForm: React.FC<ProjectFormProps> = ({ lang, config, setConfig, isAdvancedMode = false }) => {
  if (!config) return null;

  const t = UI_STRINGS[lang] || UI_STRINGS['en'];
  const isRtl = lang === 'he';

  const toggleFeature = useCallback(
    (feature: string) => {
      setConfig(prev => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature],
      }));
    },
    [setConfig]
  );

  useEffect(() => {
    console.log('Rendering form for prototype:', config.prototype);
  }, [config.prototype]);


  // רינדור פורם דינמי לפי Prototype
  const renderPrototypeForm = () => {
    if (!config?.prototype) return null;
    console.log('Rendering form for prototype:', config.prototype);

    switch (config.prototype) {
      case PrototypeType.MEMORIAL:
        return <MemorialForm lang={lang} config={config} setConfig={setConfig} />;
      // כאן אפשר להוסיף קומפוננטות נוספות ל-Prototypes אחרים
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-thin">
      {/* פורם דינמי */}
      {renderPrototypeForm()}

      {/* שדות כלליים */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.projectName}</label>
            <input
              type="text"
              placeholder={t.projectNamePlaceholder}
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.brandColors}</label>
            <ColorPicker
              colors={COLORS}
              selected={config.primaryColor}
              onSelect={(color) => setConfig({ ...config, primaryColor: color })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.description}</label>
            <textarea
              rows={5}
              placeholder={t.descriptionPlaceholder}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
            />
          </div>
        </div>
      </div> */}

      {/* Features & Integrations - Only in Advanced Mode */}
      {isAdvancedMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4">{t.features}</label>
            <div className="space-y-2">
              {PROTOTYPES.find(p => p.id === config.prototype)?.features[lang].map((f) => (
                <label
                  key={f}
                  className={`flex items-center gap-3 p-3 rounded-xl ring-1 ring-slate-100 hover:ring-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all ${isRtl ? 'flex-row-reverse' : ''
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={config.features.includes(f)}
                    onChange={() => toggleFeature(f)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-600 flex-1">{f}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 mb-4">{t.integrations}</label>
            <div className="space-y-3">
              <InputField
                label="MongoDB URI (Optional)"
                value={config.mongodbUri || ''}
                onChange={(val) => setConfig({ ...config, mongodbUri: val })}
                isRtl={isRtl}
              />
              <InputField
                label="Backblaze Key (Optional)"
                value={config.backblazeKey || ''}
                onChange={(val) => setConfig({ ...config, backblazeKey: val })}
                isRtl={isRtl}
              />
            </div>
          </div>
        </div>
      )}
      {/* Features & Integrations Old - Remove from non-advanced */}
    </div>
  );
};


export default GenericProjectForm;