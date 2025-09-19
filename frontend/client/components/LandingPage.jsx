import { Link } from "react-router-dom";
import { 
  FiShield, 
  FiSearch, 
  FiHexagon, 
  FiSmartphone, 
  FiMonitor, 
  FiLayers 
} from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-black">A</div>
            <span className="text-base font-semibold tracking-tight">AquaCredit Ledger</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1590683054069-802d291901a8?q=80&w=1920&auto=format&fit=crop)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/40 to-background" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Verifiable Trust for Blue Carbon Projects.
            </h1>
            <p className="mt-5 text-lg text-white/90">
              AquaCredit Ledger replaces slow, paper-based verification with an immutable blockchain ledger. We bring transparency and efficiency to coastal ecosystem restoration, ensuring every carbon credit is authentic and impactful.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/90"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-md border border-white/40 bg-transparent px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">A New Standard for Environmental Integrity</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built for regulators, investors, and NGOs to eliminate fraud, double-counting, and opacity in blue carbon markets.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FiShield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">Immutable Proof</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every action, from planting to growth verification, is permanently recorded on the blockchain, eliminating fraud and double-counting.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FiSearch className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">Transparent MRV</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our dashboard provides regulators and investors with a real-time, transparent view into project progress and data authenticity.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FiHexagon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">Automated Credit Generation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Verified project milestones automatically trigger the minting of secure, tradable carbon credits directly to community wallets.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <header className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Simple steps from field data to verifiable, tokenized blue carbon credits.
            </p>
          </header>

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <li className="relative rounded-xl border bg-card p-6">
              <span className="absolute -top-3 left-4 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiSmartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">Data Submission</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Field teams upload geo-tagged photos and data via a simple mobile app.
              </p>
            </li>

            <li className="relative rounded-xl border bg-card p-6">
              <span className="absolute -top-3 left-4 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiMonitor className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">Admin Verification</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Governing bodies review and verify the immutable data on the admin dashboard.
              </p>
            </li>

            <li className="relative rounded-xl border bg-card p-6">
              <span className="absolute -top-3 left-4 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiLayers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">Credit Minting</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Verified data triggers a smart contract to mint AQC tokens to the project's digital wallet.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© 2025 AquaCredit Ledger. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
