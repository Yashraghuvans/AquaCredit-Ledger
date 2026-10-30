import { useState, useEffect } from "react";
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
    <div>
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

export default function InteractiveDemoModal({ onClose }: { onClose: () => void }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-3 sm:p-4"
    >
      <div 
        className="relative flex h-[min(90vh,900px)] w-full max-w-7xl flex-col rounded-2xl border bg-card shadow-2xl shadow-primary/10"
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
              <div key={currentStep} className="h-full w-full animate-in fade-in duration-300">
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
}