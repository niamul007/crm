import pool from "../db/index.js";
import bcrypt from 'bcrypt';


export const registerUser = async (email,password,username) =>{

    const isUserExits = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);

    if(isUserExits.rows.length > 0){
        throw new Error("User already exists")
    }

    const saltRounds = 10; 
    const hashPassword = await bcrypt.hash(password,saltRounds);

    const sql = ` INSERT INTO users (email,password_hash,username) VALUES($1,$2,$3) RETURNING id, email, username`;
    const newItem = await pool.query(sql,[email,hashPassword,username]);

    return newItem.rows[0];

}


export const findUserByEmail = async (email) =>{
    const sql = ` SELECT * FROM users WHERE email = $1`
    const result = await pool.query(sql,[email])
    return result.rows[0]
}