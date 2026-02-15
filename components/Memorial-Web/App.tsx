
import React, { useState, useEffect } from 'react';
import { Memory, SectionType, Reply } from './types';
import { Language } from '@/types';
import { APP_NAME, DECEASED_NAME, YEARS_LIFE, HEBREW_YEARS, MOTTO, ACTS_OF_LIGHT } from './constants';
import MemoryCard from './components/MemoryCard';
import JewishSection from './components/JewishSection';
import { Flame, Heart, MessageSquare, Book, User, PlusCircle, Sparkles, Send, Quote, Star, Gift, Handshake, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import HomeSection from './sections/HomeSection';
import BioSection from './sections/BioSection';
import { ensureZL } from './helpers/formatDeceasedName';

export interface MemorialAppProps {
  config?: any;
  lang?: Language;
}

const Memorial_App: React.FC<MemorialAppProps> = ({ config, lang = 'he' }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [candleCount, setCandleCount] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.HOME);

  const [actCommitments, setActCommitments] = useState<Record<string, number>>({
    act_grace: 0,
    act_giving: 0,
    act_inspiration: 0,
    act_peace: 0
  });
  const [userCommitments, setUserCommitments] = useState<Set<string>>(new Set());

  const [newMemory, setNewMemory] = useState({ author: '', relation: '', content: '' });
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memoriesRes, statsRes] = await Promise.all([
          fetch('/api/memories').then(res => res.json()),
          fetch('/api/stats').then(res => res.json())
        ]);
        if (Array.isArray(memoriesRes)) setMemories(memoriesRes);
        if (statsRes) {
          setCandleCount(statsRes.candleCount || 124);
          setActCommitments(statsRes.commitments || actCommitments);
        }
      } catch (e) {
        console.warn("Backend not reachable, using offline mode.");
        setCandleCount(124);
      }
    };
    fetchData();
  }, []);

  const handleLightCandle = async () => {
    if (!isCandleLit) {
      setIsCandleLit(true);
      setCandleCount(prev => prev + 1);
      try {
        await fetch('/api/stats/candle', { method: 'POST' });
      } catch (e) { }
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.author || !newMemory.content) return;

    const memoryData = {
      ...newMemory,
      date: new Date().toLocaleDateString('he-IL'),
      likes: 0,
      replies: []
    };

    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryData)
      });
      const savedMemory = await response.json();
      setMemories([savedMemory, ...memories]);
    } catch (e) {
      // Fallback local update
      setMemories([{ ...memoryData, id: Date.now().toString() }, ...memories]);
    }

    setNewMemory({ author: '', relation: '', content: '' });
  };

  const handleAddReply = async (memoryId: string, replyAuthor: string, replyContent: string) => {
    try {
      const response = await fetch(`/api/memories/${memoryId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: replyAuthor, content: replyContent })
      });
      const updatedMemory = await response.json();
      setMemories(memories.map(m => m.id === memoryId || m._id === memoryId ? updatedMemory : m));
    } catch (e) {
      // Local UI update if server fails
      setMemories(memories.map(m => {
        if (m.id === memoryId || m._id === memoryId) {
          const newReply: Reply = {
            id: Date.now().toString(),
            author: replyAuthor,
            content: replyContent,
            date: new Date().toLocaleDateString('he-IL')
          };
          return { ...m, replies: [...m.replies, newReply] };
        }
        return m;
      }));
    }
  };

  const handleLike = async (id: string) => {
    // Optimistic UI update
    setMemories(memories.map(m => (m.id === id || m._id === id) ? { ...m, likes: m.likes + 1 } : m));
    try {
      await fetch(`/api/memories/${id}/like`, { method: 'POST' });
    } catch (e) { }
  };

  const handleTakeAct = async (actId: string) => {
    if (!userCommitments.has(actId)) {
      setUserCommitments(new Set(userCommitments).add(actId));
      setActCommitments({ ...actCommitments, [actId]: actCommitments[actId] + 1 });
      try {
        await fetch(`/api/stats/act/${actId}`, { method: 'POST' });
      } catch (e) { }
    }
  };

  const generateWithAi = async () => {
    if (!aiKeywords) return;
    setIsGenerating(true);
    // const result = await   helpWriteTribute(aiKeywords);
    // setNewMemory({ ...newMemory, content: result });
    setNewMemory({ ...newMemory });
    setIsGenerating(false);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Heart': return <Heart className="w-6 h-6 text-amber-500" />;
      case 'Gift': return <Gift className="w-6 h-6 text-amber-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Handshake': return <Handshake className="w-6 h-6 text-amber-500" />;
      default: return <Star className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-serif-hebrew overflow-x-hidden scroll-smooth text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection(SectionType.HOME)}>
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-slate-900 text-sm md:text-base">לזכרו של {ensureZL(((config?.deceasedName || DECEASED_NAME).split(' ')[0]))}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar font-sans-hebrew py-1">
            <button onClick={() => setActiveSection(SectionType.HOME)} className={`text-xs md:text-sm font-medium whitespace-nowrap px-1 py-1 transition-all ${activeSection === SectionType.HOME ? 'text-slate-900 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-800'}`}>בית</button>
            <button onClick={() => setActiveSection(SectionType.BIO)} className={`text-xs md:text-sm font-medium whitespace-nowrap px-1 py-1 transition-all ${activeSection === SectionType.BIO ? 'text-slate-900 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-800'}`}>סיפור חיים</button>
            <button onClick={() => setActiveSection(SectionType.MEMORIES)} className={`text-xs md:text-sm font-medium whitespace-nowrap px-1 py-1 transition-all ${activeSection === SectionType.MEMORIES ? 'text-slate-900 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-800'}`}>זכרונות</button>
            <button onClick={() => setActiveSection(SectionType.JUDAISM)} className={`text-xs md:text-sm font-medium whitespace-nowrap px-1 py-1 transition-all ${activeSection === SectionType.JUDAISM ? 'text-slate-900 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-800'}`}>לעילוי נשמה</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {activeSection === SectionType.HOME && (
          <>
            <HomeSection
              isCandleLit={isCandleLit}
              candleCount={candleCount}
              actCommitments={actCommitments}
              userCommitments={userCommitments}
              onLightCandle={handleLightCandle}
              onTakeAct={handleTakeAct}
              onNavigate={setActiveSection}
              getIcon={getIcon}
              config={config}
            />          </>
        )}

        {activeSection === SectionType.BIO && (
          <BioSection config={config} />
        )}

        {activeSection === SectionType.MEMORIES && (
          <div className="max-w-6xl mx-auto py-16 md:py-24 px-4">
            <div className="text-center mb-16 md:mb-20 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">קיר זכרונות</h2>
              <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full"></div>
              <p className="text-slate-600 text-sm md:text-base font-light font-sans-hebrew">שתפו איתנו רגע שקשור אליו</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 lg:sticky lg:top-24">
                  <h3 className="text-base md:text-lg font-bold mb-6 flex items-center gap-2.5 text-slate-900">
                    <PlusCircle className="text-blue-500 w-5 h-5" />
                    הוספת זיכרון
                  </h3>
                  <form onSubmit={handleAddMemory} className="space-y-5 font-sans-hebrew">
                    <div>
                      <label className="block text-[10px] font-black text-slate-800 mb-1.5 uppercase tracking-widest">שם המנציח</label>
                      <input
                        value={newMemory.author}
                        onChange={e => setNewMemory({ ...newMemory, author: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all bg-slate-50 text-xs md:text-sm"
                        placeholder="השם המלא שלך"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-800 mb-1.5 uppercase tracking-widest">הקשר שלך אליו</label>
                      <input
                        value={newMemory.relation}
                        onChange={e => setNewMemory({ ...newMemory, relation: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all bg-slate-50 text-xs md:text-sm"
                        placeholder="חבר, קולגה, בן משפחה..."
                      />
                    </div>

                    <div className="pt-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest">הזיכרון שלך</label>
                        <div className="relative group">
                          <button
                            type="button"
                            onClick={generateWithAi}
                            disabled={isGenerating || !aiKeywords}
                            className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-black shadow-sm disabled:opacity-50"
                          >
                            <Sparkles className="w-3 h-3" />
                            {isGenerating ? 'מעבד...' : 'עזרה בכתיבה'}
                          </button>
                        </div>
                      </div>
                      <input
                        value={aiKeywords}
                        onChange={e => setAiKeywords(e.target.value)}
                        placeholder="מילות מפתח (למשל: ים, חיוך, טיולים)"
                        className="w-full p-2 rounded-lg border border-slate-100 text-[10px] mb-2 font-sans-hebrew"
                      />
                      <textarea
                        value={newMemory.content}
                        onChange={e => setNewMemory({ ...newMemory, content: e.target.value })}
                        rows={4}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none bg-slate-50 text-sm md:text-base font-serif-hebrew leading-relaxed"
                        placeholder="שתפו סיפור קטן..."
                      />
                    </div>
                    <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]">
                      <Send className="w-3.5 h-3.5" />
                      פרסם לקיר הזכרונות
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {memories.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 italic bg-white rounded-2xl border-2 border-dashed border-slate-100 text-sm">טרם הועלו זכרונות.</div>
                ) : (
                  memories.map(memory => (
                    <MemoryCard
                      key={memory._id || memory.id}
                      memory={memory}
                      onLike={handleLike}
                      onAddReply={handleAddReply}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === SectionType.JUDAISM && <JewishSection config={config} />}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 md:py-20 border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-center md:text-right font-sans-hebrew">
            <div className="space-y-3 font-serif-hebrew">
              <h3 className="text-white font-bold text-xl md:text-2xl">{ensureZL(config?.deceasedName || DECEASED_NAME)}</h3>
              <p className="text-xs md:text-sm leading-relaxed max-w-xs mx-auto md:mr-0 font-light opacity-60">אתר הנצחה לזכרו של אדם יקר.</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-5">
                <button onClick={() => setActiveSection(SectionType.MEMORIES)} className="p-3 bg-white/5 rounded-full hover:bg-blue-600 text-white transition-all border border-white/10">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveSection(SectionType.JUDAISM)} className="p-3 bg-white/5 rounded-full hover:bg-amber-600 text-white transition-all border border-white/10">
                  <Book className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveSection(SectionType.HOME)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all border border-white/10">
                  <User className="w-4 h-4" />
                </button>
              </div>
              <p className="text-amber-200/40 text-base md:text-xl font-medium italic font-serif-hebrew">"תהא נשמתו צרורה בצרור החיים"</p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3 opacity-30">
              <p className="text-[10px] tracking-widest uppercase font-black">© 2024 לזכרו</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Memorial_App;
