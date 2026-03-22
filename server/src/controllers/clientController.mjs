/**
 * CLIENTCONTROLLER.MJS — CLIENT HTTP HANDLERS
 * ---------------------------------------------
 * Handles all HTTP requests for clients, payments and notes.
 * Extracts data from req.user, req.params, req.body
 * then calls the appropriate service function.
 * 
 * DATA SOURCES — where each piece of data comes from:
 *   req.user.id    → from JWT token via authMiddleware
 *   req.params.id  → from URL e.g. /clients/5
 *   req.params.pid → from URL e.g. /clients/5/payments/3
 *   req.params.nid → from URL e.g. /clients/5/notes/2
 *   req.body       → from frontend request body
 * 
 * CATCHASYNC
 * Wraps every function — no try/catch needed.
 * Any error automatically goes to globalErrorHandler.
 * 
 * STATUS CODES
 *   200 → success, returning data
 *   201 → success, something new created
 *   204 → success, nothing to return (delete)
 */

import * as clientService from "../services/clientService.mjs";
import catchAsync from "../utils/catchAsync.mjs";

/**
 * GETCLIENT — GET /api/clients
 * Returns all clients belonging to the logged in user
 * userId comes from JWT token via authMiddleware
 */
export const getClient = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const clients = await clientService.getClient(userId);
  res.status(200).json({ status: "success", data: { clients } });
});

/**
 * CREATECLIENT — POST /api/clients
 * All fields come from req.body (validated by Zod before reaching here)
 * userId comes from JWT token — frontend never sends userId directly
 */
export const createClient = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, company, project_name, project_status, deadline, budget } = req.body;
  const clients = await clientService.createClient(
    userId, name, email, phone, company,
    project_name, project_status, deadline, budget
  );
  res.status(201).json({ status: "success", data: { clients } });
});

/**
 * GETCLIENTBYID — GET /api/clients/:id
 * clientId comes from URL params
 * userId comes from JWT token
 * Service returns multiple rows (JOIN query) — 
 * TODO: reshape rows into single object with payments[] and notes[]
 */
export const getClientById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;
  const getClients = await clientService.getClientById(clientId, userId);
  res.status(200).json({ status: "success", data: { getClients } });
});

/**
 * UPDATECLIENT — PUT /api/clients/:id
 * id comes from URL params
 * All update fields come from req.body
 * Passed as one object to service — service destructures it
 */
export const updateClient = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const { name, email, phone, company, project_name, project_status, deadline, budget } = req.body;
  const clients = await clientService.updateClient(id, userId, {
    name, email, phone, company,
    project_name, project_status, deadline, budget
  });
  res.status(200).json({ status: "success", data: { clients } });
});

/**
 * DELETECLIENT — DELETE /api/clients/:id
 * 204 status means success but no content to return
 * res.send() not res.json() — 204 cannot have a body
 */
export const deleteClient = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  await clientService.deleteClient(id, userId);
  res.status(204).send();
});

/**
 * ADDPAYMENTS — POST /api/clients/:id/payments
 * clientId comes from URL — which client this payment belongs to
 * amount, payment_note, payment_date come from req.body
 * payment_note is optional — can be left empty
 */
export const addPayments = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.id;
  const { amount, payment_note, payment_date } = req.body;
  const client = await clientService.addPayments(
    clientId, userId, amount, payment_note, payment_date
  );
  res.status(201).json({ status: "success", data: { client } });
});

/**
 * DELETEPAYMENTS — DELETE /api/clients/:id/payments/:pid
 * paymentId comes from :pid in URL
 * userId for ownership check
 */
export const deletePayments = catchAsync(async (req, res) => {
  const paymentId = req.params.pid;
  const userId = req.user.id;
  await clientService.deletePayment(paymentId, userId);
  res.status(204).send();
});

/**
 * ADDNOTE — POST /api/clients/:id/notes
 * clientId from URL, content from req.body
 */
export const addNote = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.id;
  const content = req.body.content;
  const client = await clientService.addNote(clientId, userId, content);
  res.status(201).json({ status: "success", data: { client } });
});

/**
 * DELETENOTE — DELETE /api/clients/:id/notes/:nid
 * noteId comes from :nid in URL
 */
export const deleteNote = catchAsync(async (req, res) => {
  const noteId = req.params.nid;
  const userId = req.user.id;
  await clientService.deleteNote(noteId, userId);
  res.status(204).send();
});

