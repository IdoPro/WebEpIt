
import React, { useState } from 'react';
import { Memory, Reply } from '../types';
import { Heart, User, Calendar, MessageSquare, Reply as ReplyIcon, Send, CornerDownLeft } from 'lucide-react';

interface Props {
  memory: Memory;
  onLike: (id: string) => void;
  onAddReply: (memoryId: string, author: string, content: string) => void;
}

const MemoryCard: React.FC<Props> = ({ memory, onLike, onAddReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyAuthor || !replyContent) return;
    onAddReply(memory.id, replyAuthor, replyContent);
    setReplyAuthor('');
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <div className="bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-amber-50 transition-colors">
            <User className="w-5 h-5 text-slate-400 group-hover:text-amber-600" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-0.5">{memory.author}</h4>
            <p className="text-[10px] text-slate-500 font-sans-hebrew">{memory.relation}</p>
          </div>
        </div>
        <div className="flex items-center text-slate-300 gap-1.5 text-[10px] font-sans-hebrew">
          <Calendar className="w-3 h-3" />
          {memory.date}
        </div>
      </div>
      
      <p className="text-slate-800 text-sm md:text-base leading-relaxed font-serif-hebrew whitespace-pre-wrap mb-6 pl-3 border-r-2 border-slate-50">
        {memory.content}
      </p>

      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex gap-2.5">
          <button 
            onClick={() => onLike(memory.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-sans-hebrew text-[10px] font-bold active:scale-95"
          >
            <Heart className={`w-3 h-3 ${memory.likes > 0 ? 'fill-current' : ''}`} />
            <span>{memory.likes}</span>
          </button>
          
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all font-sans-hebrew text-[10px] font-bold ${showReplyForm ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <ReplyIcon className="w-3 h-3" />
            <span>הגב</span>
          </button>
        </div>
        
        {memory.replies.length > 0 && (
          <div className="text-[10px] text-slate-400 font-sans-hebrew flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            {memory.replies.length} תגובות
          </div>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-5 p-4 bg-slate-50 rounded-xl animate-fadeIn border border-slate-100">
          <h5 className="text-xs font-bold mb-3 text-slate-800 flex items-center gap-1.5">
            כתיבת תגובה
          </h5>
          <form onSubmit={handleSubmitReply} className="space-y-2.5 font-sans-hebrew">
            <input 
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              placeholder="השם שלך"
              className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/10 text-xs"
            />
            <textarea 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="כתבו תגובה..."
              rows={2}
              className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/10 resize-none text-xs"
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors text-[10px] font-bold"
              >
                ביטול
              </button>
              <button 
                type="submit"
                className="bg-slate-900 text-white px-4 py-1 rounded-lg font-bold flex items-center gap-1.5 text-[10px] shadow-sm"
              >
                שלח תגובה <Send className="w-2.5 h-2.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {memory.replies.length > 0 && (
        <div className="mt-5 space-y-2.5 border-r-2 border-slate-50 pr-3">
          {memory.replies.map((reply) => (
            <div key={reply.id} className="bg-white p-3.5 rounded-xl border border-slate-50 shadow-sm text-[11px] md:text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{reply.author}</span>
                <span className="text-[9px] text-slate-300">{reply.date}</span>
              </div>
              <p className="text-slate-700 italic font-serif-hebrew leading-relaxed">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryCard;
