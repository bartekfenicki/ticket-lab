import { pool } from "../config/db.js";

export interface Reservation {
  id: number;
  email: string;
  title: string;
  note: string | null;
  date: string;
  start_time: string;
  num_people: number;
  total_price: number;
  payment_method: string;
  payment_status: string;
  status: string;
  first_name: string;
  last_name: string;
  phone: string;
  option_type_id: number;
  selected_variant: ReservationVariant;
  selected_add_ons: ReservationAddOn[];  // JSONB array
  created_at: string;
  updated_at: string;
}

export interface ReservationVariant {
  id: number;
  reservation_option_type_id: number;
  name: string;
  price: number;
  pricing_type: "flat" | "per_person";
  active: boolean;
  description?: string;
}

export interface ReservationAddOn {
  id: number;
  reservation_option_type_id: number;
  name: string;
  description?: string;
  price: number;
  pricing_type: "flat" | "per_person";
  active: boolean;
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

export const createReservation = async (
  data: Omit<Reservation, "id" | "created_at" | "updated_at">
): Promise<Reservation> => {
  const {
    email,
    title,
    note,
    date,
    start_time,
    num_people,
    total_price,
    payment_method,
    payment_status,
    status,
    first_name,
    last_name,
    phone,
    option_type_id,
    selected_variant,
    selected_add_ons,
  } = data;

  const result = await pool.query(
    `INSERT INTO reservations
      (email, title, note, date, start_time, num_people, total_price,
       payment_method, payment_status, status, first_name, last_name, phone,
       option_type_id, selected_variant, selected_add_ons)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      email,
      title,
      note,
      date,
      start_time,
      num_people,
      total_price,
      payment_method,
      payment_status,
      status,
      first_name,
      last_name,
      phone,
      option_type_id,
      JSON.stringify(selected_variant),   // JSONB
      JSON.stringify(selected_add_ons),  // JSONB
    ]
  );

  return result.rows[0];
};


// UPDATE
export const updateReservation = async (
  id: number,
  data: Partial<Reservation>
): Promise<Reservation | null> => {
  // Remove updated_at if the frontend sent it
  const filteredData = { ...data };
  delete filteredData.updated_at;

  const fields = Object.keys(filteredData);
  const values = Object.values(filteredData);

  // If no fields to update → only bump updated_at
  if (fields.length === 0) {
    const result = await pool.query(
      `UPDATE reservations
       SET updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  const setString = fields
    .map((field, i) => `${field}=$${i + 1}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE reservations
     SET ${setString}, updated_at = NOW()
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
