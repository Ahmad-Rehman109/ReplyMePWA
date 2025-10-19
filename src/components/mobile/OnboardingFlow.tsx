import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, MessageCircle, Sparkles, Lock } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: MessageCircle,
      title: 'Welcome to ReplyMe',
      description: 'Never be stuck on what to say again. Generate perfect text replies in seconds.',
      gradient: 'from-[#7C5CFF] to-[#9D7FFF]'
    },
    {
      icon: Sparkles,
      title: 'Choose Your Vibe',
      description: 'Pick from Funny, Bold, Mature, or Mixed tones to match any conversation.',
      gradient: 'from-[#00E5A8] to-[#00C896]'
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your messages are processed securely and never stored on our servers.',
      gradient: 'from-[#FFB84D] to-[#FF9D4D]'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0b0f14' }}>
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md text-center"
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${slides[currentSlide].gradient.includes('7C5CFF') ? '#7C5CFF, #9D7FFF' : slides[currentSlide].gradient.includes('00E5A8') ? '#00E5A8, #00C896' : '#FFB84D, #FF9D4D'})`
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {(() => {
                const Icon = slides[currentSlide].icon;
                return <Icon className="w-12 h-12" style={{ color: '#ffffff' }} />;
              })()}
            </motion.div>

            <h1 className="mb-4" style={{ color: '#e6eef8' }}>
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-lg" style={{ color: '#9aa4b2' }}>
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-12">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-2 rounded-full transition-all duration-220"
              style={{
                width: index === currentSlide ? '32px' : '8px',
                background: index === currentSlide ? '#7C5CFF' : 'rgba(124, 92, 255, 0.3)'
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)' }}
          whileTap={{ scale: 0.98 }}
        >
          <span style={{ color: '#ffffff' }}>
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          </span>
          <ChevronRight className="w-5 h-5" style={{ color: '#ffffff' }} />
        </motion.button>
      </div>
    </div>
  );
}
