import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const formatClientData = (rows) => {
  if (!rows || rows.length === 0) return null;

  const client = {
    id: rows[0].client_id,
    name: rows[0].name,
    email: rows[0].email,
    phone: rows[0].phone,
    company: rows[0].company,
    project_name: rows[0].project_name,
    project_status: rows[0].project_status,
    deadline: rows[0].deadline,
    budget: rows[0].budget,
    payments: [],
    notes: [],
  };

  const seenPayments = new Set();
  const seenNotes = new Set();

  rows.forEach((row) => {
    if (row.payment_id && !seenPayments.has(row.payment_id)) {
      seenPayments.add(row.payment_id);
      client.payments.push({
        id: row.payment_id,
        amount: row.amount,
        payment_note: row.payment_note,
        payment_date: row.payment_date,
      });
    }
    if (row.note_id && !seenNotes.has(row.note_id)) {
      seenNotes.add(row.note_id);
      client.notes.push({
        id: row.note_id,
        content: row.content,
        created_at: row.note_created_at,
      });
    }
  });

  return client;
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  // Note form state
  const [noteContent, setNoteContent] = useState("");

  // YOU WRITE THIS — fetch client by id
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const res = await API.get(`/api/clients/${id}`);
        setClient(formatClientData(res.data?.data?.getClients));
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  // YOU WRITE THIS — add payment
  const handleAddPayment = async () => {};

  // YOU WRITE THIS — add note
  const handleAddNote = async () => {};

  // YOU WRITE THIS — delete payment
  const handleDeletePayment = async (paymentId) => {};

  // YOU WRITE THIS — delete note
  const handleDeleteNote = async (noteId) => {};

  const totalReceived =
    client?.payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
  const remaining = parseFloat(client?.budget || 0) - totalReceived;

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );

  if (!client)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Client not found
      </div>
    );

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
        <h1 className="text-lg font-bold">{client.name}</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Project Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Project Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Project</p>
              <p className="text-white font-medium mt-1">
                {client.project_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className="text-white font-medium mt-1 capitalize">
                {client.project_status}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Deadline</p>
              <p className="text-white font-medium mt-1">
                {new Date(client.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Company</p>
              <p className="text-white font-medium mt-1">{client.company}</p>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Budget
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">Total Budget</p>
              <p className="text-white font-bold text-xl mt-1">
                ${parseFloat(client.budget).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Received</p>
              <p className="text-green-400 font-bold text-xl mt-1">
                ${totalReceived.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="text-yellow-400 font-bold text-xl mt-1">
                ${remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Payments
          </h2>

          {/* Add Payment Form */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <input
              type="number"
              placeholder="Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Note (optional)"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddPayment}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition mb-4"
          >
            + Add Payment
          </button>

          {/* Payment List */}
          {client.payments.length === 0 ? (
            <p className="text-slate-500 text-sm">No payments yet.</p>
          ) : (
            <div className="space-y-2">
              {client.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-green-400 font-medium">
                      ${parseFloat(payment.amount).toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(payment.payment_date).toLocaleDateString()}
                      {payment.payment_note && ` — ${payment.payment_note}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePayment(payment.id)}
                    className="text-slate-500 hover:text-red-400 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Notes
          </h2>

          {/* Add Note Form */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddNote}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              + Add
            </button>
          </div>

          {/* Note List */}
          {client.notes.length === 0 ? (
            <p className="text-slate-500 text-sm">No notes yet.</p>
          ) : (
            <div className="space-y-2">
              {client.notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3"
                >
                  <p className="text-slate-300 text-sm">{note.content}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-500 hover:text-red-400 text-sm transition ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
