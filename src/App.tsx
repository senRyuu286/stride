import { useState, useEffect } from 'react';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    setIsLoading(false);
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  
  return (
    <div>
      {showOnboarding ? (
        <OnboardingScreen onFinish={handleFinishOnboarding} />
      ) : (
        <MainDashboard />
      )}
    </div>
  );
};

interface OnboardingProps {
  onFinish: () => void; 
}

const OnboardingScreen = ({ onFinish }: OnboardingProps) => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>Welcome to the App! 🎉</h1>
    <p>This is the onboarding screen. You will only see this once.</p>
    
    <button onClick={onFinish} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Get Started
    </button>
  </div>
);

const MainDashboard = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>Main Dashboard 🏠</h1>
    <p>Welcome back! You bypass the onboarding because you are a returning user.</p>
  </div>
);

export default App;