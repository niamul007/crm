import { useNavigate } from "react-router-dom";

export default function ClientCard({ client }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/clients/${client.id}`)}
      className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 cursor-pointer transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{client.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{client.company}</p>
        </div>
        <div className="text-right">
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
            {client.project_status}
          </span>
          <p className="text-green-400 text-sm font-medium mt-2">
            ${parseFloat(client.budget).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-slate-500 text-sm mt-3">{client.project_name}</p>
    </div>
  );
}