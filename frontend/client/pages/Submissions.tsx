import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/mockData";
import { useMemo, useState } from "react";

const dummySteps = [
  "Verifying image...",
  "Creating hash...",
  "Storing in decentralized cloud...",
  "Complete!",
];

export default function SubmissionsPage() {
  // We assume useAuth now provides the global submissions list and setters
  const { currentUser, submissions, setSubmissions } = useAuth();

  // The visible list is now derived from the global 'submissions' state
  const visible = useMemo(() => {
    if (!submissions) return [];
    if (currentUser.role === "super-admin") return submissions;
    if (currentUser.role === "admin") return submissions.filter(s => s.adminId === currentUser.id);
    return submissions.filter(s => s.submittedBy === currentUser.id);
  }, [currentUser, submissions]);
  
  // These functions now update the global state via setSubmissions
  const verify = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Verified" } : s));
  const reject = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Rejected" } : s));

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [step, setStep] = useState<number>(-1);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
      setStep(0);
      runDummySteps();
    }
  };

  const runDummySteps = () => {
    dummySteps.forEach((_, idx) => {
      setTimeout(() => setStep(idx), 1000 * (idx + 1));
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">Submissions</h2>
          <p className="text-sm text-muted-foreground">Review, verify or reject submissions from the list below.</p>
        </div>

        {/* The form section has been removed from this page */}

        <section className="rounded-xl border bg-card p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4">Submitted By</th>
                  <th className="py-2 pr-4">Location</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(s => (
                  <tr key={s.id} className="border-t align-top">
                    <td className="py-2 pr-4 font-medium">{s.projectId}</td>
                    <td className="py-2 pr-4">{users.find(u=>u.id===s.submittedBy)?.name}</td>
                    <td className="py-2 pr-4">{s.location}</td>
                    <td className="py-2 pr-4">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        s.status === "Verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        s.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 space-x-2">
                      {(currentUser.role === "admin" || currentUser.role === "super-admin") && (
                        <>
                          <button onClick={()=>verify(s.id)} className="h-8 rounded-md border px-2 text-xs">Verify</button>
                          <button onClick={()=>reject(s.id)} className="h-8 rounded-md border px-2 text-xs">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">New Submission</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {step >= 0 && step < dummySteps.length && (
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <span className="animate-pulse">⏳</span>
                <span>{dummySteps[step]}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${((step + 1) / dummySteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
          {step === dummySteps.length - 1 && imageUrl && (
            <div className="mt-4">
              <p className="text-green-600 font-semibold mb-2">Image uploaded (dummy):</p>
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-48 h-48 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}