/**
 * ClientForm.jsx — used for both creating and editing a client
 * - Create mode: navigated from /clients/new, no location state
 * - Edit mode: navigated from ClientDetail with client data in location.state
 * - useEffect pre-fills form when editClient exists
 * - handleSubmit sends POST (create) or PUT (edit) based on editClient
 */

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
  //tell me about the location and how we are using it to pre-fill the form when editing a client.
  //The useLocation hook from react-router-dom allows us to access the current location object,
  //  which contains information about the URL and any state passed through navigation.
  //  In this case, when we navigate to the ClientForm component for editing a client,
  //  we can pass the client's data as state in the navigation action. By accessing location.state?.client,
  //  we can retrieve the client data and use it to pre-fill the form fields when editing an existing client.
  //  If there is no client data in the location state (i.e., when adding a new client),
  //  the form will be initialized with empty fields.
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
    //explain ab buit about thsu try catch block and how it handles both creating a new client and updating an existing client based on the presence of editClient.
    //The try-catch block in the handleSubmit function is designed to handle both creating a new client and updating an existing client based on whether the editClient variable is defined.
    // If editClient exists, it means we are editing an existing client, and we make a PUT request to the API endpoint with the client's ID to update their information.
    // If editClient does not exist, it means we are adding a new client, and we make a POST request to the API endpoint to create a new client with the provided form data.
    // In both cases, if the API call is successful, we navigate back to the dashboard. If there is an error during either operation, we catch it and set an appropriate error message to inform the user of what went wrong.
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
        <h1 className="text-lg font-bold">
          {editClient ? "Edit Client" : "Add New Client"}
        </h1>
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
                {loading
                  ? "Saving..."
                  : editClient
                    ? "Update Client"
                    : "Save Client"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
