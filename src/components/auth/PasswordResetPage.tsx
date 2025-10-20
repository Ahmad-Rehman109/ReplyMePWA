import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../lib/supabase';

export function PasswordResetPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setHasError(true);
        toast.error('Invalid or expired reset link');
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Password updated successfully!');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasError) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: '#0b0f14' }}
      >
        <div
          className="w-full max-w-md rounded-3xl p-6 text-center"
          style={{
            background: '#0f1720',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255, 92, 92, 0.2)' }}
          >
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="mb-2" style={{ color: '#e6eef8' }}>Invalid Link</h2>
          <p className="mb-6" style={{ color: '#9aa4b2' }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/"
            className="inline-block w-full h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)' }}
          >
            <span style={{ color: '#ffffff' }}>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: '#0b0f14' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl p-6 text-center"
          style={{
            background: '#0f1720',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(0, 229, 168, 0.2)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: '#00E5A8' }} />
          </div>
          <h2 className="mb-2" style={{ color: '#e6eef8' }}>Password Updated!</h2>
          <p className="mb-6" style={{ color: '#9aa4b2' }}>
            Your password has been successfully updated. Redirecting...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#0b0f14' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl p-6"
        style={{
          background: '#0f1720',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)' }}
          >
            <Lock className="w-8 h-8" style={{ color: '#ffffff' }} />
          </div>
          <h2 className="mb-2" style={{ color: '#e6eef8' }}>
            Reset Your Password
          </h2>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
              New Password
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

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
              Confirm Password
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#e6eef8' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: !password || !confirmPassword || isLoading
                ? 'rgba(124, 92, 255, 0.3)'
                : 'linear-gradient(135deg, #7C5CFF, #00E5A8)',
              opacity: !password || !confirmPassword || isLoading ? 0.5 : 1
            }}
            whileTap={{ scale: password && confirmPassword && !isLoading ? 0.98 : 1 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ffffff' }} />
                <span style={{ color: '#ffffff' }}>Updating...</span>
              </>
            ) : (
              <span style={{ color: '#ffffff' }}>Update Password</span>
            )}
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm"
            style={{ color: '#7C5CFF' }}
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
