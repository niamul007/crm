import * as clientService from "../services/clientService.mjs";

export const getClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const clients = await clientService.getClient(userId);
    res.status(200).json({
      status: "success",
      data: { clients },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      company,
      project_name,
      project_status,
      deadline,
      budget,
    } = req.body;

    const clients = await clientService.createClient(
      userId,
      name,
      email,
      phone,
      company,
      project_name,
      project_status,
      deadline,
      budget,
    );
    res.status(201).json({
      status: "success",
      data: { clients },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const userId = req.user.id;
    const clientId = req.params.id;

    const getClients = await clientService.getClientById(clientId, userId);
    res.status(200).json({
      status: "success",
      data: { getClients },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      company,
      project_name,
      project_status,
      deadline,
      budget,
    } = req.body;

    const clients = await clientService.updateClient(id, userId, {
      name,
      email,
      phone,
      company,
      project_name,
      project_status,
      deadline,
      budget,
    });
    res.status(200).json({
      status: "success",
      data: { clients },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    await clientService.deleteClient(id, userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const addPayments = async (req, res) => {
  try {
    const clientId = req.params.id;
    const userId = req.user.id;
    const { amount, payment_note, payment_date } = req.body;

    const client = await clientService.addPayments(
      clientId,
      userId,
      amount,
      payment_note,
      payment_date,
    );
    res.status(201).json({
      status: "success",
      data: { client },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deletePayments = async (req, res) => {
  try {
    const paymentId = req.params.pid;
    const userId = req.user.id;
    await clientService.deletePayment(paymentId, userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const clientId = req.params.id;
    const userId = req.user.id;
    const content = req.body.content;

    const client = await clientService.addNote(clientId, userId, content);
    res.status(201).json({
      status: " success",
      data: { client },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.nid;
    const userId = req.user.id;

    await clientService.deleteNote(noteId, userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
