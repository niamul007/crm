import * as clientService from "../services/clientService.mjs";
import catchAsync from "../utils/catchAsync.mjs";

export const getClient = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const clients = await clientService.getClient(userId);
  res.status(200).json({ status: "success", data: { clients } });
});

export const createClient = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, company, project_name, project_status, deadline, budget } = req.body;
  const clients = await clientService.createClient(userId, name, email, phone, company, project_name, project_status, deadline, budget);
  res.status(201).json({ status: "success", data: { clients } });
});

export const getClientById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;
  const getClients = await clientService.getClientById(clientId, userId);
  res.status(200).json({ status: "success", data: { getClients } });
});

export const updateClient = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const { name, email, phone, company, project_name, project_status, deadline, budget } = req.body;
  const clients = await clientService.updateClient(id, userId, { name, email, phone, company, project_name, project_status, deadline, budget });
  res.status(200).json({ status: "success", data: { clients } });
});

export const deleteClient = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  await clientService.deleteClient(id, userId);
  res.status(204).send();
});

export const addPayments = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.id;
  const { amount, payment_note, payment_date } = req.body;
  const client = await clientService.addPayments(clientId, userId, amount, payment_note, payment_date);
  res.status(201).json({ status: "success", data: { client } });
});

export const deletePayments = catchAsync(async (req, res) => {
  const paymentId = req.params.pid;
  const userId = req.user.id;
  await clientService.deletePayment(paymentId, userId);
  res.status(204).send();
});

export const addNote = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.id;
  const content = req.body.content;
  const client = await clientService.addNote(clientId, userId, content);
  res.status(201).json({ status: "success", data: { client } });
});

export const deleteNote = catchAsync(async (req, res) => {
  const noteId = req.params.nid;
  const userId = req.user.id;
  await clientService.deleteNote(noteId, userId);
  res.status(204).send();
});