import pool from "../db/index.js";

export const getClient = async (userId) => {
  const sql = ` 
        SELECT * FROM clients
        WHERE user_id = $1
        ORDER BY created_at DESC `;

  const result = await pool.query(sql, [userId]);
  return result.rows;
};

export const createClient = async (
  userId,
  name,
  email,
  phone,
  company,
  project_name,
  project_status,
  deadline,
  budget,
) => {
  const sql = `
    INSERT INTO clients (user_id,name,email,phone,company,project_name,project_status,deadline,budget)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `;
  const resutl = await pool.query(sql, [
    userId,
    name,
    email,
    phone,
    company,
    project_name,
    project_status,
    deadline,
    budget,
  ]);
  return resutl.rows[0];
};

export const deleteClient = async (clientId, userId) => {
  const sql = `
    DELETE FROM clients
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `;
  const result = await pool.query(sql, [clientId, userId]);
  return result.rowCount > 0;
};

export const updateClient = async (id, user_id, update) => {
  const {
    name,
    email,
    phone,
    company,
    project_name,
    project_status,
    deadline,
    budget,
  } = update;
  const sql = `
    UPDATE clients
    SET name = $1, email = $2, phone = $3, company = $4, project_name = $5, project_status = $6, deadline = $7, budget = $8
    WHERE id = $9 AND user_id = $10
    RETURNING *
  `;
  const result = await pool.query(sql, [
    name,
    email,
    phone,
    company,
    project_name,
    project_status,
    deadline,
    budget,
    id,
    user_id,
  ]);
  return result.rows[0];
};

export const addPayments = async (
  clientId,
  userId,
  amount,
  payment_note,
  payment_date,
) => {
  const sql = `
  INSERT INTO payments (client_id, user_id, amount, note, exact_date)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
  `;
  const result = await pool.query(sql, [
    clientId,
    userId,
    amount,
    payment_note,
    payment_date,
  ]);
  return result.rows[0];
};

export const deletePayment = async (paymentId, userId) => {
  const sql = `
    DELETE FROM payments
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [paymentId, userId]);
  return result.rowCount > 0;
};

export const addNote = async (clientId, userId, content) => {
  const sql = `
  INSERT INTO notes (client_id, user_id, content)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  const result = await pool.query(sql, [clientId, userId, content]);
  return result.rows[0];
};

export const deleteNote = async (noteId, userId) => {
  const sql = `
  DELETE FROM notes 
WHERE id = $1 AND user_id = $2
  RETURNING *
  `;

  const result = await pool.query(sql, [noteId, userId]);
  return result.rowCount > 0;
};

export const getClientById = async (clientId, userId) => {
  const sql = `
  SELECT 
  clients.id AS client_id,
  clients.name,
  clients.email,
  clients.phone,
  clients.company,
  clients.project_name,
  clients.project_status,
  clients.deadline,
  clients.budget,
  clients.created_at AS client_created_at,
  payments.id AS payment_id,
  payments.amount,
  payments.note AS payment_note,
  payments.exact_date,
  notes.id AS note_id,
  notes.content,
  notes.created_at AS note_created_at
FROM clients
LEFT JOIN payments ON clients.id = payments.client_id
LEFT JOIN notes ON clients.id = notes.client_id
WHERE clients.id = $1 AND clients.user_id = $2
  `;
  const result = await pool.query(sql, [clientId, userId]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows;
};

//strict

// SELECT * FROM clients
// INNER JOIN payments ON clients.id = payments.client_id
// INNER JOIN notes ON clients.id = notes.client_id
// WHERE clients.id = $1

//easy
// SELECT * FROM clients
// LEFT JOIN payments ON clients.id = payments.client_id
// LEFT JOIN notes ON clients.id = notes.client_id
// WHERE clients.id = $1

// SELECT
//   clients.id AS client_id,
//   clients.name,
//   clients.email,
//   clients.phone,
//   clients.company,
//   clients.project_name,
//   clients.project_status,
//   clients.deadline,
//   clients.budget,
//   clients.created_at AS client_created_at,
//   payments.id AS payment_id,
//   payments.amount,
//   payments.note AS payment_note,
//   payments.exact_date,
//   notes.id AS note_id,
//   notes.content,
//   notes.created_at AS note_created_at
// FROM clients
// LEFT JOIN payments ON clients.id = payments.client_id
// LEFT JOIN notes ON clients.id = notes.client_id
// WHERE clients.id = $1 AND clients.user_id = $2
