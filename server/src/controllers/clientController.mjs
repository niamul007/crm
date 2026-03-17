import { use } from "react";
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

    const getClients = await clientService.getClientById(clientId,userId);
    res.status(200).json({
      status: "success",
      data: { getClients },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
