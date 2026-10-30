import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiUser,
  FiShield,
  FiBriefcase,
  FiArrowRight,
  FiHelpCircle,
  FiChevronLeft,
} from "react-icons/fi";
import { easeOut } from "@/lib/motion";

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easedPercentage = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easedPercentage * end));
      if (progress < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

type Role = "super-admin" | "admin" | "manager";

const getRoleDetails = (role: Role) => {
  switch (role) {
    case "super-admin":
      return {
        displayName: "Super Admin",
        icon: <FiShield className="h-4 w-4" />,
        badgeClasses: "bg-destructive/10 text-destructive border-destructive/20",
      };
    case "admin":
      return {
        displayName: "Admin",
        icon: <FiUser className="h-4 w-4" />,
        badgeClasses: "bg-primary/10 text-primary border-primary/20",
      };
    case "manager":
      return {
        displayName: "Manager",
        icon: <FiBriefcase className="h-4 w-4" />,
        badgeClasses: "bg-accent-foreground/10 text-accent-foreground border-accent-foreground/20",
      };
    default:
      return {
        displayName: "Unknown",
        icon: <FiHelpCircle className="h-4 w-4" />,
        badgeClasses: "bg-muted text-muted-foreground border",
      };
  }
};

export default function Login() {
  const { loginAs, users } = useAuth();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>(users[0].id);
  const selectedUser = users.find((u) => u.id === selectedId)!;
  const reduceMotion = useReducedMotion();

  const animatedCredits = useCountUp(147320);
  const animatedUsers = useCountUp(89);

  const handleSubmit = () => {
    loginAs(selectedId);
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 aqua-mesh" aria-hidden />
      <div className="pointer-events-none absolute inset-0 aqua-grid opacity-25" aria-hidden />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative flex flex-col justify-between border-b border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              A
            </div>
            <span className="text-lg font-semibold tracking-tight">AquaCredit Ledger</span>
          </Link>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="my-10 space-y-8 lg:my-12"
          >
            <h1 className="max-w-lg text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              The operating system for verifiable blue carbon.
            </h1>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Credits generated
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {animatedCredits.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Active users
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {animatedUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <blockquote className="hidden max-w-md text-sm leading-relaxed text-muted-foreground lg:block">
            <p>
              “This platform has brought unprecedented transparency to our coastal restoration
              programs.”
            </p>
            <footer className="mt-2 text-xs">Environmental NGO Partner</footer>
          </blockquote>
        </div>

        <div className="relative flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <Link
            to="/"
            aria-label="Back to landing page"
            className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-accent sm:left-6 sm:top-6"
          >
            <FiChevronLeft className="h-5 w-5" />
          </Link>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: easeOut }}
            className="w-full max-w-md"
          >
            <div className="mb-6 text-center sm:mb-8">
              <h2 className="text-2xl font-bold sm:text-3xl">Select a profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a demo account to access the dashboard.
              </p>
            </div>

            <div className="max-h-[min(52vh,420px)] space-y-3 overflow-y-auto pr-1">
              {users.map((user) => {
                const { icon, badgeClasses, displayName } = getRoleDetails(user.role as Role);
                const isSelected = user.id === selectedId;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedId(user.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 sm:gap-4 sm:p-4 ${
                      isSelected
                        ? "border-primary bg-card shadow-md shadow-primary/10"
                        : "border-border/80 bg-card/70 hover:border-muted-foreground/40 hover:bg-card"
                    }`}
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border bg-muted/60 text-base font-semibold sm:h-12 sm:w-12">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div
                      className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:flex ${badgeClasses}`}
                    >
                      {icon}
                      <span>{displayName}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:mt-8"
            >
              <span>Continue as {selectedUser.name}</span>
              <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Mock login for demonstration purposes only.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
