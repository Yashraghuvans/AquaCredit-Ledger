import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FiImage, FiX, FiLoader, FiCheckCircle, FiCircle, FiEdit } from "react-icons/fi";

// --- HELPER FUNCTIONS ---

const getHashForKey = (id: number): string => {
  const pseudoRandom = (id * 1234567) % 0xFFFFFF;
  return '0x' + pseudoRandom.toString(16).padStart(6, '0');
};

const getCreditsForSubmission = (submissionId: number): number => {
  return (submissionId % 6) + 5;
};

// --- NEW EDIT MODAL COMPONENT ---

/**
 * A dialog box to display the details of a selected submission.
 */
const EditSubmissionModal = ({ submission, onClose }) => {
  const submitterName = users.find(u => u.id === submission.submittedBy)?.name || "Unknown User";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-2xl rounded-xl border bg-card p-6 shadow-lg animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full text-muted-foreground hover:bg-accent">
          <FiX />
        </button>
        <h3 className="text-lg font-semibold mb-2">Submission Details</h3>
        <p className="text-sm text-muted-foreground mb-4">Viewing details for project: <span className="font-medium text-foreground">{submission.projectId}</span></p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
          {/* Left Column: Details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Submitter Name</label>
              <p className="font-medium">{submitterName}</p>
            </div>
             <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <p className="font-medium">{submission.status}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Hash Key</label>
              <p className="font-mono text-sm">{submission.hashKey}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Credits Awarded</label>
              <p className="font-medium text-emerald-500">{submission.credits ?? 'N/A (Not Verified)'}</p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div>
             <label className="text-xs text-muted-foreground mb-1 block">Proof Image</label>
             <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <img src="/1.png" alt="Submission Proof" className="h-full w-full object-cover" />
             </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};


// --- UNCHANGED COMPONENTS ---

const PROCESSING_STEPS = [
  "Uploading to cloud...",
  "Verifying image authenticity...",
  "Hashing image data for immutability...",
  "Storing submission in blockchain logs...",
];

function NewSubmissionForm() {
  const { currentUser, createNewSubmission } = useAuth();
  const [form, setForm] = useState({ projectId: "", location: "", date: new Date().toISOString().slice(0, 10) });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (isProcessing && currentStep < PROCESSING_STEPS.length) {
      const timer = setTimeout(() => {
        if (currentStep === PROCESSING_STEPS.length - 1) {
          const adminId = currentUser.adminId || users.find(u => u.role === 'admin')?.id || 2;
          const submissionData = { ...form, adminId, imageUrl: previewUrl! };
          createNewSubmission(submissionData);
          toast.success("Submission Created", { description: `Project "${form.projectId}" is now pending review.` });
          setIsProcessing(false);
          setCurrentStep(-1);
          setForm({ projectId: "", location: "", date: new Date().toISOString().slice(0, 10) });
          setSelectedFile(null);
          setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, currentStep, createNewSubmission, currentUser.adminId, form, previewUrl]);

  const handleSubmit = () => {
    if (!form.projectId || !form.location || !selectedFile) {
      toast.error("Missing Fields", { description: "Project ID, Location, and an image are required." });
      return;
    }
    setIsProcessing(true);
    setCurrentStep(0);
  };

  return (
    <div className="w-full rounded-xl border bg-card p-6 shadow-lg">
      <h3 className="text-lg font-medium mb-4">Create New Submission</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Project ID *" value={form.projectId} onChange={(e) => setForm(f => ({ ...f, projectId: e.target.value }))} disabled={isProcessing} />
        <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Location *" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} disabled={isProcessing} />
        <input type="date" className="h-9 rounded-md border bg-background px-3 text-sm" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} disabled={isProcessing} />
        <div className="md:col-span-2">
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" disabled={isProcessing}/>
          {!selectedFile ? (
            <button onClick={() => fileInputRef.current?.click()} className="w-full h-9 flex items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-accent" disabled={isProcessing}>
              <FiImage /> Choose Image *
            </button>
          ) : (
            <div className="flex items-center gap-4 rounded-md border bg-accent/50 p-2">
              {previewUrl && <img src={previewUrl} alt="Preview" className="h-12 w-12 rounded-md object-cover" />}
              <div className="flex-grow">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => setSelectedFile(null)} className="h-7 w-7 grid place-items-center rounded-full text-muted-foreground hover:bg-background" disabled={isProcessing}><FiX size={16}/></button>
            </div>
          )}
        </div>
      </div>
      {isProcessing && (
        <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Processing Submission...</h4>
            <div className="space-y-3">
                {PROCESSING_STEPS.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm transition-colors duration-300">
                       {index < currentStep && <FiCheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                       {index === currentStep && <FiLoader className="h-4 w-4 text-primary animate-spin flex-shrink-0" />}
                       {index > currentStep && <FiCircle className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />}
                       <span className={`${index === currentStep ? 'text-primary' : index > currentStep ? 'text-muted-foreground/80' : 'text-foreground'}`}>{step}</span>
                    </div>
                ))}
            </div>
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
          <Button onClick={handleSubmit} disabled={!form.projectId || !form.location || !selectedFile || isProcessing}>
            {isProcessing ? 'Processing...' : 'Submit'}
          </Button>
      </div>
    </div>
  );
}


// --- MAIN PAGE COMPONENT ---
export default function SubmissionsPage() {
  const { currentUser, submissions, setSubmissions } = useAuth();
  
  // New state to manage which submission is being edited
  const [editingSubmission, setEditingSubmission] = useState(null);

  const visible = useMemo(() => {
    if (!submissions) return [];
    let filteredSubmissions = [];
    if (currentUser.role === "super-admin") filteredSubmissions = submissions;
    else if (currentUser.role === "admin") filteredSubmissions = submissions.filter(s => s.adminId === currentUser.id);
    else filteredSubmissions = submissions.filter(s => s.submittedBy === currentUser.id);
    const sorted = [...filteredSubmissions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted.map(s => ({
      ...s,
      hashKey: getHashForKey(s.id),
      credits: s.status === "Verified" ? getCreditsForSubmission(s.id) : null,
    }));
  }, [currentUser, submissions]);
  
  const verify = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Verified" } : s));
  const reject = (id: number) => setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Rejected" } : s));

  return (
    <Layout>
      {/* The Edit Modal is rendered here when a submission is selected */}
      {editingSubmission && (
        <EditSubmissionModal 
          submission={editingSubmission} 
          onClose={() => setEditingSubmission(null)} 
        />
      )}

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">Submissions</h2>
          <p className="text-sm text-muted-foreground">Review, verify or reject submissions from the list below.</p>
        </div>

        <NewSubmissionForm />

        <section className="rounded-xl border bg-card p-5">
           <h3 className="text-lg font-semibold mb-4">Submission History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4">Submitted By</th>
                  <th className="py-2 pr-4">Hash Key</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-center">Credits</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(s => (
                  <tr key={s.id} className="border-t align-top">
                    <td className="py-3 pr-4 font-medium">{s.projectId}</td>
                    <td className="py-3 pr-4">{users.find(u=>u.id===s.submittedBy)?.name}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.hashKey}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        s.status === "Verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        s.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center font-medium">{s.credits ?? '—'}</td>
                    <td className="py-3 pr-4 space-x-2 text-right">
                      {/* New Edit Button */}
                      <Button onClick={() => setEditingSubmission(s)} variant="ghost" size="icon" className="h-8 w-8">
                        <FiEdit className="h-4 w-4" />
                      </Button>
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