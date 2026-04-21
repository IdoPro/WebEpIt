import React, { useEffect, useState, useCallback } from 'react';
import { Language } from '../../../types';
import memorialManagementService from '../../../services/memorialManagementService';
import { SectionHeader } from '../ManagementShell';

type TributeStatus = 'pending' | 'approved' | 'rejected';
type FilterTab = 'pending' | 'approved';

interface Tribute {
  _id: string;
  authorName: string;
  relation?: string;
  content: string;
  status: TributeStatus;
  featured: boolean;
  createdAt: string;
  likesCount?: number;
}

interface CommunityTabProps {
  lang: Language;
  memorialId: string;
  onCountChange: () => void;
}

const CommunityTab: React.FC<CommunityTabProps> = ({ lang, memorialId, onCountChange }) => {
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null); // which tribute is mid-action
  const isRtl = lang === 'he';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await memorialManagementService.listTributes(memorialId, filter);
      setTributes(data as Tribute[]);
    } catch {
      setTributes([]);
    } finally {
      setLoading(false);
    }
  }, [memorialId, filter]);

  useEffect(() => { load(); }, [load]);

  const act = async (tributeId: string, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    setActionId(tributeId);
    try {
      await memorialManagementService.moderateTribute(memorialId, tributeId, action);
      await load();
      onCountChange(); // refresh badge count in shell header
    } finally {
      setActionId(null);
    }
  };

  const pendingLabel = lang === 'he' ? 'ממתינים לאישור' : 'Pending';
  const approvedLabel = lang === 'he' ? 'אושרו' : 'Approved';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionHeader
        title={lang === 'he' ? 'ניהול קהילה' : 'Community'}
        subtitle={lang === 'he' ? 'אשר, מחק או הדגש זיכרונות שנשלחו' : 'Approve, delete, or feature submitted tributes'}
      />

      {/* Filter tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {(['pending', 'approved'] as FilterTab[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {f === 'pending' ? pendingLabel : approvedLabel}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <TributeSkeleton />
      ) : tributes.length === 0 ? (
        <EmptyTributes lang={lang} filter={filter} />
      ) : (
        <div className="space-y-3">
          {tributes.map(tribute => (
            <TributeCard
              key={tribute._id}
              tribute={tribute}
              lang={lang}
              filter={filter}
              isLoading={actionId === tribute._id}
              onApprove={() => act(tribute._id, 'approve')}
              onReject={() => act(tribute._id, 'reject')}
              onFeature={() => act(tribute._id, tribute.featured ? 'unfeature' : 'feature')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const TributeCard: React.FC<{
  tribute: Tribute;
  lang: Language;
  filter: FilterTab;
  isLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  onFeature: () => void;
}> = ({ tribute, lang, filter, isLoading, onApprove, onReject, onFeature }) => {
  const isRtl = lang === 'he';
  const timeAgo = formatTimeAgo(tribute.createdAt, lang);

  return (
    <div className={`bg-white border rounded-2xl p-5 transition-all ${
      isLoading ? 'opacity-50 pointer-events-none' : 'border-[#e7e2db]'
    } ${tribute.featured ? 'ring-2 ring-amber-300' : ''}`}>

      {/* Author row */}
      <div className={`flex items-start justify-between gap-3 mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 text-sm">{tribute.authorName}</span>
            {tribute.relation && (
              <span className="text-xs text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full">
                {tribute.relation}
              </span>
            )}
            {tribute.featured && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                ★ {lang === 'he' ? 'מוצג' : 'Featured'}
              </span>
            )}
          </div>
          <span className="text-xs text-stone-400">{timeAgo}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-stone-700 leading-relaxed mb-4 whitespace-pre-wrap">
        "{tribute.content}"
      </p>

      {/* Action buttons */}
      <div className={`flex gap-2 flex-wrap ${isRtl ? 'justify-end' : 'justify-start'}`}>
        {filter === 'pending' && (
          <>
            <ActionButton
              onClick={onApprove}
              variant="approve"
              label={lang === 'he' ? '✓ אשר ופרסם' : '✓ Approve'}
            />
            <ActionButton
              onClick={onReject}
              variant="reject"
              label={lang === 'he' ? '✕ מחק' : '✕ Delete'}
            />
          </>
        )}
        {filter === 'approved' && (
          <>
            <ActionButton
              onClick={onFeature}
              variant={tribute.featured ? 'unfeature' : 'feature'}
              label={tribute.featured
                ? (lang === 'he' ? '★ הסר הדגשה' : '★ Unfeature')
                : (lang === 'he' ? '★ הדגש' : '★ Feature')}
            />
            <ActionButton
              onClick={onReject}
              variant="reject"
              label={lang === 'he' ? '✕ מחק' : '✕ Delete'}
            />
          </>
        )}
      </div>
    </div>
  );
};

type ButtonVariant = 'approve' | 'reject' | 'feature' | 'unfeature';

const variantStyles: Record<ButtonVariant, string> = {
  approve:   'bg-emerald-500 hover:bg-emerald-600 text-white',
  reject:    'bg-white border border-red-200 text-red-600 hover:bg-red-50',
  feature:   'bg-white border border-amber-200 text-amber-600 hover:bg-amber-50',
  unfeature: 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100',
};

const ActionButton: React.FC<{ onClick: () => void; variant: ButtonVariant; label: string }> = ({ onClick, variant, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${variantStyles[variant]}`}
  >
    {label}
  </button>
);

const EmptyTributes: React.FC<{ lang: Language; filter: FilterTab }> = ({ lang, filter }) => (
  <div className="text-center py-16 text-stone-400">
    <div className="text-4xl mb-3">{filter === 'pending' ? '📬' : '💬'}</div>
    <p className="text-sm font-medium text-stone-500">
      {filter === 'pending'
        ? (lang === 'he' ? 'אין זיכרונות הממתינים לאישור' : 'No pending tributes')
        : (lang === 'he' ? 'אין זיכרונות שאושרו עדיין' : 'No approved tributes yet')}
    </p>
    {filter === 'pending' && (
      <p className="text-xs text-stone-400 mt-1">
        {lang === 'he' ? 'כאשר מישהו ישלח זיכרון הוא יופיע כאן' : 'When someone submits a tribute, it will appear here'}
      </p>
    )}
  </div>
);

const TributeSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white border border-[#e7e2db] rounded-2xl p-5 space-y-3">
        <div className="h-4 w-32 bg-stone-100 rounded" />
        <div className="h-16 bg-stone-100 rounded" />
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-stone-100 rounded-xl" />
          <div className="h-7 w-16 bg-stone-100 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeAgo(dateStr: string, lang: Language): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  if (lang === 'he') {
    if (mins < 60)  return `לפני ${mins} דקות`;
    if (hours < 24) return `לפני ${hours} שעות`;
    return `לפני ${days} ימים`;
  } else {
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

export default CommunityTab;