import { motion } from 'motion/react';
import { Crown, Bell, Lock, Download, Trash2, ChevronRight, Infinity, TrendingUp, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { UserProfile } from '../../lib/supabase';

interface ProfileViewProps {
  totalGenerations: number;
  onClearHistory: () => void;
  userProfile: UserProfile | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenNotifications: () => void;
  onOpenPrivacy: () => void;
}

export function ProfileView({ 
  totalGenerations, 
  onClearHistory, 
  userProfile, 
  onSignIn, 
  onSignOut,
  onOpenNotifications,
  onOpenPrivacy
}: ProfileViewProps) {
  const handleExportHistory = () => {
    try {
      const historyData = localStorage.getItem('replyMeHistory');
      if (!historyData || JSON.parse(historyData).length === 0) {
        toast.error('No history to export');
        return;
      }
      
      const blob = new Blob([historyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `replyme-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('History exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export history');
    }
  };

  const handleUpgradeToPro = () => {
    toast.info('🚀 Coming Soon!\n\nUnlimited replies are already free during beta.\nPremium features will be available soon.', {
      duration: 4000,
    });
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        ...(userProfile ? [] : [{
          label: 'Sign In',
          icon: LogIn,
          color: '#00E5A8',
          action: onSignIn
        }]),
        {
          label: 'Upgrade to Pro',
          icon: Crown,
          color: '#FFB84D',
          action: handleUpgradeToPro
        },
        {
          label: 'Notifications',
          icon: Bell,
          action: onOpenNotifications
        },
        {
          label: 'Privacy',
          icon: Lock,
          action: onOpenPrivacy
        },
        ...(userProfile ? [{
          label: 'Sign Out',
          icon: LogOut,
          color: '#FF5C5C',
          action: onSignOut
        }] : [])
      ]
    },
    {
      title: 'Data',
      items: [
        {
          label: 'Export History',
          icon: Download,
          action: handleExportHistory
        },
        {
          label: 'Clear History',
          icon: Trash2,
          color: '#FF5C5C',
          action: onClearHistory
        }
      ]
    }
  ];

  return (
    <div className="pb-24 px-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2" style={{ color: '#e6eef8' }}>
          Profile
        </h1>
        <p style={{ color: '#9aa4b2' }}>
          Manage your account and preferences
        </p>
      </motion.div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-3xl mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 92, 255, 0.2), rgba(0, 229, 168, 0.2))',
          border: '1px solid rgba(124, 92, 255, 0.3)'
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)'
            }}
          >
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h3 style={{ color: '#e6eef8' }}>
              {userProfile?.name || 'Guest User'}
            </h3>
            <p className="text-sm" style={{ color: '#00E5A8' }}>
              {userProfile ? 'Free Beta Access' : 'Not signed in'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="p-3 rounded-xl"
            style={{ background: 'rgba(0, 0, 0, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Infinity className="w-4 h-4" style={{ color: '#00E5A8' }} />
              <span className="text-xs" style={{ color: '#9aa4b2' }}>Remaining</span>
            </div>
            <p className="text-xl" style={{ color: '#e6eef8' }}>∞</p>
          </div>
          <div 
            className="p-3 rounded-xl"
            style={{ background: 'rgba(0, 0, 0, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: '#7C5CFF' }} />
              <span className="text-xs" style={{ color: '#9aa4b2' }}>Total</span>
            </div>
            <p className="text-xl" style={{ color: '#e6eef8' }}>{totalGenerations}</p>
          </div>
        </div>
      </motion.div>

      {/* Beta Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 rounded-2xl"
        style={{ background: 'rgba(124, 92, 255, 0.1)' }}
      >
        <p className="text-xs text-center" style={{ color: '#7C5CFF' }}>
          💎 Enjoying unlimited free replies during beta
        </p>
      </motion.div>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + sectionIndex * 0.1 }}
          className="mb-6"
        >
          <h4 className="mb-3 text-sm" style={{ color: '#9aa4b2' }}>
            {section.title}
          </h4>
          <div 
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {section.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  onClick={item.action}
                  className="w-full px-4 py-4 flex items-center justify-between"
                  style={{
                    borderBottom: index < section.items.length - 1 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : 'none'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      className="w-5 h-5"
                      style={{ color: item.color || '#9aa4b2' }}
                    />
                    <span style={{ color: item.color || '#e6eef8' }}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* App Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-xs" style={{ color: '#9aa4b2' }}>
          ReplyMe v1.0.0 Beta
        </p>
      </motion.div>
    </div>
  );
}
