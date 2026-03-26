import { useState } from 'react';

interface OnboardingProps {
  onFinish: () => void;
}

const STRIDE_STEPS = [
  {
    tagline: "Introducing",
    title: "Meet Stride.",
    description: "Your ultimate companion for focused workflows and effortless progress tracking. Designed to get out of your way.",
    visual: "✨", 
  },
  {
    tagline: "How it works",
    title: "Capture every step.",
    description: "Log your daily milestones in seconds. Swipe to complete, tap to edit. No clutter, just pure momentum.",
    visual: "⚡️",
  },
  {
    tagline: "Understand your rhythm",
    title: "Insights that matter.",
    description: "Visualize your habits over time with beautiful, intelligent charts that help you adapt and grow.",
    visual: "📈",
  },
  {
    tagline: "Get Started",
    title: "Ready to move forward?",
    description: "Set your first goal and let Stride handle the rest. Your journey begins here.",
    visual: "🚀",
  }
];

export default function OnboardingScreen({ onFinish }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (currentStep < STRIDE_STEPS.length - 1) {
      triggerAnimation(() => setCurrentStep(prev => prev + 1));
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      triggerAnimation(() => setCurrentStep(prev => prev - 1));
    }
  };

  const triggerAnimation = (action: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      action();
      setIsAnimating(false);
    }, 300);
  };

  const step = STRIDE_STEPS[currentStep];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-base-100 flex flex-col items-center justify-center text-base-content selection:bg-primary selection:text-primary-content">
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary opacity-20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary opacity-20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <main className="z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 pt-12 pb-24 h-full grow text-center">
        
        <div 
          key={currentStep} 
          className={`flex flex-col items-center max-w-2xl transition-opacity duration-300 animate-fade-in-up ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="w-40 h-40 md:w-56 md:h-56 mb-12 rounded-3xl bg-linear-to-tr from-base-200 to-base-300 shadow-2xl flex items-center justify-center text-6xl md:text-8xl border border-base-content/5">
            {step.visual}
          </div>

          <span className="text-sm md:text-base font-semibold tracking-widest uppercase text-primary mb-4">
            {step.tagline}
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-base-content to-base-content/50">
            {step.title}
          </h1>
          
          <p className="text-lg md:text-xl text-base-content/60 leading-relaxed max-w-lg">
            {step.description}
          </p>
        </div>
      </main>

      <footer className="z-20 w-full fixed bottom-0 left-0 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-base-100/50 backdrop-blur-xl border-t border-base-content/5">
        
        <div className="flex gap-3 order-2 md:order-1">
          {STRIDE_STEPS.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                index === currentStep 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-base-content/20'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
          <button 
            className={`btn btn-ghost rounded-full px-6 transition-opacity duration-300 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
            onClick={handleBack}
            disabled={isAnimating}
          >
            Back
          </button>
          
          <button 
            className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all border-none"
            onClick={handleNext}
            disabled={isAnimating}
          >
            {currentStep === STRIDE_STEPS.length - 1 ? "Enter Stride" : "Continue"}
          </button>
        </div>
      </footer>

    </div>
  );
}