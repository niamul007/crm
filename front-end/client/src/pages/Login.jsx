/**
 * Login.jsx
 * - Calls AuthContext login() with email + password
 * - On success → redirects to /dashboard
 * - On failure → shows error message from backend response
 * - loading state disables button to prevent multiple submissions
 */

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

// how erro and loading reall help state is used to manage the user experience during the login process.
//  When the user submits the login form, we set loading to true to indicate that the login process is in progress. 
// This can be used to disable the login button and show a loading spinner, preventing multiple submissions and providing feedback to the user.
// If the login attempt fails (e.g., due to incorrect credentials), we catch the error and set an appropriate error message in the error state. 
// This message can then be displayed to the user, informing them of what went wrong and prompting them to correct their input.
  // YOU WRITE THIS FUNCTION

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data.message || "Login failed check you credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  // errr.response?.data.message is a way to safely access the error message returned by the backend API when a login attempt fails.
  // The optional chaining operator (?.) is used to prevent runtime errors in case the error object or its nested properties are undefined. 
  // If the backend returns an error response with a message, it will be displayed to the user. If not, a generic error message will be shown instead.

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Client Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Register
            </Link> 
          </p>
        </div>
      </div>
    </div>
  );
}
