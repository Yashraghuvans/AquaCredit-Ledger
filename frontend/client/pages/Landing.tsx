import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  FiAward,
  FiBarChart2, 
  FiCamera, 
  FiCheckSquare, 
  FiClock,
  FiGift,
  FiKey,
  FiLogIn, 
  FiMapPin,
  FiMonitor,
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiShield,
  FiSmartphone,
  FiUploadCloud,
  FiUsers, 
  FiX, 
} from "react-icons/fi";



const Step1Visual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-64 h-full max-h-[400px] rounded-2xl border bg-card p-4 shadow-lg flex flex-col gap-4">
      <div className="text-center">
        <h4 className="font-bold">Welcome Back</h4>
        <p className="text-xs text-muted-foreground">Login to your account</p>
      </div>
      <div className="h-10 w-full rounded-md bg-muted"></div>
      <div className="h-10 w-full rounded-md bg-muted"></div>
      <div className="h-10 w-full rounded-md bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"><FiKey/> Login</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><FiShield/> Your connection is secure.</div>
    </div>
  </div>
);

const Step2Visual = () => (
  <div className="w-full h-full flex items-center justify-center">
     <div className="w-64 h-full max-h-[400px] rounded-2xl border bg-card p-4 shadow-lg flex flex-col gap-4">
        <div className="h-32 w-full rounded-lg bg-muted bg-[url('https://images.unsplash.com/photo-1590683054069-802d291901a8?q=10&w=100')] bg-cover bg-center"></div>
        <div className="flex items-center gap-2 text-sm"><FiMapPin className="text-primary"/> <span>12.345, -67.890</span></div>
        <div className="flex items-center gap-2 text-sm"><FiClock className="text-primary"/> <span>{new Date().toLocaleString()}</span></div>
        <div className="h-10 w-full rounded-md bg-muted"></div>
        <div className="flex-grow"></div>
        <div className="h-10 w-full rounded-md bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"><FiUploadCloud/> Submit Proof</div>
    </div>
  </div>
);

const Step3Visual = () => (
  <div className="w-full h-full p-4 rounded-xl border bg-card shadow-lg flex flex-col gap-4">
    <h4 className="font-bold text-lg">Pending Submissions</h4>
    <div className="flex gap-4 p-3 rounded-lg border bg-accent items-center">
      <div className="w-24 h-16 rounded-md bg-muted bg-[url('https://images.unsplash.com/photo-1590683054069-802d291901a8?q=10&w=100')] bg-cover bg-center"></div>
      <div className="flex-grow space-y-1">
        <div className="h-4 w-3/4 rounded bg-muted"></div>
        <div className="h-3 w-1/2 rounded bg-muted"></div>
      </div>
      <div className="h-8 w-24 rounded-md bg-primary/80 text-primary-foreground text-sm flex items-center justify-center gap-2"><FiCheckSquare /> Verify</div>
    </div>
    <div className="flex gap-4 p-3 rounded-lg border bg-card items-center opacity-50">
      <div className="w-24 h-16 rounded-md bg-muted"></div>
      <div className="flex-grow space-y-1">
        <div className="h-4 w-3/4 rounded bg-muted"></div>
        <div className="h-3 w-1/2 rounded bg-muted"></div>
      </div>
      <div className="h-8 w-24 rounded-md bg-muted"></div>
    </div>
  </div>
);

const Step4Visual = () => (
  <div className="w-full h-full p-4 rounded-xl border bg-card shadow-lg flex flex-col justify-center items-center text-center gap-4">
    <div className="w-24 h-24 rounded-full bg-primary/10 text-primary grid place-items-center">
      <FiAward size={48} />
    </div>
    <div className="animate-fade-in">
      <p className="text-muted-foreground">Verification Successful</p>
      <h4 className="text-3xl font-bold">50.00 AQC Minted</h4>
      <p className="text-sm text-muted-foreground mt-2">Tokens have been sent to the project wallet.</p>
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 border rounded-full bg-accent"><FiKey/> Transaction secured on-chain.</div>
  </div>
);



const demoSteps = [
  {
    icon: FiSmartphone,
    title: "Secure Mobile Login",
    description: "The workflow begins with field managers and NGO staff accessing the platform through our dedicated, secure mobile application.",
    features: [
      "Role-Based Access Control (RBAC)", 
      "Encrypted user credentials", 
      "Biometric login support"
    ],
    visual: <Step1Visual />,
  },
  {
    icon: FiUploadCloud,
    title: "Immutable Proof Upload",
    description: "Users capture and submit evidence of their work. Each submission is cryptographically hashed and timestamped on-chain.",
    features: [
      "Automatic geo-tagging (GPS)",
      "Tamper-proof data hashing",
      "Direct upload to decentralized storage (IPFS)"
    ],
    visual: <Step2Visual />,
  },
  {
    icon: FiMonitor,
    title: "Admin Verification",
    description: "Regulators and administrators review the submitted proof on the web dashboard, cross-referencing it with the on-chain hash for integrity.",
    features: [
      "Centralized submissions queue",
      "One-click verification trigger",
      "AI-assisted anomaly detection"
    ],
    visual: <Step3Visual />,
  },
  {
    icon: FiGift,
    title: "Automated Credit Minting",
    description: "Upon successful verification, a smart contract automatically mints the corresponding AquaCredit Tokens (AQC) to the project's wallet.",
    features: [
      "Trustless smart contract execution",
      "ERC-20 standard token generation",
      "Transparent and auditable transaction logs"
    ],
    visual: <Step4Visual />,
  },
];

const InteractiveDemoModal = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startDemo = (startFrom = currentStep) => {
    if (intervalId) clearInterval(intervalId);
    
    setIsPlaying(true);
    if (progress === 0) setCurrentStep(startFrom);

    const newInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          setCurrentStep(curr => {
            const nextStep = curr + 1;
            if (nextStep >= demoSteps.length) {
              setIsPlaying(false);
              clearInterval(newInterval);
              return curr;
            }
            return nextStep;
          });
          return 0;
        }
        return newProgress;
      });
    }, 50);
    setIntervalId(newInterval);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetDemo = () => {
    pauseDemo();
    setCurrentStep(0);
    setProgress(0);
  };

  const goToStep = (stepIndex: number) => {
    pauseDemo();
    setCurrentStep(stepIndex);
    setProgress(0);
  };

  useEffect(() => {
    startDemo(0);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentStepData = demoSteps[currentStep];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
    >
      <div 
        className="relative w-full max-w-7xl h-[90vh] flex flex-col rounded-2xl border bg-card shadow-2xl shadow-primary/10 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-black">A</div>
            <h2 className="text-lg font-semibold">AquaCredit Ledger - Interactive Demo</h2>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
          <div className="flex-1 md:w-3/5 h-full flex flex-col bg-accent/50 rounded-xl border">
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b bg-card rounded-t-xl">
               <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-sm text-muted-foreground font-mono">
                {currentStep < 2 ? 'AquaCredit Mobile' : 'AquaCredit Dashboard'}
              </div>
              <div className="w-12"></div>
            </div>
            <div className="flex-grow p-6 flex items-center justify-center">
              <div key={currentStep} className="w-full h-full animate-fade-in">
                {currentStepData.visual}
              </div>
            </div>
          </div>

          <div className="flex-1 md:w-2/5 h-full flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                  <currentStepData.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Step {currentStep + 1} / {demoSteps.length}</p>
                  <h3 className="text-xl font-bold">{currentStepData.title}</h3>
                </div>
              </div>
              <p className="text-muted-foreground">{currentStepData.description}</p>
              <div className="space-y-2">
                {currentStepData.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <FiCheckSquare className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={isPlaying ? pauseDemo : () => startDemo(currentStep)}
                  className="flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium"
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                 <button
                  onClick={resetDemo}
                  className="flex items-center gap-2 h-10 px-4 rounded-md border font-medium"
                >
                  <FiRotateCcw />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-black">A</div>
              <span className="font-semibold tracking-tight">AquaCredit Ledger</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link to="/login" className="inline-flex h-9 items-center justify-center rounded-md bg-primary text-primary-foreground px-4 shadow-sm transition-colors hover:bg-primary/90">
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
              The Command Center for Blue Carbon Integrity.
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-muted-foreground">
              Our intuitive dashboard for regulators and admins to review submissions, verify on-chain data, and oversee the entire AquaCredit ecosystem.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-md bg-primary text-primary-foreground px-6 font-medium shadow-md transition-transform hover:scale-105">
                Get Started
              </Link>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-6 font-medium shadow-sm transition-transform hover:scale-105 hover:bg-accent"
              >
                View Interactive Demo
              </button>
            </div>
          </section>
          
          {/* AT-A-GLANCE FLOW SECTION (RE-ADDED) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-accent/50 rounded-2xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight">The Workflow at a Glance</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">From a photo in the field to a verifiable asset on the ledger in four simple steps.</p>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {/* Dashed line connector for larger screens */}
                <div className="hidden lg:block absolute top-8 left-0 w-full h-px bg-transparent">
                    <div className="h-px w-full border-t-2 border-dashed border-muted"></div>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary bg-card text-primary">
                        <FiLogIn className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">1. Secure Login</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Field managers log in via the secure mobile app.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary bg-card text-primary">
                        <FiCamera className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">2. Upload Proof</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Geo-tagged photos are submitted as proof of work.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary bg-card text-primary">
                        <FiCheckSquare className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">3. Get Verified</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Admins review and verify the submission on the dashboard.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary bg-card text-primary">
                        <FiAward className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">4. Receive Credits</h3>
                    <p className="mt-1 text-sm text-muted-foreground">A smart contract mints tokens to the project's wallet.</p>
                </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
              <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight">Powerful Tools for Complete Oversight</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Everything you need to manage, verify, and analyze blue carbon projects with confidence and clarity.</p>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="rounded-xl border bg-card p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><FiCheckSquare className="h-6 w-6" /></div>
                      <h3 className="mt-4 text-lg font-semibold">Seamless Verification</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Review geo-tagged images and data submissions. Verify immutable proofs with one click.</p>
                  </div>
                  <div className="rounded-xl border bg-card p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><FiUsers className="h-6 w-6" /></div>
                      <h3 className="mt-4 text-lg font-semibold">Granular Access Control</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Manage roles for Super Admins, Admins, and Managers, ensuring secure and appropriate access.</p>
                  </div>
                  <div className="rounded-xl border bg-card p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><FiBarChart2 className="h-6 w-6" /></div>
                      <h3 className="mt-4 text-lg font-semibold">Actionable Analytics</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Track key metrics, monitor project progress, and view transaction logs with integrated charts.</p>
                  </div>
              </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-muted-foreground flex justify-between items-center">
            <p>© {new Date().getFullYear()} AquaCredit Ledger. All rights reserved.</p>
            <div className="flex gap-4">
                <Link to="#" className="hover:text-foreground">Privacy</Link>
                <Link to="#" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </footer>
      </div>

      {isModalOpen && <InteractiveDemoModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}