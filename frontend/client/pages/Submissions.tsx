import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FiImage, FiX, FiLoader, FiCheckCircle, FiCircle } from "react-icons/fi";

const PROCESSING_STEPS = [
  "Uploading to cloud...",
  "Verifying image authenticity...",
  "Hashing image data for immutability...",
  "Storing submission in blockchain logs...",
];

// The submission form component is updated with the new animation logic.
function NewSubmissionForm() {
  const { currentUser, createNewSubmission } = useAuth();
  const [form, setForm] = useState({
    projectId: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for handling the professional loading animation
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1); // -1: idle, 0 onwards: processing

  // Effect for creating a preview URL from the selected file
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // FIXED: The missing handleFileChange function is now defined here.
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // This effect runs the processing steps animation with a time lapse
  useEffect(() => {
    if (isProcessing && currentStep < PROCESSING_STEPS.length) {
      const timer = setTimeout(() => {
        // When the last step is visually completed, perform the submission
        if (currentStep === PROCESSING_STEPS.length - 1) {
          const adminId = currentUser.adminId || users.find(u => u.role === 'admin')?.id || 2;
          const submissionData = { ...form, adminId, imageUrl: previewUrl! };
          createNewSubmission(submissionData);
          toast.success("Submission Created", {
            description: `Project "${form.projectId}" is now pending review.`,
          });
          
          // Reset the form and animation state
          setIsProcessing(false);
          setCurrentStep(-1);
          setForm({ projectId: "", location: "", date: new Date().toISOString().slice(0, 10) });
          setSelectedFile(null);
          setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          // Move to the next step
          setCurrentStep(prev => prev + 1);
        }
      }, 1200); // 1.2-second delay for each step

      return () => clearTimeout(timer);
    }
  }, [isProcessing, currentStep, createNewSubmission, currentUser.adminId, form, previewUrl]);

  const handleSubmit = () => {
    if (!form.projectId || !form.location || !selectedFile) {
      toast.error("Missing Fields", {
        description: "Project ID, Location, and an image are required.",
      });
      return;
    }
    // Start the processing animation
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
      
      {/* This block displays the animated steps during submission */}
      {isProcessing && (
        <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Processing Submission...</h4>
            <div className="space-y-3">
                {PROCESSING_STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div key={index} className="flex items-center gap-3 text-sm transition-colors duration-300">
                           {isCompleted && <FiCheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                           {isActive && <FiLoader className="h-4 w-4 text-primary animate-spin flex-shrink-0" />}
                           {isPending && <FiCircle className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />}
                           <span className={`${isActive ? 'text-primary' : isPending ? 'text-muted-foreground/80' : 'text-foreground'}`}>
                               {step}
                           </span>
                        </div>
                    );
                })}
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


// --- Main Page Component ---
export default function SubmissionsPage() {
  const { currentUser, submissions, setSubmissions } = useAuth();

  const visible = useMemo(() => {
    if (!submissions) return [];
    const sorted = [...submissions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (currentUser.role === "super-admin") return sorted;
    if (currentUser.role === "admin") return sorted.filter(s => s.adminId === currentUser.id);
    return sorted.filter(s => s.submittedBy === currentUser.id);
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

        <NewSubmissionForm />

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

