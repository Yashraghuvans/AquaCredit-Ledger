import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { submissions as allSubmissions, users, blockchainLogs } from "@/data/mockData";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiXCircle, 
  FiClock, 
  FiHash,
  FiCpu,
  FiEdit,
  FiX
} from "react-icons/fi";

// --- Drone Feature Components & Data ---

// Dummy Data for the Drone List
const dummyDrones = [
  { id: 'AQ-DR-01', name: 'AquaMapper Pro', status: 'Online', specs: { range: '5 km', flightTime: '45 mins', camera: '4K Multispectral', payload: '2 kg' } },
  { id: 'AQ-DR-02', name: 'Coastal Scout', status: 'Online', specs: { range: '3 km', flightTime: '30 mins', camera: '1080p HD', payload: '1 kg' } },
  { id: 'AQ-DR-03', name: 'Delta Wing X', status: 'Charging', specs: { range: '10 km', flightTime: '90 mins', camera: 'Thermal + RGB', payload: '5 kg' } },
  { id: 'AQ-DR-04', name: 'Coastal Scout', status: 'Maintenance', specs: { range: '3 km', flightTime: '30 mins', camera: '1080p HD', payload: '1 kg' } },
];

const DroneDetailsModal = ({ drone, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg">
      <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full text-muted-foreground hover:bg-accent">
        <FiX />
      </button>
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><FiCpu size={24}/></div>
        <div>
          <h3 className="text-lg font-semibold">{drone.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {drone.id}</p>
        </div>
      </div>
      <div className="mt-6 space-y-2 border-t pt-4">
        <h4 className="text-sm font-medium text-muted-foreground">Specifications</h4>
        <div className="text-sm"><strong>Range:</strong> {drone.specs.range}</div>
        <div className="text-sm"><strong>Max Flight Time:</strong> {drone.specs.flightTime}</div>
        <div className="text-sm"><strong>Camera:</strong> {drone.specs.camera}</div>
        <div className="text-sm"><strong>Payload Capacity:</strong> {drone.specs.payload}</div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="h-9 rounded-md border px-4 text-sm">Close</button>
      </div>
    </div>
  </div>
);

const DeviceList = () => {
  const [viewingDrone, setViewingDrone] = useState(null);

  return (
    <>
      {viewingDrone && <DroneDetailsModal drone={viewingDrone} onClose={() => setViewingDrone(null)} />}
      <div className="rounded-xl border bg-card p-5 h-full">
        <h2 className="font-semibold mb-4">Drone Fleet Status</h2>
        <div className="space-y-3">
          {dummyDrones.map(drone => (
            <div key={drone.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
              <div>
                <p className="font-medium text-sm">{drone.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${drone.status === 'Online' ? 'bg-emerald-500' : drone.status === 'Charging' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                  <p className="text-xs text-muted-foreground">{drone.status}</p>
                </div>
              </div>
              <button onClick={() => setViewingDrone(drone)} className="h-8 w-8 grid place-items-center rounded-md border text-muted-foreground hover:bg-background">
                <FiEdit size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


// --- Main Page Component ---

export default function Index() {
  const { currentUser } = useAuth();

  const visibleSubmissions = allSubmissions.filter((s) => {
    if (currentUser.role === "super-admin") return true;
    if (currentUser.role === "admin") return s.adminId === currentUser.id;
    return s.submittedBy === currentUser.id;
  });

  const statusCounts = ["Verified", "Pending", "Rejected"].map((status) => ({
    status,
    count: visibleSubmissions.filter((s) => s.status === (status as any)).length,
  }));
  
  // Line chart data: submissions per day (visible scope)
  const perDayMap = new Map<string, number>();
  visibleSubmissions.forEach((s) => {
    const d = s.date; // YYYY-MM-DD
    perDayMap.set(d, (perDayMap.get(d) || 0) + 1);
  });
  const lineSeries = Array.from(perDayMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  const teamManagers = users.filter((u) => u.role === "manager" && (currentUser.role === "super-admin" || u.adminId === currentUser.id));

  const pieColors = ["#10b981", "#f59e0b", "#ef4444"]; // emerald/amber/rose

  // Notifications summary
  const pendingCount = statusCounts.find(s=>s.status==="Pending")?.count ?? 0;
  const verifiedCount = statusCounts.find(s=>s.status==="Verified")?.count ?? 0;
  const rejectedCount = statusCounts.find(s=>s.status==="Rejected")?.count ?? 0;
  const notifications: { type: "success"|"warning"|"error"|"info"; title: string; desc: string; }[] = [];
  if (pendingCount > 0) notifications.push({ type: "warning", title: `${pendingCount} pending review`, desc: "Review queue updated" });
  if (verifiedCount > 0) notifications.push({ type: "success", title: `${verifiedCount} verified`, desc: "Credits ready to mint" });
  if (rejectedCount > 0) notifications.push({ type: "error", title: `${rejectedCount} rejected`, desc: "Follow-up required" });
  if (notifications.length === 0) notifications.push({ type: "info", title: "All caught up", desc: "No new notifications" });

  const recentLogs = (currentUser.role === "manager" ? blockchainLogs.filter(l=>l.user===currentUser.name) : blockchainLogs).slice(0,6);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-3xl font-semibold mt-1">{visibleSubmissions.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Verified</p>
            <p className="text-3xl font-semibold mt-1">{visibleSubmissions.filter(s=>s.status==="Verified").length}</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-semibold mt-1">{visibleSubmissions.filter(s=>s.status==="Pending").length}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card p-5 xl:col-span-2">
            <h2 className="font-semibold mb-4">Submission Status (Bar)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusCounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip wrapperClassName="rounded-md border bg-card p-2 shadow-lg" />
                  <Legend />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-4">Status Distribution (Pie)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip wrapperClassName="rounded-md border bg-card p-2 shadow-lg" />
                  <Legend />
                  <Pie data={statusCounts} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {statusCounts.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border bg-card p-5 lg:col-span-2">
            <h2 className="font-semibold mb-4">Submissions Over Time (Line)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip wrapperClassName="rounded-md border bg-card p-2 shadow-lg" />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-4">Team Snapshot</h2>
            {currentUser.role === "manager" ? (
              <p className="text-sm text-muted-foreground">You are part of team {currentUser.teamId}</p>
            ) : (
              <ul className="space-y-3">
                {teamManagers.map((m) => (
                  <li key={m.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">Team {m.teamId}</p>
                    </div>
                    <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                      {allSubmissions.filter((s) => s.submittedBy === m.id).length} submissions
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* --- Drone Component Added Here --- */}
          <DeviceList />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card p-5 lg:col-span-2">
            <h2 className="font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-3">
              {recentLogs.map((l) => (
                <li key={l.id} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FiClock />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{l.activity}</span>
                      <span className="text-xs text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <FiHash /> <span className="font-mono">{l.hash}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-4">Notifications</h2>
            <ul className="space-y-3">
              {notifications.map((n, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {n.type === "success" && (
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><FiCheckCircle /></span>
                  )}
                  {n.type === "warning" && (
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><FiAlertTriangle /></span>
                  )}
                  {n.type === "error" && (
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"><FiXCircle /></span>
                  )}
                  {n.type === "info" && (
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"><FiClock /></span>
                  )}
                  <div>
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Recent Submissions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4">Location</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {visibleSubmissions.slice(0, 8).map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="py-2 pr-4 font-medium">{s.projectId}</td>
                    <td className="py-2 pr-4">{s.location}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        s.status === "Verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        s.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{new Date(s.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Blockchain Logbook</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Hash</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Activity</th>
                  <th className="py-2 pr-4">Credits</th>
                  <th className="py-2 pr-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {(currentUser.role === "manager" ? blockchainLogs.filter(l=>l.user===currentUser.name) : blockchainLogs).slice(0,8).map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="py-2 pr-4 font-mono text-xs">{l.hash}</td>
                    <td className="py-2 pr-4">{l.user}</td>
                    <td className="py-2 pr-4">{l.activity}</td>
                    <td className="py-2 pr-4">{l.creditsMinted}</td>
                    <td className="py-2 pr-4">{new Date(l.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}