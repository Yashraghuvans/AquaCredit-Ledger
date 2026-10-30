import { motion, useReducedMotion } from "framer-motion";
import { FiActivity, FiCheckCircle, FiMapPin } from "react-icons/fi";

export default function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/25 via-cyan-400/10 to-transparent blur-2xl"
        aria-hidden
      />
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/60 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-md"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Verification Console</p>
          <div className="h-2 w-10" />
        </div>

        <div className="grid gap-4 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Credits minted", value: "147.3K", tone: "text-primary" },
              { label: "Active projects", value: "42", tone: "text-foreground" },
              { label: "On-chain proofs", value: "98.7%", tone: "text-emerald-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border bg-background/80 p-3 text-left"
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className={`mt-1 text-xl font-semibold tabular-nums ${stat.tone}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-background/70 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Live submission queue</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <FiActivity className="h-3 w-3" /> Synced
              </span>
            </div>
            <div className="space-y-2">
              {[
                { id: "MNG-204", loc: "Sundarbans Delta", status: "Verified" },
                { id: "MNG-198", loc: "Gulf of Kutch", status: "Pending" },
              ].map((row) => (
                <div
                  key={row.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
                >
                  <div className="h-10 w-14 shrink-0 rounded-md bg-gradient-to-br from-teal-700/30 to-cyan-500/20" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{row.id}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <FiMapPin className="h-3 w-3 shrink-0" /> {row.loc}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "Verified"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {row.status === "Verified" && <FiCheckCircle className="h-3 w-3" />}
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-2 hidden rounded-xl border bg-card px-3 py-2 text-xs shadow-lg sm:block"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="font-medium text-foreground">IPFS hash matched</p>
        <p className="text-muted-foreground">0x8f…c2a verified</p>
      </motion.div>
    </div>
  );
}
