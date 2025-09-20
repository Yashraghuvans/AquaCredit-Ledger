import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/mockData";
import { FiHome, FiUsers, FiFileText, FiList, FiPlusCircle, FiLogOut, FiX, FiImage } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


// This modal now includes enhanced styling and feedback to match the submission page form.
function NewSubmissionModal({ onClose, createNewSubmission }: { onClose: () => void, createNewSubmission: (form: any) => void }) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    projectId: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a preview URL when a file is selected
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    // Free memory when the component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!form.projectId || !form.location || !selectedFile) {
      toast.error("Missing Fields", {
        description: "Project ID, Location, and an image are required.",
      });
      return;
    }
    // Assign a fallback admin if one isn't directly associated with the manager
    const adminId = currentUser.adminId || users.find(u => u.role === 'admin')?.id || 2;
    const submissionData = { ...form, adminId, imageUrl: previewUrl! };
    
    createNewSubmission(submissionData);
    
    toast.success("Submission Created", {
      description: `Project "${form.projectId}" is now pending review.`,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-2xl rounded-xl border bg-card p-6 shadow-lg animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full text-muted-foreground hover:bg-accent">
          <FiX />
        </button>
        <h3 className="text-lg font-medium mb-4">Create New Submission</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Project ID *" value={form.projectId} onChange={(e) => setForm(f => ({ ...f, projectId: e.target.value }))} />
          <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Location *" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
          <input type="date" className="h-9 rounded-md border bg-background px-3 text-sm" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
          
          <div className="md:col-span-2">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange} 
              ref={fileInputRef} 
              className="hidden" 
            />
            {!selectedFile ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-9 flex items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-accent"
              >
                <FiImage /> Choose Image *
              </button>
            ) : (
              <div className="flex items-center gap-4 rounded-md border bg-accent/50 p-2">
                {previewUrl && <img src={previewUrl} alt="Preview" className="h-12 w-12 rounded-md object-cover" />}
                <div className="flex-grow">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="h-7 w-7 grid place-items-center rounded-full text-muted-foreground hover:bg-background"><FiX size={16}/></button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
            <Button onClick={onClose} variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.projectId || !form.location || !selectedFile}>Submit</Button>
        </div>
      </div>
    </div>
  );
}


export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, loginAs, createNewSubmission, logout: contextLogout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logout = () => {
    if(contextLogout) contextLogout();
    navigate("/login");
  };

  const navItem = (to: string, label: string, Icon: any) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/60 ${
          isActive ? "bg-accent text-foreground" : "text-muted-foreground"
        }`
      }
    >
      <Icon className="h-4 w-4" /> {label}
    </NavLink>
  );

  return (
    <>
      {isModalOpen && <NewSubmissionModal createNewSubmission={createNewSubmission} onClose={() => setIsModalOpen(false)} />}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-background text-foreground">
        <aside className="hidden md:flex flex-col gap-4 border-r p-4 bg-card/60">
          <div className="flex items-center gap-2 px-2 pt-1 pb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
              <span className="text-primary font-black">A</span>
            </div>
            <div>
              <p className="text-sm leading-tight text-muted-foreground">AquaCredit</p>
              <p className="font-semibold -mt-0.5">Ledger</p>
            </div>
          </div>
          {navItem("/dashboard", "Dashboard", FiHome)}
          {navItem("/submissions", "Submissions", FiFileText)}
          {navItem("/logs", "Blockchain Log", FiList)}
          {currentUser.role === "super-admin" && navItem("/users", "User Management", FiUsers)}
          <div className="mt-auto" />
          <div className="text-xs text-muted-foreground px-2">Signed in as</div>
          <div className="px-2 text-sm font-medium">{currentUser.name}</div>
        </aside>

        <main className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button className="md:hidden rounded-md px-2 py-1.5 border text-sm">Menu</button>
                <h1 className="text-xl font-semibold">AquaCredit Ledger Admin</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{currentUser.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={currentUser.id}
                  onChange={(e) => loginAs(Number(e.target.value))}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} • {u.role}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <FiPlusCircle /> New Submission
                </Button>
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </Button>
              </div>
            </div>
          </header>
          <div className="p-4 md:p-6 lg:p-8 flex-1">{children}</div>
          <footer className="border-t p-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} AquaCredit Ledger. All rights reserved.
          </footer>
        </main>
      </div>
    </>
  );
}
