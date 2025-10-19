import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Search, Heart, Trash2 } from 'lucide-react';
import type { Generation } from '../../types';

interface HistoryViewProps {
  history: Generation[];
  onHistoryItemClick: (generation: Generation) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function HistoryView({ 
  history, 
  onHistoryItemClick, 
  onToggleFavorite,
  onDeleteItem 
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const toneColors = {
    funny: '#FFB84D',
    bold: '#FF6B6B',
    mature: '#7C5CFF',
    mixed: '#00E5A8'
  };

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.replies.some(r => r.text.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filter === 'all' || item.isFavorite;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="pb-24 px-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="mb-2" style={{ color: '#e6eef8' }}>
          History
        </h1>
        <p style={{ color: '#9aa4b2' }}>
          View and manage your past replies
        </p>
      </motion.div>

      {/* Search */}
      <div className="mb-4">
        <div 
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Search className="w-5 h-5" style={{ color: '#9aa4b2' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="flex-1 bg-transparent outline-none"
            style={{ color: '#e6eef8' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2 rounded-xl"
          style={{
            background: filter === 'all' 
              ? 'rgba(124, 92, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.05)',
            border: filter === 'all'
              ? '1px solid #7C5CFF'
              : '1px solid rgba(255, 255, 255, 0.1)',
            color: filter === 'all' ? '#7C5CFF' : '#9aa4b2'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className="px-4 py-2 rounded-xl flex items-center gap-2"
          style={{
            background: filter === 'favorites' 
              ? 'rgba(124, 92, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.05)',
            border: filter === 'favorites'
              ? '1px solid #7C5CFF'
              : '1px solid rgba(255, 255, 255, 0.1)',
            color: filter === 'favorites' ? '#7C5CFF' : '#9aa4b2'
          }}
        >
          <Heart className="w-4 h-4" />
          Favorites
        </button>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div 
          className="p-8 rounded-2xl text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px dashed rgba(255, 255, 255, 0.2)'
          }}
        >
          <p style={{ color: '#9aa4b2' }}>
            {searchQuery || filter === 'favorites' 
              ? 'No results found' 
              : 'No history yet. Start generating replies!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <button
                  onClick={() => onHistoryItemClick(item)}
                  className="w-full p-4 rounded-2xl text-left"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p 
                      className="text-sm flex-1 line-clamp-2"
                      style={{ color: '#e6eef8' }}
                    >
                      {item.input}
                    </p>
                    <div
                      className="w-2 h-2 rounded-full ml-2 mt-1 flex-shrink-0"
                      style={{ background: toneColors[item.tone] }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#9aa4b2' }}>
                      {new Date(item.timestamp).toLocaleDateString()} • {item.replies.length} replies
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <Heart 
                          className="w-4 h-4"
                          style={{ 
                            color: item.isFavorite ? '#FF6B6B' : '#9aa4b2',
                            fill: item.isFavorite ? '#FF6B6B' : 'none'
                          }}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this item?')) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: '#FF5C5C' }} />
                      </button>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
