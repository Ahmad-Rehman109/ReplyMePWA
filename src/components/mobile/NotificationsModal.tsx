import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Mail, Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export function NotificationsModal({ isOpen, onClose, userId }: NotificationsModalProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    pushNotifications: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadSettings();
    }
  }, [isOpen, userId]);

  const loadSettings = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f94d273/settings/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof typeof settings) => {
    if (!userId) {
      toast.error('Please sign in to change settings');
      return;
    }

    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setIsSaving(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f94d273/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, settings: newSettings })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      toast.success('Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
      // Revert on error
      setSettings(settings);
    } finally {
      setIsSaving(false);
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

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6"
            style={{
              background: '#0f1720',
              paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
              maxHeight: '80vh'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" style={{ color: '#7C5CFF' }} />
                <h2 style={{ color: '#e6eef8' }}>Notifications</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7C5CFF' }} />
              </div>
            ) : !userId ? (
              <div className="text-center py-8">
                <p style={{ color: '#9aa4b2' }}>Please sign in to manage notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* All Notifications */}
                <div
                  className="p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                    <div>
                      <p style={{ color: '#e6eef8' }}>All Notifications</p>
                      <p className="text-xs" style={{ color: '#9aa4b2' }}>
                        Enable or disable all notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    disabled={isSaving}
                    className="relative w-12 h-7 rounded-full transition-colors"
                    style={{
                      background: settings.notifications ? '#7C5CFF' : 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 rounded-full bg-white"
                      animate={{ left: settings.notifications ? '24px' : '4px' }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </div>

                {/* Email Notifications */}
                <div
                  className="p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    opacity: settings.notifications ? 1 : 0.5
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                    <div>
                      <p style={{ color: '#e6eef8' }}>Email Notifications</p>
                      <p className="text-xs" style={{ color: '#9aa4b2' }}>
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    disabled={isSaving || !settings.notifications}
                    className="relative w-12 h-7 rounded-full transition-colors"
                    style={{
                      background: settings.emailNotifications ? '#7C5CFF' : 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 rounded-full bg-white"
                      animate={{ left: settings.emailNotifications ? '24px' : '4px' }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </div>

                {/* Push Notifications */}
                <div
                  className="p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    opacity: settings.notifications ? 1 : 0.5
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                    <div>
                      <p style={{ color: '#e6eef8' }}>Push Notifications</p>
                      <p className="text-xs" style={{ color: '#9aa4b2' }}>
                        Get alerts on your device
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    disabled={isSaving || !settings.notifications}
                    className="relative w-12 h-7 rounded-full transition-colors"
                    style={{
                      background: settings.pushNotifications ? '#7C5CFF' : 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 rounded-full bg-white"
                      animate={{ left: settings.pushNotifications ? '24px' : '4px' }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
