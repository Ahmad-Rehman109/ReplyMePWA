import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Heart, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import type { Generation } from '../../types';

interface ResultSheetProps {
  isOpen: boolean;
  onClose: () => void;
  generation: Generation | null;
  onToggleFavorite: (id: string) => void;
}

export function ResultSheet({ isOpen, onClose, generation, onToggleFavorite }: ResultSheetProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!generation) return null;

  const toneColors = {
    funny: '#FFB84D',
    bold: '#FF6B6B',
    mature: '#7C5CFF',
    mixed: '#00E5A8'
  };

  const toneEmojis = {
    funny: '😄',
    bold: '💪',
    mature: '🧘',
    mixed: '✨'
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      await handleCopy(text, -1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto"
            style={{
              background: '#0f1720',
              paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
              maxHeight: '90vh'
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="mb-2" style={{ color: '#e6eef8' }}>Your Comebacks 🔥</h2>
                  <p className="text-sm" style={{ color: '#9aa4b2' }}>
                    {generation.input}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleFavorite(generation.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <Heart 
                      className="w-5 h-5"
                      style={{ 
                        color: generation.isFavorite ? '#FF6B6B' : '#9aa4b2',
                        fill: generation.isFavorite ? '#FF6B6B' : 'none'
                      }}
                    />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                  </button>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4">
                {generation.replies.map((reply, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Tone badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{toneEmojis[reply.tone]}</span>
                      <span 
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{
                          background: `${toneColors[reply.tone]}20`,
                          color: toneColors[reply.tone]
                        }}
                      >
                        {reply.tone.charAt(0).toUpperCase() + reply.tone.slice(1)}
                      </span>
                    </div>

                    {/* Reply text */}
                    <p className="mb-2" style={{ color: '#e6eef8' }}>
                      {reply.text}
                    </p>

                    {/* Explanation */}
                    <p className="text-sm mb-4" style={{ color: '#9aa4b2' }}>
                      {reply.explanation}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleCopy(reply.text, index)}
                        className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2"
                        style={{ background: 'rgba(124, 92, 255, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4" style={{ color: '#7C5CFF' }} />
                            <span className="text-sm" style={{ color: '#7C5CFF' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" style={{ color: '#7C5CFF' }} />
                            <span className="text-sm" style={{ color: '#7C5CFF' }}>Copy</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare(reply.text)}
                        className="h-10 px-4 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(124, 92, 255, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Share2 className="w-4 h-4" style={{ color: '#7C5CFF' }} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
