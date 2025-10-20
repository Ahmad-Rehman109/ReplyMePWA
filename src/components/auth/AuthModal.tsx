import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { signUpWithEmail, signInWithPassword } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'signin' | 'signup';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithPassword(email, password);
      toast.success('Signed in successfully!');
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password);
      toast.success('Account created! Please check your email to verify.');
      // Modal will stay open so user can see profile setup after verification
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    setActiveTab('signin');
    setShowForgotPassword(false);
    onClose();
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordView 
        onBack={() => setShowForgotPassword(false)} 
        onClose={handleClose}
        isOpen={isOpen}
      />
    );
  }

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
                <h2 style={{ color: '#e6eef8' }}>Welcome Back</h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <button
                  onClick={() => setActiveTab('signin')}
                  className="flex-1 py-2 rounded-lg transition-all"
                  style={{
                    background: activeTab === 'signin' ? '#7C5CFF' : 'transparent',
                    color: activeTab === 'signin' ? '#ffffff' : '#9aa4b2'
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className="flex-1 py-2 rounded-lg transition-all"
                  style={{
                    background: activeTab === 'signup' ? '#7C5CFF' : 'transparent',
                    color: activeTab === 'signup' ? '#ffffff' : '#9aa4b2'
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp}>
                {/* Email Input */}
                <div className="mb-4">
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

                {/* Password Input */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
                    Password
                  </label>
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Lock className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-transparent outline-none"
                      style={{ color: '#e6eef8' }}
                      disabled={isLoading}
                      autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                      ) : (
                        <Eye className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link (Sign In only) */}
                {activeTab === 'signin' && (
                  <div className="mb-6 text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm"
                      style={{ color: '#7C5CFF' }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: !email || !password || isLoading
                      ? 'rgba(124, 92, 255, 0.3)'
                      : 'linear-gradient(135deg, #7C5CFF, #00E5A8)',
                    opacity: !email || !password || isLoading ? 0.5 : 1
                  }}
                  whileTap={{ scale: email && password && !isLoading ? 0.98 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>
                        {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
                      </span>
                    </>
                  ) : (
                    <span style={{ color: '#ffffff' }}>
                      {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                    </span>
                  )}
                </motion.button>
              </form>

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

// Forgot Password View Component
function ForgotPasswordView({ 
  onBack, 
  onClose, 
  isOpen 
}: { 
  onBack: () => void; 
  onClose: () => void;
  isOpen: boolean;
}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    try {
      const { sendPasswordResetEmail } = await import('../../lib/supabase');
      await sendPasswordResetEmail(email);
      setEmailSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          />

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
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ color: '#e6eef8' }}>
                  {emailSent ? 'Check Your Email' : 'Reset Password'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#9aa4b2' }} />
                </button>
              </div>

              {emailSent ? (
                <div className="text-center">
                  <p className="mb-4" style={{ color: '#9aa4b2' }}>
                    We've sent a password reset link to <strong style={{ color: '#7C5CFF' }}>{email}</strong>
                  </p>
                  <button
                    onClick={onBack}
                    className="w-full h-12 rounded-xl"
                    style={{ background: 'rgba(124, 92, 255, 0.2)', color: '#7C5CFF' }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-6" style={{ color: '#9aa4b2' }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleSendReset}>
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
                      className="w-full h-12 rounded-xl flex items-center justify-center gap-2 mb-3"
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
                        <span style={{ color: '#ffffff' }}>Send Reset Link</span>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={onBack}
                      className="w-full h-12 rounded-xl"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#9aa4b2' }}
                    >
                      Back to Sign In
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
