import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { OnboardingFlow } from './components/mobile/OnboardingFlow';
import { BottomNav, TabType } from './components/mobile/BottomNav';
import { HomeView } from './components/mobile/HomeView';
import { ExploreView } from './components/mobile/ExploreView';
import { HistoryView } from './components/mobile/HistoryView';
import { ProfileView } from './components/mobile/ProfileView';
import { GenerateModal } from './components/mobile/GenerateModal';
import { ResultSheet } from './components/mobile/ResultSheet';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { PasswordResetPage } from './components/auth/PasswordResetPage';
import { NotificationsModal } from './components/mobile/NotificationsModal';
import { PrivacyModal } from './components/mobile/PrivacyModal';
import { generateReplies, moderateContent } from './lib/groq';
import { supabase, getCurrentUser, getUserProfile, signOut, type UserProfile } from './lib/supabase';
import type { Generation, ToneType } from './types';

export default function App() {
  // ====== ADD THIS CHECK AT THE VERY BEGINNING ======
  // Check if we're on the password reset page
  if (window.location.pathname === '/auth/reset-password') {
    return <PasswordResetPage />;
  }
  // ===================================================

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('replyMeOnboarding') === 'completed';
  });
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [history, setHistory] = useState<Generation[]>(() => {
    const saved = localStorage.getItem('replyMeHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [isResultSheetOpen, setIsResultSheetOpen] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('replyMeHistory', JSON.stringify(history));
  }, [history]);

  // Auth listener
  useEffect(() => {
    // Check current session
    getCurrentUser().then(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.id);
        if (profile) {
          setUserProfile(profile);
        } else {
          setNeedsProfileSetup(true);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUserProfile(profile);
          setIsAuthModalOpen(false);
        } else {
          // New user - needs profile setup
          setNeedsProfileSetup(true);
          setIsAuthModalOpen(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setNeedsProfileSetup(false);
      } else if (event === 'PASSWORD_RECOVERY') {
        // User clicked password reset link - could show a modal here if needed
        console.log('Password recovery mode');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('replyMeOnboarding', 'completed');
    setHasCompletedOnboarding(true);
  };

  const handleGenerate = async (input: string, tone: ToneType) => {
    // Check if user needs to sign in (after 1 free generation)
    if (!user && history.length >= 1) {
      setIsGenerateModalOpen(false);
      toast.error('Sign in to continue generating comebacks! 🔒');
      setTimeout(() => setIsAuthModalOpen(true), 500);
      return;
    }

    // Content moderation
    const isAppropriate = await moderateContent(input);
    if (!isAppropriate) {
      toast.error('Please enter appropriate content');
      return;
    }

    setIsLoading(true);
    setIsGenerateModalOpen(false);

    try {
      const replies = await generateReplies(input, tone);
      
      const newGeneration: Generation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        input,
        tone,
        replies,
        isFavorite: false
      };

      setHistory(prev => [newGeneration, ...prev]);
      setSelectedGeneration(newGeneration);
      setIsResultSheetOpen(true);
      
      toast.success('Comebacks generated! 🔥');
      
      // Show login reminder after first free generation
      if (!user && history.length === 0) {
        setTimeout(() => {
          toast.info('💡 Sign in to unlock unlimited comebacks!', { duration: 5000 });
        }, 2000);
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate comebacks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (scenario: string, tone: ToneType) => {
    // Check if user needs to sign in for templates too
    if (!user && history.length >= 1) {
      toast.error('Sign in to use templates! 🔒');
      setTimeout(() => setIsAuthModalOpen(true), 500);
      return;
    }
    await handleGenerate(scenario, tone);
  };

  const handleHistoryItemClick = (generation: Generation) => {
    setSelectedGeneration(generation);
    setIsResultSheetOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    if (selectedGeneration?.id === id) {
      setSelectedGeneration(prev => 
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  const handleDeleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Item deleted');
  };

  const handleClearHistory = () => {
    if (confirm('Clear all history?\n\nThis cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('replyMeHistory');
      toast.success('History cleared successfully');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleProfileSetupComplete = async () => {
    setNeedsProfileSetup(false);
    if (user) {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  // Show profile setup if user just signed in
  if (needsProfileSetup && user) {
    return (
      <ProfileSetupModal
        userId={user.id}
        email={user.email || ''}
        onComplete={handleProfileSetupComplete}
      />
    );
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{ 
        background: '#0b0f14',
        paddingTop: 'env(safe-area-inset-top)',
        maxWidth: '428px',
        margin: '0 auto'
      }}
    >
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0f1720',
            color: '#e6eef8',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      />

      {/* Main Content */}
      <div className="min-h-screen">
        {activeTab === 'home' && (
          <HomeView
            totalGenerations={history.length}
            recentHistory={history}
            onGenerateClick={() => setIsGenerateModalOpen(true)}
            onHistoryItemClick={handleHistoryItemClick}
            isSignedIn={!!user}
          />
        )}
        
        {activeTab === 'explore' && (
          <ExploreView onTemplateSelect={handleTemplateSelect} />
        )}
        
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onHistoryItemClick={handleHistoryItemClick}
            onToggleFavorite={handleToggleFavorite}
            onDeleteItem={handleDeleteItem}
          />
        )}
        
        {activeTab === 'profile' && (
          <ProfileView
            totalGenerations={history.length}
            onClearHistory={handleClearHistory}
            userProfile={userProfile}
            onSignIn={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onGenerateClick={() => setIsGenerateModalOpen(true)}
      />

      {/* Generate Modal */}
      <GenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      {/* Result Sheet */}
      <ResultSheet
        isOpen={isResultSheetOpen}
        onClose={() => setIsResultSheetOpen(false)}
        generation={selectedGeneration}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        userId={user?.id || null}
      />

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        userId={user?.id || null}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)' }}>
              <span className="text-2xl">✨</span>
            </div>
            <p style={{ color: '#e6eef8' }}>Generating comebacks...</p>
          </div>
        </div>
      )}
    </div>
  );
}
