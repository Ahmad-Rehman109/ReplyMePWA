import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Eye, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export function PrivacyModal({ isOpen, onClose, userId }: PrivacyModalProps) {
  const handleDeleteAccount = () => {
    if (!userId) {
      toast.error('Please sign in first');
      return;
    }

    toast.info('Account deletion coming soon!');
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
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6" style={{ color: '#7C5CFF' }} />
                <h2 style={{ color: '#e6eef8' }}>Privacy & Security</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Data Privacy */}
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 mt-1" style={{ color: '#00E5A8' }} />
                  <div>
                    <h4 className="mb-1" style={{ color: '#e6eef8' }}>Your Data is Safe</h4>
                    <p className="text-sm" style={{ color: '#9aa4b2' }}>
                      Your messages are processed securely and never shared with third parties. We use encryption to protect your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Visibility */}
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Eye className="w-5 h-5 mt-1" style={{ color: '#7C5CFF' }} />
                  <div>
                    <h4 className="mb-1" style={{ color: '#e6eef8' }}>What We Collect</h4>
                    <p className="text-sm mb-2" style={{ color: '#9aa4b2' }}>
                      We only collect:
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: '#9aa4b2' }}>
                      <li>• Your email address for authentication</li>
                      <li>• Your profile information (name, age)</li>
                      <li>• Your generated reply history (stored locally)</li>
                      <li>• App usage statistics (anonymous)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Local Storage */}
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Lock className="w-5 h-5 mt-1" style={{ color: '#FFB84D' }} />
                  <div>
                    <h4 className="mb-1" style={{ color: '#e6eef8' }}>Local First</h4>
                    <p className="text-sm" style={{ color: '#9aa4b2' }}>
                      Your reply history is stored on your device. Only your profile and settings are synced to the cloud.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              {userId && (
                <button
                  onClick={handleDeleteAccount}
                  className="w-full p-4 rounded-2xl flex items-center gap-3"
                  style={{
                    background: 'rgba(255, 92, 92, 0.1)',
                    border: '1px solid rgba(255, 92, 92, 0.3)'
                  }}
                >
                  <Trash2 className="w-5 h-5" style={{ color: '#FF5C5C' }} />
                  <div className="text-left">
                    <p style={{ color: '#FF5C5C' }}>Delete Account</p>
                    <p className="text-xs" style={{ color: '#9aa4b2' }}>
                      Permanently delete your account and all data
                    </p>
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
