// so what does this files do is it checks if the user is authenticated 
// before allowing access to certain routes.
//  If the user is not authenticated, it redirects them to
//  the login page. If the authentication status is still being dete
// rmined (loading), it shows a loading spinner.


import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        {/* Spinning circle — border-t creates the rotating arc effect */}
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Verifying Identity...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
export default ProtectedRoute;
