import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import API from "../api/axios";

export default function ClientForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const editClient = location.state?.client;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    project_name: "",
    project_status: "pending",
    deadline: "",
    budget: "",
  });

  const {
    name,
    email,
    phone,
    company,
    project_name,
    project_status,
    deadline,
    budget,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (editClient && !formData.name) {
      setFormData({
        name: editClient.name || "",
        email: editClient.email || "",
        phone: editClient.phone || "",
        company: editClient.company || "",
        project_name: editClient.project_name || "",
        project_status: editClient.project_status || "pending",
        deadline: editClient.deadline ? editClient.deadline.split("T")[0] : "",
        budget: editClient.budget || "",
      });
    }
  }, [editClient]);

  // YOU WRITE THIS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editClient) {
        await API.put(`/api/clients/${editClient.id}`, formData);
      } else {
        await API.post("/api/clients", formData);
      }
      navigate("/dashboard");

    } catch (error) {
      console.log("VALIDATION ERRORS:", error.response?.data);
      setError(error.response?.data.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate-400 hover:text-white transition text-sm"
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold">Add New Client</h1>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Ahmed Khan"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="ahmed@example.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Phone & Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  placeholder="01711111111"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={onChange}
                  placeholder="Webmox Agency"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                name="project_name"
                value={project_name}
                onChange={onChange}
                placeholder="E-commerce Website"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Status & Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  name="project_status"
                  value={project_status}
                  onChange={onChange}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={deadline}
                  onChange={onChange}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                value={budget}
                onChange={onChange}
                placeholder="800"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg py-3 text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition"
              >
                {loading ? "Saving..." : "Save Client"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
