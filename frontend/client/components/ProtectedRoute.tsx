import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  allow: (role: string) => boolean;
  children: React.ReactElement;
  redirectTo?: string;
}

export default function ProtectedRoute({ allow, children, redirectTo = "/unauthorized" }: Props) {
  const { currentUser } = useAuth();
  if (!allow(currentUser.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
