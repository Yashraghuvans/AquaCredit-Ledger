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
  const { currentUser, submissions, setSubmissions } = useAuth();

  // Dummy local submission history for demo
  const [localSubmissions, setLocalSubmissions] = useState<any[]>([]);

  const visible = useMemo(() => {
    if (!submissions) return [];
    if (currentUser.role === "super-admin") return submissions;
    if (currentUser.role === "admin") return submissions.filter(s => s.adminId === currentUser.id);
    return submissions.filter(s => s.submittedBy === currentUser.id);
  }, [currentUser, submissions]);

  const verify = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Verified" } : s));
  const reject = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Rejected" } : s));

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [step, setStep] = useState<number>(-1);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [dummyCredit, setDummyCredit] = useState<number>(0);

  // Add new dummy submission to local history
  const addDummySubmission = (imgUrl: string) => {
    const credit = Math.floor(Math.random() * 100) + 1; // random credit
    setLocalSubmissions(prev => [
      ...prev,
      {
        id: Date.now(),
        image: imgUrl,
        credit,
        date: new Date().toLocaleString(),
      },
    ]);
    setDummyCredit(credit);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
      setStep(0);
      runDummySteps(URL.createObjectURL(file));
    }
  };

  const runDummySteps = (imgUrl: string) => {
    dummySteps.forEach((_, idx) => {
      setTimeout(() => {
        setStep(idx);
        if (idx === dummySteps.length - 1) {
          addDummySubmission(imgUrl);
        }
      }, 1000 * (idx + 1));
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">Submissions</h2>
          <p className="text-sm text-muted-foreground">Review, verify or reject submissions from the list below.</p>
        </div>

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
                  <th className="py-2 pr-4">Image</th>
                  <th className="py-2 pr-4">Credit</th>
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
                    <td className="py-2 pr-4">
                      {s.image ? (
                        <img src={s.image} alt="submission" className="w-12 h-12 object-cover rounded" />
                      ) : "-"}
                    </td>
                    <td className="py-2 pr-4">
                      {s.credit ? s.credit : "-"}
                    </td>
                  </tr>
                ))}
                {/* Dummy local submissions */}
                {localSubmissions.map(s => (
                  <tr key={s.id} className="border-t align-top bg-gray-50">
                    <td className="py-2 pr-4 font-medium">Dummy Project</td>
                    <td className="py-2 pr-4">You</td>
                    <td className="py-2 pr-4">Dummy Location</td>
                    <td className="py-2 pr-4">{s.date}</td>
                    <td className="py-2 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">Verified</span>
                    </td>
                    <td className="py-2 pr-4">-</td>
                    <td className="py-2 pr-4">
                      <img src={s.image} alt="submission" className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="py-2 pr-4">{s.credit}</td>
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
              <p className="mt-2 text-blue-600">Dummy Credit: <span className="font-bold">{dummyCredit}</span></p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}