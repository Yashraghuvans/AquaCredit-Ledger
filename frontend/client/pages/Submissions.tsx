import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"; // Ensure you have this hook

// --- New Submission Form Component ---
const STEPS = [
  "Verifying image authenticity...",
  "Hashing image for immutability...",
  "Encrypting data...",
  "Adding submission to the ledger...",
];

function SubmissionForm({ currentUser, setSubmissions, submissions }) {
  const [projectId, setProjectId] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const { toast } = useToast();
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const handleStart = () => {
    if (!file || !projectId || !location || running) return;
    setRunning(true);
    setStepIndex(-1);

    STEPS.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setStepIndex(i);
        if (i === STEPS.length - 1) {
          const complete = window.setTimeout(() => {
            const newSubmission = {
              id: Math.max(...submissions.map(s => s.id)) + 1, // Generate a new ID
              projectId,
              submittedBy: currentUser.id,
              adminId: currentUser.adminId, // Assuming this exists on the user object
              location,
              date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
              status: "Pending",
            };
            
            setSubmissions(current => [...current, newSubmission]);
            
            toast({ title: "Submission successful!", description: `Project ${projectId} is now pending review.` });
            
            // Reset form
            setRunning(false);
            setStepIndex(-1);
            setFile(null);
            setPreview(null);
            setProjectId("");
            setLocation("");

          }, 1200);
          timeouts.current.push(complete);
        }
      }, (i + 1) * 1500);
      timeouts.current.push(t);
    });
  };

  const status = useMemo(() =>
    STEPS.map((s, i) => ({
      text: s,
      state: i < stepIndex ? "done" : i === stepIndex ? "active" : "idle",
    })), [stepIndex]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Project ID (e.g., P-1024)" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
            <Input placeholder="Location (e.g., Coastal Region)" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="md:col-span-2"/>
            <Button onClick={handleStart} disabled={!file || !projectId || !location || running}>
              {running ? "Processing..." : "Process & Submit"}
            </Button>
        </div>
        {preview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="aspect-video overflow-hidden rounded-lg border">
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              <div className="space-y-2">
                {status.map(({ text, state }, idx) => (
                  <div key={idx} className={
                    state === "done"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : state === "active"
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }>
                    {state === "done" ? "✓ " : state === "active" ? "• " : "– "}
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// --- Main Page Component ---

export default function SubmissionsPage() {
  const { currentUser, submissions, setSubmissions } = useAuth();

  const visible = useMemo(() => {
    if (!submissions) return [];
    if (currentUser.role === "super-admin") return submissions;
    if (currentUser.role === "admin") return submissions.filter(s => s.adminId === currentUser.id);
    return submissions.filter(s => s.submittedBy === currentUser.id);
  }, [currentUser, submissions]);
  
  const verify = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Verified" } : s));
  const reject = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Rejected" } : s));

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">Submissions</h2>
          <p className="text-sm text-muted-foreground">Review, verify or reject submissions from the list below.</p>
        </div>

        {/* --- Form Section Added Here --- */}
        <SubmissionForm currentUser={currentUser} setSubmissions={setSubmissions} submissions={submissions} />

        <section className="rounded-xl border bg-card p-5">
           <h3 className="text-lg font-semibold mb-4">Submission History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4">Submitted By</th>
                  <th className="py-2 pr-4">Location</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(s => (
                  <tr key={s.id} className="border-t align-top">
                    <td className="py-3 pr-4 font-medium">{s.projectId}</td>
                    <td className="py-3 pr-4">{users.find(u=>u.id===s.submittedBy)?.name}</td>
                    <td className="py-3 pr-4">{s.location}</td>
                    <td className="py-3 pr-4">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        s.status === "Verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        s.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 space-x-2 text-right">
                      {(currentUser.role === "admin" || currentUser.role === "super-admin") && s.status === "Pending" && (
                        <>
                          <Button onClick={()=>verify(s.id)} variant="outline" size="sm">Verify</Button>
                          <Button onClick={()=>reject(s.id)} variant="outline" size="sm">Reject</Button>
                        </>
                      )}
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