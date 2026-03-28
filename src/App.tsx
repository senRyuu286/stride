import { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('hasSeenOnboarding')
  );

  useEffect(() => {
    const loadingTimeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => {
      window.clearTimeout(loadingTimeout);
    };
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      {showOnboarding ? (
        <Onboarding onFinish={handleFinishOnboarding} />
      ) : (
        <Dashboard />
      )}
    </>
  );
};

export default App;