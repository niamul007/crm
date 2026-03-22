/**
 * CLIENTSERVICE.MJS — CLIENT DATABASE QUERIES
 * ---------------------------------------------
 * All database operations for clients, payments and notes.
 * Called by clientController — never directly by routes.
 * 
 * PARAMETER ORDER MATTERS
 * The order of parameters must match the SQL $1, $2, $3...
 * placeholders exactly. Getting this wrong sends wrong
 * data to wrong columns silently.
 * 
 * OWNERSHIP CHECK
 * Every query checks both id AND user_id. This ensures
 * a user can only access their own data — not other users'.
 */

import pool from "../db/index.mjs";

/**
 * GETCLIENT — Get all clients for a user
 * Returns array of client rows, newest first
 */
export const getClient = async (userId) => {
  const sql = ` 
    SELECT * FROM clients
    WHERE user_id = $1
    ORDER BY created_at DESC `;

  const result = await pool.query(sql, [userId]);
  return result.rows; // returns array, could be empty []
};

/**
 * CREATECLIENT — Insert new client
 * Parameter order must match VALUES ($1,$2...) exactly
 * RETURNING * sends back the newly created row
 */
export const createClient = async (
  userId, name, email, phone, company,
  project_name, project_status, deadline, budget,
) => {
  const sql = `
    INSERT INTO clients (user_id,name,email,phone,company,project_name,project_status,deadline,budget)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;
  const result = await pool.query(sql, [
    userId, name, email, phone, company,
    project_name, project_status, deadline, budget,
  ]);
  return result.rows[0]; // returns the new client object
};

/**
 * DELETECLIENT — Delete a client by id
 * Checks both id AND user_id — security ownership check.
 * Without user_id check, any user could delete any client.
 * Returns true if deleted, false if not found.
 */
export const deleteClient = async (clientId, userId) => {
  const sql = `
    DELETE FROM clients
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [clientId, userId]);
  return result.rowCount > 0; // true = deleted, false = not found
};

/**
 * UPDATECLIENT — Update client fields
 * Accepts id and user_id separately, update fields as object.
 * SET updates specific columns, WHERE ensures ownership.
 * $9 and $10 come AFTER the update fields in the array.
 */
export const updateClient = async (id, user_id, update) => {
  const { name, email, phone, company, project_name, project_status, deadline, budget } = update;
  const sql = `
    UPDATE clients
    SET name=$1, email=$2, phone=$3, company=$4, 
        project_name=$5, project_status=$6, deadline=$7, budget=$8
    WHERE id=$9 AND user_id=$10
    RETURNING *
  `;
  const result = await pool.query(sql, [
    name, email, phone, company,
    project_name, project_status, deadline, budget,
    id, user_id, // id and user_id come LAST to match $9, $10
  ]);
  return result.rows[0];
};

/**
 * GETCLIENTBYID — Get one client with all payments and notes
 * -----------------------------------------------------------
 * This is the most complex query in the app.
 * 
 * WHY LEFT JOIN?
 * INNER JOIN only returns rows matching in BOTH tables.
 * A new client with no payments would disappear.
 * LEFT JOIN returns the client even with no payments or notes.
 * Empty payments/notes come back as null values.
 * 
 * WHY ALIASES (AS)?
 * clients and payments both have 'id' and 'created_at'.
 * Without aliases they overwrite each other in the result.
 * AS gives each column a unique name.
 * 
 * WHY RETURN result.rows NOT result.rows[0]?
 * If client has 2 payments and 2 notes, SQL returns 4 rows
 * (every payment combined with every note).
 * We return all rows so the controller can reshape them
 * into one clean object with payments[] and notes[] arrays.
 */
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
      payments.payment_note,
      payments.payment_date,
      notes.id AS note_id,
      notes.content,
      notes.created_at AS note_created_at
    FROM clients
    LEFT JOIN payments ON clients.id = payments.client_id
    LEFT JOIN notes ON clients.id = notes.client_id
    WHERE clients.id = $1 AND clients.user_id = $2
  `;
  const result = await pool.query(sql, [clientId, userId]);
  if (result.rows.length === 0) return null;
  return result.rows; // multiple rows — controller will reshape these
};

/**
 * ADDPAYMENTS — Insert new payment for a client
 * payment_note is optional — can be null
 */
export const addPayments = async (clientId, userId, amount, payment_note, payment_date) => {
  const sql = `
    INSERT INTO payments (client_id, user_id, amount, payment_note, payment_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(sql, [clientId, userId, amount, payment_note, payment_date]);
  return result.rows[0];
};

/**
 * DELETEPAYMENT — Delete a payment
 * Checks user_id for ownership — prevents deleting others' payments
 */
export const deletePayment = async (paymentId, userId) => {
  const sql = `
    DELETE FROM payments
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [paymentId, userId]);
  return result.rowCount > 0;
};

/**
 * ADDNOTE — Insert new note for a client
 */
export const addNote = async (clientId, userId, content) => {
  const sql = `
    INSERT INTO notes (client_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(sql, [clientId, userId, content]);
  return result.rows[0];
};

/**
 * DELETENOTE — Delete a note
 * Checks user_id for ownership
 */
export const deleteNote = async (noteId, userId) => {
  const sql = `
    DELETE FROM notes 
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [noteId, userId]);
  return result.rowCount > 0;
};