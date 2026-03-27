/**
 * ClientCard.jsx — displays a single client summary on the dashboard
 * - Clicking the card navigates to /clients/:id (detail view)
 * - onDelete is passed from Dashboard to handle client deletion
 * - e.stopPropagation() on delete button prevents the card's
 *   onClick from firing when delete is clicked
 */

import { useNavigate } from "react-router-dom";
export default function ClientCard({ client , onDelete}) {
  const navigate = useNavigate();
  return (
<div
  onClick={() => navigate(`/clients/${client.id}`)}
  className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 cursor-pointer transition"
>
  <div className="flex items-start justify-between gap-3">
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-white text-sm">{client.name}</h3>
      <p className="text-slate-400 text-sm mt-0.5">{client.company}</p>
    </div>
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
        {client.project_status}
      </span>
      <p className="text-green-400 text-sm font-medium">
        ${parseFloat(client.budget).toLocaleString()}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(client.id);
        }}
        className="text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-400/50 text-xs px-3 py-1 rounded-lg transition cursor-pointer"
      >
        Delete
      </button>
    </div>
  </div>
  <p className="text-slate-500 text-sm mt-3">{client.project_name}</p>
</div>
  );
}