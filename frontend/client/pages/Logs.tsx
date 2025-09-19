import Layout from "@/components/Layout";
import { blockchainLogs } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

export default function LogsPage() {
  const { currentUser } = useAuth();
  const visible = currentUser.role === "manager" ? blockchainLogs.filter(l => l.user === currentUser.name) : blockchainLogs;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Blockchain Logbook</h2>
          <p className="text-sm text-muted-foreground">Simulated chain activity and credit minting events.</p>
        </div>
        <div className="rounded-xl border bg-card p-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-4">Txn</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Activity</th>
                <th className="py-2 pr-4">Credits</th>
                <th className="py-2 pr-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(l => (
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
      </div>
    </Layout>
  );
}
