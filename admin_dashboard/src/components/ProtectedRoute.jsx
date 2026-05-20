import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-b-purple-400 border-l-cyan-500 border-t-transparent border-r-transparent animate-spin-reverse opacity-70"></div>
        </div>
        <p className="mt-4 text-sm font-semibold tracking-wider text-cyan-400/80 uppercase animate-pulse">
          Decrypting Security Clearance...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
