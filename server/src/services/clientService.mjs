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
    `
  const result = await pool.query(sql, [clientId, userId]);
  return result.rowCount > 0;
}