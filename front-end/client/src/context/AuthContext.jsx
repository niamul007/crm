import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      throw error; // re-throw so the Login page can show an error message
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // delete the ticket
    setUser(null); // wipe React memory
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
