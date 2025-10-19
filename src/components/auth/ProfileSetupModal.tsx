import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { saveUserProfile } from '../../lib/supabase';

interface ProfileSetupModalProps {
  userId: string;
  email: string;
  onComplete: () => void;
}

export function ProfileSetupModal({ userId, email, onComplete }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    const ageNum = parseInt(age);
    if (!age || ageNum < 13 || ageNum > 120) {
      toast.error('Please enter a valid age (13-120)');
      return;
    }

    setIsLoading(true);

    try {
      await saveUserProfile(userId, {
        email,
        name: name.trim(),
        age: ageNum,
        address: address.trim() || undefined
      });

      toast.success('Profile created successfully!');
      onComplete();
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: '#0b0f14' }}>
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
            <User className="w-8 h-8" style={{ color: '#ffffff' }} />
          </div>
          <h2 className="mb-2" style={{ color: '#e6eef8' }}>
            Complete Your Profile
          </h2>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>
            Tell us a bit about yourself
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
              Name <span style={{ color: '#FF5C5C' }}>*</span>
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <User className="w-5 h-5" style={{ color: '#9aa4b2' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#e6eef8' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
              Age <span style={{ color: '#FF5C5C' }}>*</span>
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Calendar className="w-5 h-5" style={{ color: '#9aa4b2' }} />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
                min="13"
                max="120"
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#e6eef8' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Address (Optional) */}
          <div className="mb-6">
            <label className="block mb-2 text-sm" style={{ color: '#9aa4b2' }}>
              Address <span className="text-xs">(optional)</span>
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <MapPin className="w-5 h-5" style={{ color: '#9aa4b2' }} />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Country"
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#e6eef8' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading || !name.trim() || !age}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: isLoading || !name.trim() || !age
                ? 'rgba(124, 92, 255, 0.3)'
                : 'linear-gradient(135deg, #7C5CFF, #00E5A8)',
              opacity: isLoading || !name.trim() || !age ? 0.5 : 1
            }}
            whileTap={{ scale: !isLoading && name.trim() && age ? 0.98 : 1 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ffffff' }} />
                <span style={{ color: '#ffffff' }}>Creating...</span>
              </>
            ) : (
              <span style={{ color: '#ffffff' }}>Continue</span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
