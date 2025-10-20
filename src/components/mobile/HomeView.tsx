import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Infinity } from 'lucide-react';
import type { Generation } from '../../types';

interface HomeViewProps {
  totalGenerations: number;
  recentHistory: Generation[];
  onGenerateClick: () => void;
  onHistoryItemClick: (generation: Generation) => void;
  isSignedIn: boolean;
}

export function HomeView({ 
  totalGenerations, 
  recentHistory, 
  onGenerateClick,
  onHistoryItemClick,
  isSignedIn
}: HomeViewProps) {
  import { toneColors } from '../../constants/toneColors';

  return (
    <div className="pb-24 px-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2" style={{ color: '#e6eef8' }}>
          Hey there! 👋
        </h1>
        <p style={{ color: '#9aa4b2' }}>
          What message needs a perfect reply today?
        </p>
      </motion.div>

      {/* Hero CTA */}
      <motion.button
        onClick={onGenerateClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full p-6 rounded-3xl mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)'
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative z-10">
          <Sparkles className="w-8 h-8 mb-3" style={{ color: '#ffffff' }} />
          <h3 className="mb-2" style={{ color: '#ffffff' }}>
            Generate Reply
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Get 3 AI-powered reply suggestions instantly
          </p>
        </div>
      </motion.button>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Infinity className="w-5 h-5" style={{ color: isSignedIn ? '#00E5A8' : '#FFB84D' }} />
            <span className="text-sm" style={{ color: '#9aa4b2' }}>Remaining</span>
          </div>
          <p className="text-2xl" style={{ color: '#e6eef8' }}>
            {isSignedIn ? '∞' : Math.max(0, 1 - totalGenerations)}
          </p>
          <p className="text-xs mt-1" style={{ color: isSignedIn ? '#00E5A8' : '#FFB84D' }}>
            {isSignedIn ? 'Unlimited' : 'Free trial'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#7C5CFF' }} />
            <span className="text-sm" style={{ color: '#9aa4b2' }}>Total Replies</span>
          </div>
          <p className="text-2xl" style={{ color: '#e6eef8' }}>{totalGenerations}</p>
          <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>All time</p>
        </motion.div>
      </div>

      {/* Recent History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: '#e6eef8' }}>Recent</h3>
          {recentHistory.length > 0 && (
            <span className="text-sm" style={{ color: '#9aa4b2' }}>
              Last {Math.min(recentHistory.length, 3)}
            </span>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <div 
            className="p-8 rounded-2xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed rgba(255, 255, 255, 0.2)'
            }}
          >
            <p style={{ color: '#9aa4b2' }}>
              No replies yet. Tap the + button to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentHistory.slice(0, 3).map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onHistoryItemClick(item)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="w-full p-4 rounded-2xl text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p 
                    className="text-sm flex-1 line-clamp-1"
                    style={{ color: '#e6eef8' }}
                  >
                    {item.input}
                  </p>
                  <div
                    className="w-2 h-2 rounded-full ml-2 mt-1 flex-shrink-0"
                    style={{ background: toneColors[item.tone] }}
                  />
                </div>
                <p className="text-xs" style={{ color: '#9aa4b2' }}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
