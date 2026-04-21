import React, { useEffect, useState } from 'react';
import { Language } from '../../types';
import memorialManagementService, { MemorialDashboard } from '../../services/memorialManagementService';
import OverviewTab from './tabs/OverviewTab';
import CommunityTab from './tabs/CommunityTab';
import ProfileTab from './tabs/ProfileTab';

type TabId = 'overview' | 'profile' | 'community' | 'insights' | 'settings';

interface Tab {
  id: TabId;
  labelHe: string;
  labelEn: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'overview',   labelHe: 'סקירה',    labelEn: 'Overview',   icon: '🏠' },
  { id: 'profile',    labelHe: 'פרטים',    labelEn: 'Details',    icon: '👤' },
  { id: 'community',  labelHe: 'קהילה',    labelEn: 'Community',  icon: '💬' },
  { id: 'insights',   labelHe: 'תובנות',   labelEn: 'Insights',   icon: '📊' },
  { id: 'settings',   labelHe: 'הגדרות',   labelEn: 'Settings',   icon: '⚙️' },
];

interface ManagementShellProps {
  lang: Language;
  memorialId: string;
  onBack: () => void;
}

const ManagementShell: React.FC<ManagementShellProps> = ({ lang, memorialId, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [dashboard, setDashboard] = useState<MemorialDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const isRtl = lang === 'he';

  const loadDashboard = async () => {
    try {
      const data = await memorialManagementService.getDashboard(memorialId);
      setDashboard(data);
    } catch {
      // non-fatal — tabs will show their own error states
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, [memorialId]);

  const deceasedName = dashboard?.memorial?.title || '…';
  const publicUrl = dashboard?.memorial?.urlPath
    ? `${window.location.origin}/m/${dashboard.memorial.urlPath}`
    : null;

  const pendingCount = dashboard?.stats?.tributes?.pending ?? 0;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#fdfbf7] flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#e7e2db] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          {/* Back + name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="text-stone-400 hover:text-stone-700 transition-colors flex-shrink-0"
              title={lang === 'he' ? 'חזרה לאתרים שלי' : 'Back to my sites'}
            >
              {isRtl ? '→' : '←'}
            </button>
            <h1 className="font-bold text-stone-800 text-sm truncate">
              {loading ? '…' : deceasedName}
            </h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e7e2db] rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <span>👁</span>
                <span className="hidden sm:inline">{lang === 'he' ? 'צפה באתר' : 'View site'}</span>
              </a>
            )}
            <ShareButton lang={lang} url={publicUrl} />
          </div>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-5 flex gap-1 overflow-x-auto scrollbar-none pb-0">
          {TABS.map(tab => {
            const isCommunity = tab.id === 'community';
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-stone-800 text-stone-800'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'he' ? tab.labelHe : tab.labelEn}</span>
                {isCommunity && pendingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Tab content ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            lang={lang}
            dashboard={dashboard}
            loading={loading}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            lang={lang}
            memorialId={memorialId}
            dashboard={dashboard}
            onSaved={loadDashboard}
          />
        )}
        {activeTab === 'community' && (
          <CommunityTab
            lang={lang}
            memorialId={memorialId}
            onCountChange={loadDashboard}
          />
        )}
        {activeTab === 'insights' && (
          <InsightsTab lang={lang} dashboard={dashboard} loading={loading} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab lang={lang} dashboard={dashboard} publicUrl={publicUrl} />
        )}
      </main>
    </div>
  );
};

// ── Inline simple tabs (no separate file needed yet) ───────────────────────

const InsightsTab: React.FC<{ lang: Language; dashboard: MemorialDashboard | null; loading: boolean }> = ({ lang, dashboard, loading }) => {
  if (loading) return <TabSkeleton />;
  const s = dashboard?.stats?.last30Days;
  const cards = [
    { label: lang === 'he' ? 'צפיות (30 יום)' : 'Views (30d)',       value: s?.views ?? 0 },
    { label: lang === 'he' ? 'מבקרים ייחודיים' : 'Unique visitors',  value: s?.uniqueVisitors ?? 0 },
    { label: lang === 'he' ? 'נרות הודלקו' : 'Candles lit',         value: s?.candles ?? 0 },
    { label: lang === 'he' ? 'לייקים' : 'Likes',                    value: s?.likes ?? 0 },
    { label: lang === 'he' ? 'זיכרונות שנשלחו' : 'Tributes submitted', value: s?.tributesSubmitted ?? 0 },
    { label: lang === 'he' ? 'שיתופים' : 'Shares',                  value: s?.shares ?? 0 },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader
        title={lang === 'he' ? 'תובנות' : 'Insights'}
        subtitle={lang === 'he' ? '30 הימים האחרונים' : 'Last 30 days'}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-[#e7e2db] rounded-xl p-4">
            <div className="text-2xl font-bold text-stone-800 mb-1">{c.value.toLocaleString()}</div>
            <div className="text-xs text-stone-400">{c.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-400 text-center">
        {lang === 'he' ? 'גרפים מפורטים — בקרוב' : 'Detailed charts — coming soon'}
      </p>
    </div>
  );
};

const SettingsTab: React.FC<{ lang: Language; dashboard: MemorialDashboard | null; publicUrl: string | null }> = ({ lang, dashboard, publicUrl }) => {
  const [copied, setCopied] = useState(false);
  const copyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="space-y-6 max-w-xl">
      <SectionHeader
        title={lang === 'he' ? 'הגדרות' : 'Settings'}
        subtitle={lang === 'he' ? 'ניהול קישור וחשיפה' : 'Link and visibility'}
      />
      {publicUrl && (
        <div className="bg-white border border-[#e7e2db] rounded-xl p-5 space-y-3">
          <label className="block text-xs font-bold text-stone-600">
            {lang === 'he' ? 'קישור ציבורי לאתר' : 'Public site link'}
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2 rounded-lg border border-[#e7e2db] text-xs text-stone-600 bg-stone-50 outline-none"
            />
            <button
              onClick={copyUrl}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-stone-800 text-white hover:bg-stone-700'}`}
            >
              {copied ? '✓' : (lang === 'he' ? 'העתק' : 'Copy')}
            </button>
          </div>
        </div>
      )}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-red-700 mb-1">
          {lang === 'he' ? 'מחיקת האתר' : 'Delete site'}
        </h3>
        <p className="text-xs text-red-500 mb-3">
          {lang === 'he' ? 'פעולה זו לא ניתנת לביטול.' : 'This action cannot be undone.'}
        </p>
        <button className="text-xs text-red-600 font-semibold border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
          {lang === 'he' ? 'מחק אתר זיכרון' : 'Delete memorial site'}
        </button>
      </div>
    </div>
  );
};

// ── Shared helpers ──────────────────────────────────────────────────────────

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-stone-800">{title}</h2>
    {subtitle && <p className="text-sm text-stone-400 mt-0.5">{subtitle}</p>}
  </div>
);

export const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 w-40 bg-stone-100 rounded" />
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-20 bg-stone-100 rounded-xl" />)}
    </div>
  </div>
);

const ShareButton: React.FC<{ lang: Language; url: string | null }> = ({ lang, url }) => {
  const [copied, setCopied] = useState(false);
  if (!url) return null;
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        copied ? 'bg-emerald-500 text-white' : 'bg-stone-800 text-white hover:bg-stone-700'
      }`}
    >
      {copied ? '✓' : '🔗'}
      <span className="hidden sm:inline">
        {copied ? (lang === 'he' ? 'הועתק' : 'Copied') : (lang === 'he' ? 'שתף' : 'Share')}
      </span>
    </button>
  );
};

export default ManagementShell;