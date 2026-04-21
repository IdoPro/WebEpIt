import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../../../types';
import { MemorialDashboard } from '../../../services/memorialManagementService';
import memorialManagementService from '../../../services/memorialManagementService';
import { SectionHeader } from '../ManagementShell';

interface ProfileTabProps {
  lang: Language;
  memorialId: string;
  dashboard: MemorialDashboard | null;
  onSaved: () => void;
}

interface ProfileForm {
  deceasedName: string;
  hebrewName: string;
  birthDate: string;
  deathDate: string;
  openingLine: string;
  biography: string;
  familyMessage: string;
  location: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const ProfileTab: React.FC<ProfileTabProps> = ({ lang, memorialId, dashboard, onSaved }) => {
  const profile = dashboard?.profile as Record<string, any> | null;
  const isRtl = lang === 'he';

  const [form, setForm] = useState<ProfileForm>({
    deceasedName:  profile?.deceasedName  || '',
    hebrewName:    profile?.hebrewName    || '',
    birthDate:     profile?.birthDate     || '',
    deathDate:     profile?.deathDate     || '',
    openingLine:   profile?.openingLine   || '',
    biography:     profile?.biography     || '',
    familyMessage: profile?.familyMessage || '',
    location:      profile?.location      || '',
  });

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  // Autosave — fires 1.5 s after the last change
  useEffect(() => {
    if (!isDirty.current) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveState('saving');
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await memorialManagementService.updateProfile(memorialId, form);
        setSaveState('saved');
        onSaved();
        setTimeout(() => setSaveState('idle'), 2000);
      } catch {
        setSaveState('error');
      }
    }, 1500);

    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [form]);

  const update = (key: keyof ProfileForm) => (value: string) => {
    isDirty.current = true;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header with autosave indicator */}
      <div className="flex items-center justify-between">
        <SectionHeader
          title={lang === 'he' ? 'פרטי ההנצחה' : 'Memorial details'}
          subtitle={lang === 'he' ? 'השינויים נשמרים אוטומטית' : 'Changes are saved automatically'}
        />
        <AutoSaveBadge state={saveState} lang={lang} />
      </div>

      {/* Section: Who */}
      <FormSection title={lang === 'he' ? 'פרטי הנפטר' : 'Deceased info'}>
        <Field
          label={lang === 'he' ? 'שם מלא' : 'Full name'}
          value={form.deceasedName}
          onChange={update('deceasedName')}
          placeholder={lang === 'he' ? 'דוד כהן' : 'David Cohen'}
          isRtl={isRtl}
        />
        <Field
          label={lang === 'he' ? 'שם בעברית' : 'Hebrew name'}
          value={form.hebrewName}
          onChange={update('hebrewName')}
          placeholder={lang === 'he' ? 'דוד בן אברהם' : 'David ben Avraham'}
          isRtl={isRtl}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label={lang === 'he' ? 'תאריך לידה' : 'Date of birth'}
            value={form.birthDate}
            onChange={update('birthDate')}
            type="date"
            isRtl={isRtl}
          />
          <Field
            label={lang === 'he' ? 'תאריך פטירה' : 'Date of passing'}
            value={form.deathDate}
            onChange={update('deathDate')}
            type="date"
            isRtl={isRtl}
          />
        </div>
        <Field
          label={lang === 'he' ? 'עיר מגורים' : 'City / location'}
          value={form.location}
          onChange={update('location')}
          placeholder={lang === 'he' ? 'תל אביב' : 'Tel Aviv'}
          isRtl={isRtl}
        />
      </FormSection>

      {/* Section: Content */}
      <FormSection title={lang === 'he' ? 'תוכן האתר' : 'Site content'}>
        <Field
          label={lang === 'he' ? 'משפט פתיחה' : 'Opening line'}
          value={form.openingLine}
          onChange={update('openingLine')}
          placeholder={lang === 'he' ? 'אדם של חסד, משפחה ולב גדול' : 'A person of kindness, family and a big heart'}
          isRtl={isRtl}
        />
        <TextareaField
          label={lang === 'he' ? 'ביוגרפיה' : 'Biography'}
          value={form.biography}
          onChange={update('biography')}
          placeholder={lang === 'he'
            ? 'ספרו על חייו — מקום הולדת, עיסוק, ערכים, משפחה…'
            : 'Tell their story — birthplace, occupation, values, family…'}
          rows={6}
          isRtl={isRtl}
        />
        <TextareaField
          label={lang === 'he' ? 'הודעת משפחה' : 'Family message'}
          value={form.familyMessage}
          onChange={update('familyMessage')}
          placeholder={lang === 'he'
            ? 'מילים מהמשפחה למבקרים באתר…'
            : 'A message from the family to site visitors…'}
          rows={3}
          isRtl={isRtl}
        />
      </FormSection>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-[#e7e2db] rounded-2xl p-5 space-y-4">
    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">{title}</h3>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  isRtl?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', isRtl }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-stone-600">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border border-[#e7e2db] bg-[#fdfbf7] text-stone-800 placeholder:text-stone-400 text-sm outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all ${isRtl ? 'text-right' : ''}`}
    />
  </div>
);

const TextareaField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  isRtl?: boolean;
}> = ({ label, value, onChange, placeholder, rows = 4, isRtl }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-stone-600">{label}</label>
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border border-[#e7e2db] bg-[#fdfbf7] text-stone-800 placeholder:text-stone-400 text-sm outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all resize-none leading-relaxed ${isRtl ? 'text-right' : ''}`}
    />
  </div>
);

const AutoSaveBadge: React.FC<{ state: SaveState; lang: Language }> = ({ state, lang }) => {
  const map: Record<SaveState, { text: string; cls: string }> = {
    idle:   { text: '',                                              cls: 'opacity-0' },
    saving: { text: lang === 'he' ? 'שומר…' : 'Saving…',          cls: 'text-stone-400' },
    saved:  { text: lang === 'he' ? '✓ נשמר' : '✓ Saved',         cls: 'text-emerald-600' },
    error:  { text: lang === 'he' ? '✕ שגיאה' : '✕ Save failed',  cls: 'text-red-500' },
  };
  const { text, cls } = map[state];
  return (
    <span className={`text-xs font-semibold transition-all ${cls}`}>{text}</span>
  );
};

export default ProfileTab;