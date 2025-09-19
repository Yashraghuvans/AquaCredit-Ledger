import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiUser, 
  FiShield, 
  FiBriefcase, 
  FiArrowRight, 
  FiHelpCircle, 
  FiChevronLeft,
  FiAward,
  FiUsers
} from "react-icons/fi";

// Custom hook for the count-up animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easedPercentage = 1 - Math.pow(1 - percentage, 3); // Ease-out effect
      
      setCount(Math.floor(easedPercentage * end));

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// Define the type for the role based on your data's format
type Role = 'super-admin' | 'admin' | 'manager';

// Helper function to provide display details based on role
const getRoleDetails = (role: Role) => {
  switch (role) {
    case 'super-admin':
      return {
        displayName: 'Super Admin',
        icon: <FiShield className="h-4 w-4" />,
        badgeClasses: "bg-destructive/10 text-destructive border-destructive/20",
      };
    case 'admin':
      return {
        displayName: 'Admin',
        icon: <FiUser className="h-4 w-4" />,
        badgeClasses: "bg-primary/10 text-primary border-primary/20",
      };
    case 'manager':
      return {
        displayName: 'Manager',
        icon: <FiBriefcase className="h-4 w-4" />,
        badgeClasses: "bg-accent-foreground/10 text-accent-foreground border-accent-foreground/20",
      };
    default:
       return {
        displayName: 'Unknown',
        icon: <FiHelpCircle className="h-4 w-4" />,
        badgeClasses: "bg-muted text-muted-foreground border",
      }
  }
};


export default function Login() {
  const { loginAs, users } = useAuth();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>(users[0].id);
  const selectedUser = users.find(u => u.id === selectedId)!;
  
  // Animated stats for the left panel
  const animatedCredits = useCountUp(147320);
  const animatedUsers = useCountUp(89);

  const handleSubmit = () => {
    loginAs(selectedId);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Branding, Stats & Info */}
      <div className="hidden lg:flex flex-col justify-between p-8 md:p-12 text-slate-900 bg-sky-100 relative">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">A</div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">AquaCredit Ledger</span>
          </Link>
        </div>

        {/* Animated Stats */}
        <div className="relative z-10 my-12 space-y-8">
            <h1 className="text-4xl font-bold leading-tight text-slate-900">
                The Operating System for Verifiable Blue Carbon.
            </h1>
            <div className="flex gap-8">
                <div className="border-l-4 border-primary pl-4">
                    <p className="text-sm text-slate-600">Total Credits Generated</p>
                    <p className="text-3xl font-bold text-slate-900">{animatedCredits.toLocaleString()}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                    <p className="text-sm text-slate-600">Active Users</p>
                    <p className="text-3xl font-bold text-slate-900">{animatedUsers.toLocaleString()}</p>
                </div>
            </div>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg text-slate-700">
              “This platform has brought unprecedented transparency and efficiency to our coastal restoration projects. It's a game-changer for environmental accountability.”
            </p>
            <footer className="text-sm text-slate-500">Environmental NGO Partner</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Right Column: Login Form */}
      <div className="flex items-center justify-center p-6 md:p-12 relative bg-sky-50">
        <Link
          to="/"
          aria-label="Back to landing page"
          className="absolute top-6 left-6 grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-black/5"
        >
          <FiChevronLeft className="h-6 w-6" />
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Select a Profile</h1>
              <p className="text-sm text-muted-foreground mt-2">Choose a demo account to access the dashboard.</p>
          </div>

          <div className="max-h-[450px] overflow-y-auto space-y-3 pr-3">
            {users.map((user) => {
              const { icon, badgeClasses, displayName } = getRoleDetails(user.role as Role);
              const isSelected = user.id === selectedId;
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedId(user.id)}
                  className={`w-full flex items-center gap-4 text-left p-4 rounded-lg border-2 transition-all duration-200 
                    ${isSelected
                      ? 'bg-white border-primary shadow-md' 
                      : 'bg-white/50 border-border hover:border-muted-foreground/50 hover:bg-white'
                    }`}
                >
                  <div className="flex-shrink-0 grid h-12 w-12 place-items-center rounded-full bg-slate-100 border border-border">
                    <span className="text-xl font-semibold text-foreground">{user.name.charAt(0)}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClasses}`}>
                    {icon}
                    <span>{displayName}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            className="group mt-8 h-12 w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <span>Continue as {selectedUser.name}</span>
            <FiArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            This is a mock login for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

