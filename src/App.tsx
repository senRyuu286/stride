import { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import { useTaskStore } from './store/useTaskStore';

const App = () => {
  const isHydrated = useTaskStore((state) => state._hasHydrated);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('hasSeenOnboarding')
  );

  useEffect(() => {
    const loadingTimeout = window.setTimeout(() => {
      if (isHydrated) {
        setIsLoading(false);
      }
    }, 100);

    return () => window.clearTimeout(loadingTimeout);
  }, [isHydrated]);

  const handleFinishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (isLoading || !isHydrated) {
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