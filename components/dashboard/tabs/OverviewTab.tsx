import React from 'react';
import { Language } from '../../../types';
import { MemorialDashboard } from '../../../services/memorialManagementService';
import { SectionHeader, TabSkeleton } from '../ManagementShell';

type TabId = 'overview' | 'profile' | 'community' | 'insights' | 'settings';

interface OverviewTabProps {
  lang: Language;
  dashboard: MemorialDashboard | null;
  loading: boolean;
  onNavigate: (tab: TabId) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ lang, dashboard, loading, onNavigate }) => {
  if (loading) return <TabSkeleton />;

  const stats = dashboard?.stats;
  const pendingTributes = stats?.tributes?.pending ?? 0;
  const completion = dashboard?.profileCompletion ?? 0;

  // Next best action logic
  const nextAction = getNextAction(lang, dashboard, pendingTributes, completion, onNavigate);

  return (
    <div className="space-y-8">
      <SectionHeader
        title={lang === 'he' ? 'סקירה כללית' : 'Overview'}
        subtitle={lang === 'he' ? 'מה קורה באתר שלך' : 'What\'s happening on your site'}
      />

      {/* Next action banner — the most important element */}
      {nextAction && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">{nextAction.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">{nextAction.title}</p>
            <p className="text-xs text-amber-600 mt-0.5">{nextAction.desc}</p>
          </div>
          <button
            onClick={nextAction.onAction}
            className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all"
          >
            {nextAction.cta}
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={lang === 'he' ? 'צפיות (30 יום)' : 'Views (30d)'}
          value={stats?.last30Days?.views ?? 0}
          icon="👁"
        />
        <StatCard
          label={lang === 'he' ? 'נרות' : 'Candles'}
          value={stats?.lifetimeCandles ?? 0}
          icon="🕯️"
        />
        <StatCard
          label={lang === 'he' ? 'זיכרונות' : 'Tributes'}
          value={stats?.tributes?.approved ?? 0}
          icon="💬"
        />
        <StatCard
          label={lang === 'he' ? 'תמונות' : 'Photos'}
          value={stats?.mediaCount ?? 0}
          icon="🖼"
        />
      </div>

      {/* Profile completion */}
      <div className="bg-white border border-[#e7e2db] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-stone-700">
            {lang === 'he' ? 'השלמת הפרופיל' : 'Profile completion'}
          </span>
          <span className="text-sm font-bold text-stone-800">{completion}%</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${completion}%`,
              background: completion === 100 ? '#10b981' : '#d97706',
            }}
          />
        </div>
        <CompletionChecklist lang={lang} dashboard={dashboard} />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
          {lang === 'he' ? 'פעולות מהירות' : 'Quick actions'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon="👤" label={lang === 'he' ? 'ערוך פרטים' : 'Edit details'} onClick={() => onNavigate('profile')} />
          <QuickAction icon="💬" label={lang === 'he' ? 'ניהול קהילה' : 'Manage tributes'} onClick={() => onNavigate('community')} badge={pendingTributes} />
          <QuickAction icon="📊" label={lang === 'he' ? 'תובנות' : 'Insights'} onClick={() => onNavigate('insights')} />
          <QuickAction icon="⚙️" label={lang === 'he' ? 'הגדרות' : 'Settings'} onClick={() => onNavigate('settings')} />
        </div>
      </div>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: number; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white border border-[#e7e2db] rounded-xl p-4">
    <div className="text-lg mb-1">{icon}</div>
    <div className="text-2xl font-bold text-stone-800">{value.toLocaleString()}</div>
    <div className="text-xs text-stone-400 mt-0.5">{label}</div>
  </div>
);

const QuickAction: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  badge?: number;
}> = ({ icon, label, onClick, badge }) => (
  <button
    onClick={onClick}
    className="relative bg-white border border-[#e7e2db] rounded-xl p-4 text-center hover:border-stone-400 hover:shadow-sm transition-all group"
  >
    <div className="text-2xl mb-1.5">{icon}</div>
    <div className="text-xs font-semibold text-stone-600 group-hover:text-stone-800 transition-colors">{label}</div>
    {badge != null && badge > 0 && (
      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
        {badge}
      </span>
    )}
  </button>
);

const CompletionChecklist: React.FC<{ lang: Language; dashboard: MemorialDashboard | null }> = ({ lang, dashboard }) => {
  const content = dashboard?.profile as Record<string, any> | null;
  const items = [
    {
      label: lang === 'he' ? 'שם הנפטר' : 'Deceased name',
      done: !!(content?.deceasedName),
    },
    {
      label: lang === 'he' ? 'משפט פתיחה' : 'Opening line',
      done: !!(content?.openingLine),
    },
    {
      label: lang === 'he' ? 'ביוגרפיה' : 'Biography',
      done: !!(content?.biography),
    },
    {
      label: lang === 'he' ? 'תמונה ראשית' : 'Main photo',
      done: !!(dashboard?.memorial?.heroImage),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(item => (
        <div key={item.label} className={`flex items-center gap-2 text-xs ${item.done ? 'text-stone-400' : 'text-stone-600 font-medium'}`}>
          <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
            item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'
          }`}>
            {item.done ? '✓' : '○'}
          </span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

// ── Next action logic ───────────────────────────────────────────────────────

interface NextAction {
  icon: string;
  title: string;
  desc: string;
  cta: string;
  onAction: () => void;
}

function getNextAction(
  lang: Language,
  dashboard: MemorialDashboard | null,
  pendingTributes: number,
  completion: number,
  onNavigate: (tab: TabId) => void,
): NextAction | null {
  if (pendingTributes > 0) {
    return {
      icon: '💬',
      title: lang === 'he'
        ? `${pendingTributes} זיכרונות חדשים מחכים לאישור`
        : `${pendingTributes} new tribute${pendingTributes > 1 ? 's' : ''} waiting for review`,
      desc: lang === 'he'
        ? 'בדוק ואשר את הזיכרונות שנשלחו על ידי המשפחה'
        : 'Review and approve tributes sent by family and friends',
      cta: lang === 'he' ? 'לאישור' : 'Review',
      onAction: () => onNavigate('community'),
    };
  }

  const content = dashboard?.profile as Record<string, any> | null;
  if (!content?.biography) {
    return {
      icon: '✍️',
      title: lang === 'he' ? 'הוסף את הסיפור האישי' : 'Add the personal story',
      desc: lang === 'he'
        ? 'ביוגרפיה קצרה תעשיר את חוויית המבקרים באתר'
        : 'A short biography enriches the experience for site visitors',
      cta: lang === 'he' ? 'כתוב עכשיו' : 'Write now',
      onAction: () => onNavigate('profile'),
    };
  }

  if (completion < 80) {
    return {
      icon: '📷',
      title: lang === 'he' ? 'הוסף תמונות לגלריה' : 'Add photos to the gallery',
      desc: lang === 'he'
        ? 'גלריה עשירה מזמינה משפחה וחברים לחזור שוב ושוב'
        : 'A rich gallery keeps family and friends coming back',
      cta: lang === 'he' ? 'הוסף תמונות' : 'Add photos',
      onAction: () => onNavigate('settings'),
    };
  }

  return null;
}

export default OverviewTab;