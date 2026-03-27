/**
 * Dashboard.jsx — main landing page after login
 * - Fetches all clients belonging to the logged-in user
 * - Displays summary stats: total clients, active projects, total budget
 * - onDelete handles client deletion and updates local state without re-fetch
 * - ClientCard receives onDelete as prop to handle delete button clicks
 */

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import ClientCard from "../components/ClientCard";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all clients for the logged-in user on mount
  useEffect(() => {
    const fetchClient = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await API.get("/api/clients");
        setClients(res.data?.data?.clients || []);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [user?.id]);

  // Clear auth state and redirect to login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalBudget = clients.reduce(
    (sum, c) => sum + (parseFloat(c.budget) || 0),
    0
  );
  const activeProjects = clients.filter(
    (c) => c.project_status === "in-progress"
  ).length;

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await API.delete(`/api/clients/${id}`);
      setClients(clients.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete client", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Client Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            Hey, {user?.username} 👋
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
              Total Clients
            </p>
            <p className="text-3xl font-bold text-white">{clients.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
              Active Projects
            </p>
            <p className="text-3xl font-bold text-blue-400">{activeProjects}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
              Total Budget
            </p>
            <p className="text-3xl font-bold text-green-400">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Your Clients</h2>
          <button
            onClick={() => navigate("/clients/new")}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Add Client
          </button>
        </div>

        {/* Client List */}
        {loading ? (
          <div className="text-center text-slate-500 py-20">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            <p className="text-lg mb-2">No clients yet</p>
            <p className="text-sm">Add your first client to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}