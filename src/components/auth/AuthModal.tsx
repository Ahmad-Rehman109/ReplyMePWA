import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { signInWithOTP, verifyOTP } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithOTP(email);
      setOtpSent(true);
      toast.success('OTP sent! Check your email.');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    
    try {
      await verifyOTP(email, otp);
      toast.success('Signed in successfully!');
      handleClose();
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setOtp('');
    setOtpSent(false);
    onClose();
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await signInWithOTP(email);
      toast.success('New OTP sent!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
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
                  {otpSent ? 'Enter Code' : 'Sign In'}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                </button>
              </div>

              {!otpSent ? (
                <>
                  <p className="mb-6" style={{ color: '#9aa4b2' }}>
                    Enter your email to receive a 6-digit verification code.
                  </p>

                  <form onSubmit={handleSendOTP}>
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
                          autoComplete="email"
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
                        <span style={{ color: '#ffffff' }}>Send Code</span>
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(0, 229, 168, 0.2)' }}
                  >
                    <Mail className="w-8 h-8" style={{ color: '#00E5A8' }} />
                  </div>
                  
                  <p className="text-sm mb-6 text-center" style={{ color: '#9aa4b2' }}>
                    We sent a 6-digit code to <strong style={{ color: '#7C5CFF' }}>{email}</strong>
                  </p>

                  <form onSubmit={handleVerifyOTP}>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="w-full h-14 text-center text-2xl tracking-widest rounded-xl bg-transparent outline-none"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#e6eef8',
                          letterSpacing: '0.5em'
                        }}
                        disabled={isLoading}
                        maxLength={6}
                        autoComplete="one-time-code"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full h-12 rounded-xl flex items-center justify-center gap-2 mb-3"
                      style={{
                        background: otp.length !== 6 || isLoading
                          ? 'rgba(124, 92, 255, 0.3)'
                          : 'linear-gradient(135deg, #7C5CFF, #00E5A8)',
                        opacity: otp.length !== 6 || isLoading ? 0.5 : 1
                      }}
                      whileTap={{ scale: otp.length === 6 && !isLoading ? 0.98 : 1 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ffffff' }} />
                          <span style={{ color: '#ffffff' }}>Verifying...</span>
                        </>
                      ) : (
                        <span style={{ color: '#ffffff' }}>Verify & Sign In</span>
                      )}
                    </motion.button>
                  </form>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-sm"
                      style={{ color: '#9aa4b2' }}
                      disabled={isLoading}
                    >
                      ← Change email
                    </button>
                    <button
                      onClick={handleResendOTP}
                      className="text-sm"
                      style={{ color: '#7C5CFF' }}
                      disabled={isLoading}
                    >
                      Resend code
                    </button>
                  </div>
                </motion.div>
              )}

              <p className="text-xs text-center mt-4" style={{ color: '#9aa4b2' }}>
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
