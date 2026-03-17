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

export const updateClient = async(update) =>{
  const {id, user_id, name, email, phone, company, project_name, project_status, deadline, budget} = update;
  const sql = `
    UPDATE clients
    SET name = $1, email = $2, phone = $3, company = $4, project_name = $5, project_status = $6, deadline = $7, budget = $8
    WHERE id = $9 AND user_id = $10
    RETURNING *
  `
  const result = await pool.query(sql, [name, email, phone, company, project_name, project_status, deadline, budget, id, user_id]);
  return result.rows[0];
}