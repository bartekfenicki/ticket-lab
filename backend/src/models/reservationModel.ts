import { pool } from "../config/db.js";

export interface Reservation {
  id: number;
  email: string;
  title: string;
  note: string | null;
  date: string;
  start_time: string;
  end_time: string;
  num_people: number;
  base_price: number;
  total_price: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  status: string;
}

// GET ALL
export const getAllReservations = async (): Promise<Reservation[]> => {
  const result = await pool.query("SELECT * FROM reservations ORDER BY date, start_time ASC");
  return result.rows;
};

// GET ONE
export const getReservationById = async (id: number): Promise<Reservation | null> => {
  const result = await pool.query("SELECT * FROM reservations WHERE id = $1", [id]);
  return result.rows[0] || null;
};

// CREATE
export const createReservation = async (data: Omit<Reservation, "id" | "created_at" | "updated_at">): Promise<Reservation> => {
  const {
    email,
    title,
    note,
    date,
    start_time,
    end_time,
    num_people,
    base_price,
    total_price,
    payment_method,
    payment_status,
    status,
  } = data;

  const result = await pool.query(
    `INSERT INTO reservations
    (email, title, note, date, start_time, end_time, num_people, base_price, total_price, payment_method, payment_status, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      email,
      title,
      note,
      date,
      start_time,
      end_time,
      num_people,
      base_price,
      total_price,
      payment_method,
      payment_status,
      status,
    ]
  );

  return result.rows[0];
};

// UPDATE
export const updateReservation = async (
  id: number,
  data: Partial<Reservation>
): Promise<Reservation | null> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) return null;

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE reservations SET ${setString}, updated_at = NOW()
     WHERE id = $${fields.length + 1}
     RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

// DELETE
export const deleteReservation = async (id: number): Promise<boolean> => {
  await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
  return true;
};
