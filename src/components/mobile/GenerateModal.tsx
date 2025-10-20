import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import type { ToneType, GenerationMode } from '../../types';
interface GenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (input: string, tone: ToneType, mode?: GenerationMode) => Promise<void>;
  isLoading: boolean;
}

export function GenerateModal({ isOpen, onClose, onGenerate, isLoading }: GenerateModalProps) {
  const [input, setInput] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('savage');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState<GenerationMode>('standard');

  const tones = [
    { id: 'savage' as ToneType, emoji: '🔥', label: 'Savage', color: '#FF6B6B', desc: 'Brutally honest & devastating' },
    { id: 'funny' as ToneType, emoji: '😄', label: 'Funny', color: '#FFB84D', desc: 'Witty & humorous' },
    { id: 'bold' as ToneType, emoji: '💪', label: 'Bold', color: '#FF6B6B', desc: 'Confident & direct' },
    { id: 'flirty' as ToneType, emoji: '😏', label: 'Flirty', color: '#FF69B4', desc: 'Playful & charming' },
    { id: 'sarcastic' as ToneType, emoji: '🙄', label: 'Sarcastic', color: '#9B59B6', desc: 'Sharp & ironic' },
    { id: 'witty' as ToneType, emoji: '🧠', label: 'Witty', color: '#3498DB', desc: 'Clever & sharp' },
    { id: 'unhinged' as ToneType, emoji: '🤪', label: 'Unhinged', color: '#E74C3C', desc: 'Chaotic & wild' },
    { id: 'professional' as ToneType, emoji: '💼', label: 'Professional', color: '#34495E', desc: 'Polished & diplomatic' },
    { id: 'casual' as ToneType, emoji: '😎', label: 'Casual', color: '#1ABC9C', desc: 'Relaxed & chill' },
    { id: 'mysterious' as ToneType, emoji: '🎭', label: 'Mysterious', color: '#8E44AD', desc: 'Enigmatic & cryptic' },
    { id: 'mature' as ToneType, emoji: '🧘', label: 'Mature', color: '#7C5CFF', desc: 'Thoughtful & measured' },
    { id: 'mixed' as ToneType, emoji: '✨', label: 'Mixed', color: '#00E5A8', desc: 'Balanced variety' },
  ];

  const selectedToneObj = tones.find(t => t.id === selectedTone) || tones[0];

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    await onGenerate(input.trim(), selectedTone, mode);
    setInput('');
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
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6"
            style={{
              background: '#0f1720',
              paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 style={{ color: '#e6eef8' }}>Generate Comeback</h2>
                <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>
                  Get AI-powered replies with your chosen vibe ✨
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
              </button>
            </div>

            {/* Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
                Message you received
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste their message here... we'll roast it for you 😈"
                className="w-full h-32 px-4 py-3 rounded-2xl resize-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e6eef8'
                }}
              />
            </div>
            {/* Unfiltered Mode Toggle */}
      <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: '#e6eef8' }}>
              ⚡ Unfiltered Mode
            </span>
            {mode === 'unfiltered' && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#FF5C5C', color: '#fff' }}>
                BOLD
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMode(mode === 'standard' ? 'unfiltered' : 'standard')}
            className="relative w-12 h-7 rounded-full transition-colors"
            style={{
              background: mode === 'unfiltered' ? '#7C5CFF' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <div
              className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all"
              style={{ left: mode === 'unfiltered' ? '24px' : '4px' }}
            />
          </button>
        </div>
        {mode === 'unfiltered' && (
          <p className="text-xs mt-2" style={{ color: '#9aa4b2' }}>
            Max creativity & edge. No holding back. 🔥
          </p>
        )}
      </div>
            {/* Tone Dropdown */}
            <div className="mb-6 relative">
              <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
                Choose your vibe
              </label>
              
              {/* Selected tone display */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-4 rounded-2xl flex items-center justify-between"
                style={{
                  background: `${selectedToneObj.color}20`,
                  border: `2px solid ${selectedToneObj.color}`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedToneObj.emoji}</span>
                  <div className="text-left">
                    <p style={{ color: selectedToneObj.color }}>
                      {selectedToneObj.label}
                    </p>
                    <p className="text-xs" style={{ color: '#9aa4b2' }}>
                      {selectedToneObj.desc}
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  className="w-5 h-5 transition-transform"
                  style={{ 
                    color: selectedToneObj.color,
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-10"
                    style={{
                      background: '#0f1720',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    {tones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => {
                          setSelectedTone(tone.id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full p-3 flex items-center gap-3 transition-colors"
                        style={{
                          background: selectedTone === tone.id 
                            ? `${tone.color}15` 
                            : 'transparent',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <span className="text-xl">{tone.emoji}</span>
                        <div className="text-left flex-1">
                          <p 
                            className="text-sm"
                            style={{ color: selectedTone === tone.id ? tone.color : '#e6eef8' }}
                          >
                            {tone.label}
                          </p>
                          <p className="text-xs" style={{ color: '#9aa4b2' }}>
                            {tone.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate button */}
            <motion.button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: !input.trim() || isLoading
                  ? 'rgba(124, 92, 255, 0.3)'
                  : 'linear-gradient(135deg, #7C5CFF, #00E5A8)',
                opacity: !input.trim() || isLoading ? 0.5 : 1
              }}
              whileTap={{ scale: input.trim() && !isLoading ? 0.98 : 1 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ffffff' }} />
                  <span style={{ color: '#ffffff' }}>Generating...</span>
                </>
              ) : (
                <span style={{ color: '#ffffff' }}>Generate Comebacks</span>
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
