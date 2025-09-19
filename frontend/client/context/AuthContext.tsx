import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { 
  users as seedUsers, 
  submissions as seedSubmissions, 
  User, 
  Role, 
  Submission 
} from "@/data/mockData";

interface AuthContextValue {
  currentUser: User;
  users: User[];
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  loginAs: (userId: number) => void;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
  createNewSubmission: (form: Omit<Submission, 'id' | 'status' | 'submittedBy'>) => void;
}

const defaultUser = seedUsers[0];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<number>(defaultUser.id);
  const [allUsers] = useState<User[]>(seedUsers);
  const [submissions, setSubmissions] = useState<Submission[]>(seedSubmissions);

  const currentUser = useMemo(() => allUsers.find(u => u.id === currentUserId) || defaultUser, [allUsers, currentUserId]);

  const createNewSubmission = (form: Omit<Submission, 'id' | 'status' | 'submittedBy'>) => {
    const newSubmission: Submission = {
      id: Math.max(...submissions.map(s => s.id)) + 1,
      submittedBy: currentUser.id,
      status: "Pending",
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      ...form,
    };
    setSubmissions(prevSubmissions => [newSubmission, ...prevSubmissions]);
  };
  
  const value: AuthContextValue = {
    currentUser,
    users: allUsers,
    submissions,
    setSubmissions,
    loginAs: (userId: number) => setCurrentUserId(userId),
    logout: () => setCurrentUserId(defaultUser.id),
    hasRole: (...roles: Role[]) => roles.includes(currentUser.role),
    createNewSubmission,
  };

 
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};