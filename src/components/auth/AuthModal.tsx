import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { signInWithMagicLink } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithMagicLink(email);
      setEmailSent(true);
      toast.success('Magic link sent! Check your email.');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="w-full max-w-md rounded-3xl p-6"
              style={{
                background: '#0f1720',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ color: '#e6eef8' }}>
                  {emailSent ? 'Check Your Email' : 'Sign In'}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                </button>
              </div>

              {emailSent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(0, 229, 168, 0.2)' }}
                  >
                    <CheckCircle2 className="w-8 h-8" style={{ color: '#00E5A8' }} />
                  </div>
                  <h3 className="mb-2" style={{ color: '#e6eef8' }}>
                    Magic Link Sent!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: '#9aa4b2' }}>
                    We sent a magic link to <strong style={{ color: '#7C5CFF' }}>{email}</strong>
                    <br />
                    Click the link in your email to sign in.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full h-12 rounded-xl"
                    style={{ background: 'rgba(124, 92, 255, 0.2)', color: '#7C5CFF' }}
                  >
                    Got it
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="mb-6" style={{ color: '#9aa4b2' }}>
                    Enter your email to receive a magic link for instant sign in. No password needed!
                  </p>

                  <form onSubmit={handleSendMagicLink}>
                    <div className="mb-6">
                      <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
                        Email address
                      </label>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <Mail className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="flex-1 bg-transparent outline-none"
                          style={{ color: '#e6eef8' }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
                      style={{
                        background: !email || isLoading
                          ? 'rgba(124, 92, 255, 0.3)'
                          : 'linear-gradient(135deg, #7C5CFF, #00E5A8)',
                        opacity: !email || isLoading ? 0.5 : 1
                      }}
                      whileTap={{ scale: email && !isLoading ? 0.98 : 1 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ffffff' }} />
                          <span style={{ color: '#ffffff' }}>Sending...</span>
                        </>
                      ) : (
                        <span style={{ color: '#ffffff' }}>Send Magic Link</span>
                      )}
                    </motion.button>
                  </form>

                  <p className="text-xs text-center mt-4" style={{ color: '#9aa4b2' }}>
                    By continuing, you agree to our Terms & Privacy Policy
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
