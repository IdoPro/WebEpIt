import React from 'react';
import { Memory } from '../types';
import MemoryCard from '../components/MemoryCard';

interface Props {
  memories: Memory[];
  onLike: (id: string) => void;
  onAddReply: (id: string, author: string, content: string) => void;
}

const MemoriesSection: React.FC<Props> = ({ memories, onLike, onAddReply }) => {
  return (
    <div className="max-w-6xl mx-auto py-24 px-4">
      <h2 className="text-4xl font-bold text-center mb-16">קיר זכרונות</h2>

      {memories.length === 0 ? (
        <div className="text-center text-slate-400 italic">
          טרם הועלו זכרונות
        </div>
      ) : (
        <div className="space-y-6">
          {memories.map(m => (
            <MemoryCard
              key={m._id || m.id}
              memory={m}
              onLike={onLike}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoriesSection;
