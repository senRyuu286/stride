import { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('hasSeenOnboarding'),
  );

  useEffect(() => {
    const loadingTimeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 0);

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
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <main>
      {showOnboarding ? (
        <Onboarding onFinish={handleFinishOnboarding} />
      ) : (
        <Dashboard />
      )}
    </main>
  );
};

export default App;