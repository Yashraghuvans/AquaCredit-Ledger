import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { submissions as allSubmissions, users, blockchainLogs } from "@/data/mockData";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiClock,
  FiHash,
  // Icons added for Drone Component
  FiCpu,
  FiEdit,
  FiX
} from "react-icons/fi";
import { useState } from "react"; // useState added for Drone Component

// --- Drone Component Code ---
// This section contains the data, modal, and list components for the drone fleet.

// 1. Dummy Data for the Drone List
const dummyDrones = [
  { id: 'AQ-DR-01', name: 'AquaMapper Pro', status: 'Online', specs: { range: '5 km', flightTime: '45 mins', camera: '4K Multispectral', payload: '2 kg' } },
  { id: 'AQ-DR-02', name: 'Coastal Scout', status: 'Online', specs: { range: '3 km', flightTime: '30 mins', camera: '1080p HD', payload: '1 kg' } },
  { id: 'AQ-DR-03', name: 'Delta Wing X', status: 'Charging', specs: { range: '10 km', flightTime: '90 mins', camera: 'Thermal + RGB', payload: '5 kg' } },
  { id: 'AQ-DR-04', name: 'Coastal Scout', status: 'Maintenance', specs: { range: '3 km', flightTime: '30 mins', camera: '1080p HD', payload: '1 kg' } },
];

// 2. Drone Details Modal Component
const DroneDetailsModal = ({ drone, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg animate-in fade-in-0 zoom-in-95">
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div><strong>Range:</strong> {drone.specs.range}</div>
            <div><strong>Flight Time:</strong> {drone.specs.flightTime}</div>
            <div><strong>Camera:</strong> {drone.specs.camera}</div>
            <div><strong>Payload:</strong> {drone.specs.payload}</div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="h-9 rounded-md border px-4 text-sm">Close</button>
      </div>
    </div>
  </div>
);

// 3. Drone Fleet List Component (with improved design)
const DeviceList = () => {
  const [viewingDrone, setViewingDrone] = useState(null);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Charging':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
    }
  };

  return (
    <>
      {viewingDrone && <DroneDetailsModal drone={viewingDrone} onClose={() => setViewingDrone(null)} />}
      <div className="rounded-xl border bg-card p-5 h-full">
        <h2 className="font-semibold mb-4">Drone Fleet Status</h2>
        <div className="space-y-2">
          {dummyDrones.map(drone => (
            <div key={drone.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                    <FiCpu size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{drone.name}</p>
                  <p className="text-xs text-muted-foreground">{drone.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className={`hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(drone.status)}`}>
                    {drone.status}
                </span>
                <button onClick={() => setViewingDrone(drone)} className="h-8 w-8 grid place-items-center rounded-md border text-muted-foreground hover:bg-background">
                  <FiEdit size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


// --- Main Dashboard Page ---

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
                  <Tooltip />
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
                  <Tooltip />
                  <Legend />
                  <Pie data={statusCounts} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card p-5 lg:col-span-2">
            <h2 className="font-semibold mb-4">Submissions Over Time (Line)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip />
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
        </section>
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border bg-card p-5">
             <h2 className="font-semibold mb-4">Recent Activity</h2>
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
                   {visibleSubmissions.slice(0, 5).map((s) => (
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
           </div>
          {/* Drone component is placed here */}
          <DeviceList />
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