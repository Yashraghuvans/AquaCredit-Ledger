import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { users as seedUsers, User, Role } from "@/data/mockData";
import { useMemo, useState } from "react";

export default function UsersPage() {
  const { currentUser } = useAuth();
  const [list, setList] = useState<User[]>(seedUsers);

  const admins = useMemo(() => list.filter((u) => u.role === "admin"), [list]);

  const [form, setForm] = useState<Partial<User>>({ role: "manager" as Role, name: "", email: "", teamId: 101 });

  const addUser = () => {
    if (!form.name || !form.email || !form.role) return;
    const next: User = {
      id: Math.max(...list.map((u) => u.id)) + 1,
      name: form.name!,
      email: form.email!,
      role: form.role as Role,
      teamId: form.teamId ?? null,
      adminId: form.adminId,
    };
    setList([...list, next]);
    setForm({ role: "manager" as Role, name: "", email: "", teamId: 101 });
  };

  const deleteUser = (id: number) => setList(list.filter((u) => u.id !== id));

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">Create, edit and remove users. Signed in as <span className="font-medium">{currentUser.name}</span>.</p>
        </div>

        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-medium mb-3">Add User</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Full name" value={form.name || ""} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} />
            <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Email" value={form.email || ""} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} />
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={form.role} onChange={(e)=>setForm(f=>({...f,role:e.target.value as Role}))}>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
            <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Team ID (optional)" value={form.teamId ?? ""} onChange={(e)=>setForm(f=>({...f,teamId:e.target.value?Number(e.target.value):null}))} />
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={form.adminId ?? ""} onChange={(e)=>setForm(f=>({...f,adminId:e.target.value?Number(e.target.value):undefined}))}>
              <option value="">Admin (only for managers)</option>
              {admins.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addUser} className="h-9 rounded-md bg-primary text-primary-foreground px-3 text-sm">Add</button>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-medium mb-3">All Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Team</th>
                  <th className="py-2 pr-4">Admin</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="py-2 pr-4 font-medium">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4">{u.teamId ?? "—"}</td>
                    <td className="py-2 pr-4">{u.adminId ?? "—"}</td>
                    <td className="py-2 pr-4">
                      <button onClick={() => deleteUser(u.id)} className="h-8 rounded-md border px-2 text-xs">Delete</button>
                    </td>
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
