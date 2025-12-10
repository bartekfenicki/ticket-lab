import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export interface StaffUser {
  id?: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
}


// Create user
export const createUser = async (user: Omit<StaffUser, "id">): Promise<StaffUser> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password_hash, 10);
    const columns = [
      "name",
      "email",
      "password_hash",
      "role",
    ];

    const values = [
      user.name,
      user.email,
      hashedPassword,
      user.role,
    ];

   const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

   const query = `INSERT INTO staff_users (${columns.join(", ")})
               VALUES (${placeholders})
               RETURNING *`;

    const result = await pool.query<StaffUser>(query, values);

    return result.rows[0];
  } catch (err) {
    console.error("❌ Error in createUser:", err);
    throw err;
  }
};

//  login
export const findUserByEmail = async (email: string): Promise<StaffUser | null> => {
  const result = await pool.query<StaffUser>(
    `SELECT * FROM staff_users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return result.rows.length ? result.rows[0] : null;
};

//  Validate password
export const validatePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};


// Get all users
export const getAllUsers = async (): Promise<StaffUser[]> => {
  const result = await pool.query<StaffUser>("SELECT * FROM staff_users ORDER BY id DESC");
  return result.rows;
};

// Get user by ID
export const getUserById = async (id: number): Promise<StaffUser | null> => {
  const result = await pool.query<StaffUser>("SELECT * FROM staff_users WHERE id = $1", [id]);
  return result.rows[0] || null;
};



// Update user
export const updateUser = async (id: number, fields: Partial<StaffUser>): Promise<StaffUser | null> => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getUserById(id);

  const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
  const values = Object.values(fields);

  const result = await pool.query<StaffUser>(
    `UPDATE staff_users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

// ✅ Delete user
export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM staff_users WHERE id = $1", [id]);
  return !!result.rowCount && result.rowCount > 0;
};
