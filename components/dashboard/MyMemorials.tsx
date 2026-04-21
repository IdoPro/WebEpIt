import React, { useEffect, useState } from 'react';
import { Language } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import memorialManagementService, { OwnerMemorialSummary } from '../../services/memorialManagementService';

interface MyMemorialsProps {
  lang: Language;
  onManage: (memorialId: string) => void;
  onCreateNew: () => void;
}

const MyMemorials: React.FC<MyMemorialsProps> = ({ lang, onManage, onCreateNew }) => {
  const { user, logout } = useAuth();
  const [memorials, setMemorials] = useState<OwnerMemorialSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRtl = lang === 'he';

  useEffect(() => {
    memorialManagementService.listOwnerMemorials()
      .then(data => setMemorials(data))
      .catch(() => setError(lang === 'he' ? 'לא ניתן לטעון את האתרים' : 'Could not load your sites'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#fdfbf7]">

      {/* Top bar */}
      <header className="bg-white border-b border-[#e7e2db] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🕯️</span>
            <span className="font-bold text-stone-800 text-sm">Memorial Studio</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-xs text-stone-400 hidden sm:block">{user.email}</span>
            )}
            <button
              onClick={logout}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              {lang === 'he' ? 'יציאה' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {lang === 'he' ? 'האתרים שלי' : 'My Memorial Sites'}
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {lang === 'he' ? 'נהל ושתף את אתרי הזיכרון שיצרת' : 'Manage and share the memorials you created'}
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-bold rounded-xl transition-all"
          >
            <span>+</span>
            <span>{lang === 'he' ? 'אתר חדש' : 'New site'}</span>
          </button>
        </div>

        {/* States */}
        {loading && <MemorialGridSkeleton />}

        {!loading && error && (
          <div className="text-center py-16 text-stone-400 text-sm">{error}</div>
        )}

        {!loading && !error && memorials.length === 0 && (
          <EmptyState lang={lang} onCreateNew={onCreateNew} />
        )}

        {!loading && !error && memorials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memorials.map(m => (
              <MemorialCard key={m.id} memorial={m} lang={lang} onManage={() => onManage(m.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const MemorialCard: React.FC<{
  memorial: OwnerMemorialSummary;
  lang: Language;
  onManage: () => void;
}> = ({ memorial, lang, onManage }) => {
  const isRtl = lang === 'he';
  const pendingCount = memorial.stats?.pendingTributes ?? 0;

  return (
    <div className="bg-white border border-[#e7e2db] rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Hero image or placeholder */}
      <div className="h-36 bg-stone-100 relative flex items-center justify-center overflow-hidden">
        {memorial.heroImage ? (
          <img src={memorial.heroImage} alt={memorial.deceasedName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-30">🕯️</span>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'}`}>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
            memorial.status === 'published'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-stone-100 text-stone-500'
          }`}>
            {memorial.status === 'published'
              ? (lang === 'he' ? 'פעיל' : 'Live')
              : (lang === 'he' ? 'טיוטה' : 'Draft')}
          </span>
        </div>
        {/* Pending tributes badge */}
        {pendingCount > 0 && (
          <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              {pendingCount} {lang === 'he' ? 'ממתין' : 'pending'}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-bold text-stone-800 text-base mb-0.5">{memorial.deceasedName || memorial.title}</h3>
        <p className="text-xs text-stone-400 mb-4">
          {lang === 'he' ? 'נוצר' : 'Created'}{' '}
          {new Date(memorial.createdAt).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US')}
        </p>

        {/* Mini stats row */}
        <div className="flex gap-4 mb-4 text-center">
          <MiniStat label={lang === 'he' ? 'צפיות' : 'Views'} value={memorial.stats?.views ?? 0} />
          <MiniStat label={lang === 'he' ? 'נרות' : 'Candles'} value={memorial.stats?.candles ?? 0} />
          <MiniStat label={lang === 'he' ? 'זיכרונות' : 'Tributes'} value={memorial.stats?.approvedTributes ?? 0} />
        </div>

        {/* Completion bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-stone-400 mb-1">
            <span>{lang === 'he' ? 'השלמת פרופיל' : 'Profile completion'}</span>
            <span>{memorial.profileCompletion ?? 0}%</span>
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${memorial.profileCompletion ?? 0}%` }}
            />
          </div>
        </div>

        <button
          onClick={onManage}
          className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm font-bold rounded-xl transition-all"
        >
          {lang === 'he' ? 'נהל אתר' : 'Manage site'}
        </button>
      </div>
    </div>
  );
};

const MiniStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex-1">
    <div className="text-base font-bold text-stone-800">{value.toLocaleString()}</div>
    <div className="text-[10px] text-stone-400">{label}</div>
  </div>
);

const EmptyState: React.FC<{ lang: Language; onCreateNew: () => void }> = ({ lang, onCreateNew }) => (
  <div className="text-center py-20">
    <div className="text-5xl mb-4">🕯️</div>
    <h2 className="text-lg font-bold text-stone-700 mb-2">
      {lang === 'he' ? 'עדיין לא יצרת אתר זיכרון' : 'No memorial sites yet'}
    </h2>
    <p className="text-sm text-stone-400 mb-6">
      {lang === 'he' ? 'צור את אתר הזיכרון הראשון שלך תוך דקות' : 'Create your first memorial site in minutes'}
    </p>
    <button
      onClick={onCreateNew}
      className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-sm transition-all"
    >
      {lang === 'he' ? 'צור אתר זיכרון' : 'Create memorial site'}
    </button>
  </div>
);

const MemorialGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[1, 2].map(i => (
      <div key={i} className="bg-white border border-[#e7e2db] rounded-2xl overflow-hidden animate-pulse">
        <div className="h-36 bg-stone-100" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-stone-100 rounded w-2/3" />
          <div className="h-3 bg-stone-100 rounded w-1/3" />
          <div className="h-8 bg-stone-100 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export default MyMemorials;