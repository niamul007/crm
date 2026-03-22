/**
 * AUTHSERVICE.MJS — AUTH DATABASE QUERIES
 * -----------------------------------------
 * Handles all database operations related to authentication.
 * Called by authController — never directly by routes.
 * 
 * WHY SEPARATE SERVICE FROM CONTROLLER?
 * Controller handles HTTP (req, res)
 * Service handles database queries
 * Keeps code clean and each file focused on one job
 */

import pool from "../db/index.mjs";
import bcrypt from 'bcrypt';

/**
 * REGISTERUSER
 * ------------
 * 1. Check if email already exists — throw error if it does
 * 2. Hash the password with bcrypt before saving
 * 3. Insert new user into database
 * 4. Return new user (without password_hash)
 * 
 * WHY bcrypt.hash()?
 * Never store raw passwords. bcrypt adds a random salt
 * and hashes the password so even if the database is 
 * breached, passwords are unreadable.
 * 
 * SALT ROUNDS = 10
 * How many times bcrypt processes the hash.
 * Higher = more secure but slower. 10 is the standard.
 */
export const registerUser = async (email, password, username) => {

    const isUserExits = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (isUserExits.rows.length > 0) {
        throw new Error("User already exists");
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
        INSERT INTO users (email, password_hash, username) 
        VALUES ($1, $2, $3) 
        RETURNING id, email, username
    `;
    const newItem = await pool.query(sql, [email, hashPassword, username]);

    return newItem.rows[0];
};

/**
 * FINDBYEMAIL
 * -----------
 * Simple lookup by email.
 * Used in login to find the user before comparing password.
 * Returns full user row including password_hash for bcrypt.compare()
 * 
 * WHY NOT FIND BY ID?
 * At login time we don't know the id yet — only the email.
 * After login the JWT token carries the id for future requests.
 */
export const findUserByEmail = async (email) => {
    const sql = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(sql, [email]);
    return result.rows[0];
};