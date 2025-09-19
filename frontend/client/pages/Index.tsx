import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { submissions as allSubmissions, users, blockchainLogs } from "@/data/mockData";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiClock, FiHash } from "react-icons/fi";

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
