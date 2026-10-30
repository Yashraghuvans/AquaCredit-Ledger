import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiAward,
  FiBarChart2,
  FiCamera,
  FiCheckSquare,
  FiLogIn,
  FiPlay,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import HeroVisual from "@/components/marketing/HeroVisual";
import InteractiveDemoModal from "@/components/marketing/InteractiveDemoModal";
import Reveal from "@/components/marketing/Reveal";
import { easeOut, fadeUp, staggerContainer } from "@/lib/motion";

const workflow = [
  {
    step: "01",
    icon: FiLogIn,
    title: "Secure login",
    copy: "Field teams authenticate on mobile with role-based access.",
  },
  {
    step: "02",
    icon: FiCamera,
    title: "Capture proof",
    copy: "Geo-tagged media is hashed and anchored for integrity.",
  },
  {
    step: "03",
    icon: FiCheckSquare,
    title: "Verify on dashboard",
    copy: "Regulators review submissions against on-chain records.",
  },
  {
    step: "04",
    icon: FiAward,
    title: "Mint credits",
    copy: "Smart contracts issue AQC tokens to project wallets.",
  },
];

const features = [
  {
    icon: FiCheckSquare,
    title: "Seamless verification",
    copy: "Review evidence, approve milestones, and publish outcomes in one queue.",
  },
  {
    icon: FiUsers,
    title: "Granular access control",
    copy: "Separate permissions for super admins, admins, and field managers.",
  },
  {
    icon: FiBarChart2,
    title: "Actionable analytics",
    copy: "Track credits, submissions, and blockchain activity in real time.",
  },
  {
    icon: FiShield,
    title: "Audit-ready ledger",
    copy: "Every decision leaves a transparent, tamper-evident trail.",
  },
];

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 aqua-mesh" aria-hidden />
        <div className="pointer-events-none absolute inset-0 aqua-grid opacity-[0.35]" aria-hidden />

        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-sm">
                A
              </div>
              <span className="truncate font-semibold tracking-tight">AquaCredit Ledger</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hidden h-9 items-center gap-2 rounded-lg border bg-card/80 px-3 text-sm font-medium transition-colors hover:bg-accent sm:inline-flex"
              >
                <FiPlay className="h-4 w-4" /> Demo
              </button>
              <Link
                to="/login"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main>
          <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                Blue carbon registry · On-chain MRV
              </motion.p>
              <motion.h1
                variants={fadeUp}
                custom={0.05}
                className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
              >
                The command center for{" "}
                <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  verifiable
                </span>{" "}
                coastal restoration.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={0.1}
                className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg lg:mx-0"
              >
                Review field submissions, validate proofs, and oversee credit issuance with a
                dashboard built for regulators, NGOs, and program administrators.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={0.15}
                className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
              >
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90"
                >
                  Get started
                </Link>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-card/80 px-6 text-sm font-semibold backdrop-blur transition hover:bg-accent"
                >
                  <FiPlay className="h-4 w-4" /> Interactive demo
                </button>
              </motion.div>
              <motion.dl
                variants={fadeUp}
                custom={0.2}
                className="mt-10 grid grid-cols-3 gap-3 border-t pt-8 sm:gap-6"
              >
                {[
                  { label: "Credits tracked", value: "147K+" },
                  { label: "Active projects", value: "42" },
                  { label: "Proof integrity", value: "99.9%" },
                ].map((item) => (
                  <div key={item.label} className="text-left">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: easeOut }}
              className="lg:justify-self-end"
            >
              <HeroVisual />
            </motion.div>
          </section>

          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-10 lg:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Workflow at a glance
                </h2>
                <p className="mt-3 text-muted-foreground">
                  From mangrove planting in the field to tradable credits on the ledger—four
                  connected steps.
                </p>
              </div>
              <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                <div
                  className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
                  aria-hidden
                />
                {workflow.map((item, index) => (
                  <li
                    key={item.title}
                    className="relative flex flex-col rounded-2xl border bg-background/80 p-5 text-left shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.copy}
                    </p>
                    {index < workflow.length - 1 && (
                      <div
                        className="absolute -bottom-3 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-border lg:hidden"
                        aria-hidden
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for oversight teams
              </h2>
              <p className="mt-3 text-muted-foreground">
                High-signal tools with calm visuals—aligned grids, readable type, and layouts that
                scale from phone to ultrawide.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 0.05}>
                  <article className="flex h-full flex-col rounded-2xl border bg-card/80 p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md">
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.copy}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/90 via-primary to-cyan-700 px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="max-w-xl">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                      Ready to explore the admin console?
                    </h2>
                    <p className="mt-2 text-sm text-primary-foreground/85 sm:text-base">
                      Use demo profiles to walk through verification, user management, and
                      blockchain logs.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Link
                      to="/login"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-primary transition hover:bg-white/90"
                    >
                      Open login
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold backdrop-blur transition hover:bg-white/15"
                    >
                      Watch demo
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="border-t border-border/70">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} AquaCredit Ledger. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="#" className="transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link to="#" className="transition-colors hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {isModalOpen && <InteractiveDemoModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
