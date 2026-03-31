import React, { useEffect, useRef, useState } from "react";
import {
  Target,
  Calendar,
  CheckCircle,
  ArrowRight,
  Brain,
  Zap,
} from "lucide-react";
import {
  LazyMotion,
  domAnimation,
  m,
  useInView,
} from "motion/react";

export interface OnboardingProps {
  onFinish: () => void;
}

const FadeSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={`will-change-transform will-change-opacity ${className}`}
    >
      {children}
    </m.div>
  );
};

export default function Onboarding({ onFinish }: OnboardingProps) {
  const [theme, setTheme] = useState("stride-light");
  const [isPastHeroBtn, setIsPastHeroBtn] = useState(false);

  const heroBtnRef = useRef<HTMLDivElement>(null);
  const footerBtnRef = useRef<HTMLDivElement>(null);

  const isFooterBtnVisible = useInView(footerBtnRef, { amount: 0.1 });

  useEffect(() => {
    const heroBtn = heroBtnRef.current;
    if (!heroBtn) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastHeroBtn(!entry.isIntersecting && entry.boundingClientRect.bottom < 80);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(heroBtn);
    return () => observer.disconnect();
  }, []);

  const showNavButton = isPastHeroBtn && !isFooterBtnVisible;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "stride-dark" : "stride-light");

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "stride-dark" : "stride-light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div
        data-theme={theme}
        className="bg-base-100 text-base-content overflow-x-hidden selection:bg-primary selection:text-primary-content font-sans relative"
      >
        <style>{`
          .dot-grid {
            background-image: radial-gradient(circle at center, currentColor 1px, transparent 1px);
            background-size: 24px 24px;
          }
          
          @keyframes float-1 {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -20px, 0) rotate(10deg); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -30px, 0) rotate(-15deg); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(0, -15px, 0) scale(1.05); }
          }
          @keyframes floatGlow {
            0%, 100% { transform: translate3d(-50%, -50%, 0) scale(1); opacity: 0.5; }
            50% { transform: translate3d(-50%, -55%, 0) scale(1.1); opacity: 0.8; }
          }
          .animate-float-1, .animate-float-2, .animate-float-3, .animate-float-glow { 
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform; 
          }
          .animate-float-1 { animation-name: float-1; animation-duration: 6s; }
          .animate-float-2 { animation-name: float-2; animation-duration: 8s; }
          .animate-float-3 { animation-name: float-3; animation-duration: 7s; }
          .animate-float-glow { animation-name: floatGlow; animation-duration: 8s; }
        `}</style>

        <div className="fixed inset-0 pointer-events-none dot-grid opacity-[0.03] dark:opacity-[0.06] z-0" />

        <nav
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 will-change-transform ${
            isPastHeroBtn
              ? "bg-base-100/80 backdrop-blur-md border-b border-base-content/10 shadow-sm py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
          className="w-20 md:w-24 h-5 md:h-6 bg-base-content transition-colors ml-1 md:ml-0"
          style={{
            WebkitMaskImage: `url(${import.meta.env.BASE_URL}/stride.svg)`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'left center',
            maskImage: `url(${import.meta.env.BASE_URL}/stride.svg)`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'left center',
          }}
          title="Stride"
        />
            </div>

            <button
              onClick={onFinish}
              className={`btn btn-primary btn-sm rounded-full px-5 shadow-md shadow-primary/20 transition-all duration-300 origin-right ${
                showNavButton
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-90 pointer-events-none"
              }`}
            >
              Open Stride
            </button>
          </div>
        </nav>

        <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 pt-24 text-center z-10">
          <div className="absolute top-1/2 left-1/2 w-125 h-125 bg-primary/20 rounded-full blur-[120px] -z-10 animate-float-glow transform-gpu" />

          <FadeSection className="max-w-3xl mx-auto space-y-6 z-10 shrink-0">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
              Master the Semester. <br />
              <span className="text-base-content/40">Forget the Chaos.</span>
            </h1>
            <p className="text-lg md:text-xl text-base-content/60 max-w-xl mx-auto font-medium">
              Your lightning-fast, local-first academic command center. Everything
              from quick thoughts to final exams, beautifully organized.
            </p>

            <div className="pt-2" ref={heroBtnRef}>
              <button
                onClick={onFinish}
                className="btn btn-primary rounded-full px-8 font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform transform-gpu"
              >
                Open Stride
              </button>
            </div>
          </FadeSection>

          <FadeSection
            delay={0.2}
            className="mt-8 w-full max-w-4xl flex-1 perspective-1000 flex items-start justify-center relative origin-bottom overflow-visible"
          >
            <div className="absolute top-[10%] -left-[5%] text-primary/30 animate-float-1 z-0 hidden md:block">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="50" />
              </svg>
            </div>
            <div className="absolute top-[20%] -right-[5%] text-secondary/30 animate-float-2 z-0 hidden md:block">
              <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor" className="rounded-xl">
                <rect width="100" height="100" rx="20" />
              </svg>
            </div>

            <img
              src={`${import.meta.env.BASE_URL}/desktop-mockup.webp`}
              alt="Stride App Desktop View"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto max-w-3xl rounded-2xl shadow-2xl transform rotate-x-6 scale-100 origin-bottom hover:rotate-x-0 transition-transform duration-700 ease-out z-10 will-change-transform transform-gpu"
            />
          </FadeSection>
        </section>

        <div className="relative z-10 space-y-24 py-24">
          <section className="px-6 md:px-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-col-reverse md:flex-row-reverse">
              <FadeSection>
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error mb-5 border border-error/20 shadow-inner">
                  <Target size={20} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Silence the noise.
                </h2>
                <p className="text-base md:text-lg text-base-content/60 leading-relaxed">
                  Don't stare at a list of 50 tasks. Drag your top priorities into
                  the <strong className="text-base-content">Focus Zone</strong>.
                  Commit to your 'Daily 3' and let the rest of the world wait
                  until tomorrow.
                </p>
              </FadeSection>

              <FadeSection delay={0.2}>
                <div className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-base-content/10 grid grid-cols-1 gap-3 hover:-translate-y-1 transition-transform duration-500 will-change-transform transform-gpu">
                  <div className="bg-base-100 p-3 rounded-lg border border-error/30 shadow-sm flex justify-between items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
                    <div className="space-y-1 pl-2">
                      <div className="badge badge-error badge-xs p-1.5 text-[9px] font-bold uppercase">
                        Priority
                      </div>
                      <div className="font-bold text-sm">
                        Finish Physics Lab Report
                      </div>
                    </div>
                  </div>
                  <div className="h-12 rounded-lg border-2 border-dashed border-base-content/20 flex items-center justify-center text-xs text-base-content/40 font-medium bg-base-100/30">
                    Empty Slot
                  </div>
                  <div className="h-12 rounded-lg border-2 border-dashed border-base-content/20 flex items-center justify-center text-xs text-base-content/40 font-medium bg-base-100/30">
                    Empty Slot
                  </div>
                </div>
              </FadeSection>
            </div>
          </section>

          <section className="px-6 md:px-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <FadeSection>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 border border-primary/20 shadow-inner">
                  <Zap size={20} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Capture instantly. Sort later.
                </h2>
                <p className="text-base md:text-lg text-base-content/60 leading-relaxed">
                  Don't let a sudden idea or a new assignment slip away. Toss
                  everything into the{" "}
                  <strong className="text-base-content">Brain Dump</strong> the
                  second you think of it, and organize it into actionable tasks
                  when you have the time.
                </p>
              </FadeSection>

              <FadeSection delay={0.2}>
                <div className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-base-content/10 space-y-4 hover:-translate-y-1 transition-transform duration-500 will-change-transform transform-gpu">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-base-100 shadow-inner border border-base-content/10">
                    <span className="w-1.5 h-5 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-sm text-base-content/60 font-mono">
                      Read chapter 4 for biology...
                    </span>
                  </div>

                  <div className="flex justify-center opacity-40 py-1">
                    <ArrowRight size={20} className="rotate-90 text-base-content" />
                  </div>

                  <div className="p-4 rounded-xl bg-base-100 shadow-sm border border-base-content/10 flex items-start gap-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                      <Brain size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">
                        Read chapter 4 for biology
                      </h4>
                      <p className="text-xs text-base-content/50 mt-1">
                        Saved to Brain Dump • Needs categorization
                      </p>
                    </div>
                  </div>
                </div>
              </FadeSection>
            </div>
          </section>

<section className="px-6 md:px-12 max-w-5xl mx-auto">
            <FadeSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                See the horizon.
              </h2>
              <p className="text-base md:text-lg text-base-content/60 max-w-2xl mx-auto">
                From today's checkboxes to next month's midterms. Keep a
                bird's-eye view of your deadlines, and securely archive your wins
                to keep a clear mind.
              </p>
            </FadeSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FadeSection delay={0.1}>
                <div className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-base-content/10 h-full flex flex-col items-center text-center hover:bg-base-200 transition-colors duration-300 transform-gpu">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <Calendar className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Visual Timeline</h3>
                  <p className="text-sm text-base-content/60">
                    Pills and countdowns glowing green for safe, red for urgent.
                    Never be surprised by an exam again.
                  </p>
                </div>
              </FadeSection>

              <FadeSection delay={0.2}>
                <div className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-base-content/10 h-full flex flex-col items-center text-center hover:bg-base-200 transition-colors duration-300 transform-gpu">
                  <div className="p-3 bg-success/10 rounded-full mb-4">
                    <CheckCircle className="text-success w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">The Archive</h3>
                  <p className="text-sm text-base-content/60">
                    Completed tasks don't just vanish. They move to the Archive,
                    keeping your active workspace clutter-free.
                  </p>
                </div>
              </FadeSection>
            </div>
          </section>
        </div>

        <section className="min-h-dvh flex flex-col justify-center px-6 relative overflow-hidden bg-base-200/80 backdrop-blur-md border-t border-base-content/10 z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/10 rounded-full blur-[120px] pointer-events-none transform-gpu will-change-transform" />

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10 py-20">
            <FadeSection className="relative w-full aspect-square md:aspect-4/3 flex items-center justify-center perspective-1000">
              <div className="absolute -top-[5%] -left-[5%] text-primary/30 animate-float-1 z-0">
                <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="50" />
                </svg>
              </div>
              <div className="absolute top-[15%] -right-[10%] text-secondary/30 animate-float-2 z-0">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor" className="rounded-2xl">
                  <rect width="100" height="100" rx="20" />
                </svg>
              </div>
              <div className="absolute bottom-[5%] -left-[10%] text-accent/30 animate-float-3 z-30">
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="16">
                  <circle cx="50" cy="50" r="42" />
                </svg>
              </div>
              <div className="absolute -bottom-[10%] right-[10%] text-primary/20 animate-float-1 z-0" style={{ animationDelay: "1.5s" }}>
                <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
                  <polygon points="50,5 95,95 5,95" strokeLinejoin="round" />
                </svg>
              </div>

              <img
                src={`${import.meta.env.BASE_URL}/desktop-mockup.webp`}
                alt="Stride Desktop Workspace"
                loading="lazy"
                decoding="async"
                className="absolute right-4 lg:right-0 top-1/4 w-4/5 h-auto rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10 will-change-transform transform-gpu"
              />

              <img
                src={`${import.meta.env.BASE_URL}/mobile-mockup.webp`}
                alt="Stride Mobile Workspace"
                loading="lazy"
                decoding="async"
                className="absolute left-4 lg:left-0 bottom-1/4 w-[35%] h-auto shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 z-20 will-change-transform transform-gpu"
              />
            </FadeSection>

            <FadeSection delay={0.2} className="text-center lg:text-left space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2 border border-primary/20">
                Setup Complete
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-base-content leading-tight">
                Your workspace is ready.
              </h2>
              <p className="text-lg text-base-content/60 max-w-lg mx-auto lg:mx-0">
                Dive into Stride to begin setting up your subjects, map out upcoming deadlines, and focus on what matters today.
              </p>

              <div className="pt-6" ref={footerBtnRef}>
                <button
                  onClick={onFinish}
                  className="btn btn-primary btn-lg rounded-full px-10 font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform w-full sm:w-auto transform-gpu"
                >
                  Go to Dashboard
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </FadeSection>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}