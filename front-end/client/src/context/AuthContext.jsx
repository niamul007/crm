import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

/**
 * AuthContext — global auth state container
 * Any component can access user, login, logout, loading
 * without prop drilling
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * On app load — check if a token exists in localStorage
   * If yes, verify it with /api/auth/me and restore the user session
   * If invalid, remove the token and stay logged out
   */
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/api/auth/me");
          setUser(res.data.data.user);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  /**
   * login — sends credentials to backend
   * Backend returns { token, data: { user } }
   * Token stored in localStorage, user stored in state
   */
  const login = async (email, password) => {
    try {
      const res = await API.post("/api/auth/login", { email, password });
      const token = res.data.token;
      const userData = res.data.data.user;

      if (token && userData) {
        localStorage.setItem("token", token);
        setUser(userData);
        return res.data;
      } else {
        throw new Error("invalid response");
      }
    } catch (error) {
      console.error("🔥 Login Error:", error);
      throw error;
    }
  };

  /**
   * logout — clears token from localStorage and wipes user from state
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};