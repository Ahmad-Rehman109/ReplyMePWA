import { motion } from 'motion/react';
import { Home, Compass, Plus, Clock, User } from 'lucide-react';

export type TabType = 'home' | 'explore' | 'history' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onGenerateClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onGenerateClick }: BottomNavProps) {
  const tabs = [
    { id: 'home' as TabType, icon: Home, label: 'Home' },
    { id: 'explore' as TabType, icon: Compass, label: 'Explore' },
    { id: 'generate' as TabType, icon: Plus, label: 'Generate', isFAB: true },
    { id: 'history' as TabType, icon: Clock, label: 'History' },
    { id: 'profile' as TabType, icon: User, label: 'Profile' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: '#0f1720',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        paddingTop: '12px'
      }}
    >
      <div className="flex items-center justify-around px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          if (tab.isFAB) {
            return (
              <motion.button
                key={tab.id}
                onClick={onGenerateClick}
                aria-label="Generate new comeback"
                className="relative -mt-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-7 h-7" style={{ color: '#ffffff' }} />
              </motion.button>
            );
          }

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={`Navigate to ${tab.label}`}
              className="flex flex-col items-center gap-1 py-2 px-4"
              whileTap={{ scale: 0.95 }}
            >
              <Icon 
                className="w-6 h-6"
                style={{ 
                  color: isActive ? '#7C5CFF' : '#9aa4b2',
                  strokeWidth: isActive ? 2.5 : 2
                }}
              />
              <span 
                className="text-xs"
                style={{ 
                  color: isActive ? '#7C5CFF' : '#9aa4b2'
                }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
