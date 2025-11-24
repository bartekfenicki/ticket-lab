import { pool } from "../config/db.js";

export interface Ticket {
  id: number;
  date: string;
  email: string;
  phone: string;
  full_name: string;
  other_names: string[] | null;
  total_price: number;
  payment_status: string;
  qr_token: string;
  special_event_id?: number | null;
}

export interface TicketItem {
  ticket_id: number;
  ticket_type_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

// CREATE MAIN TICKET
export const createTicket = async (ticket: Partial<Ticket>): Promise<Ticket> => {
  const result = await pool.query(
    `INSERT INTO tickets
      (date, email, phone, full_name, other_names, total_price, payment_status, qr_token, special_event_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      ticket.date,
      ticket.email,
      ticket.phone,
      ticket.full_name,
      JSON.stringify(ticket.other_names || []),
      ticket.total_price,
      ticket.payment_status,
      ticket.qr_token,
      ticket.special_event_id ?? null
    ]
  );

  return result.rows[0];
};

// CREATE MULTIPLE TICKET ITEMS
export const createTicketItem = async (item: TicketItem): Promise<void> => {
  await pool.query(
    `INSERT INTO ticket_items (ticket_id, ticket_type_id, quantity, price, subtotal)
     VALUES ($1, $2, $3, $4, $5)`,
    [item.ticket_id, item.ticket_type_id, item.quantity, item.price, item.subtotal]
  );
};

// GET FULL TICKET WITH ITEMS
export const getTicketWithItems = async (id: number) => {
  const ticketRes = await pool.query(
    "SELECT * FROM tickets WHERE id = $1",
    [id]
  );

  if (ticketRes.rows.length === 0) return null;

  const ticket = ticketRes.rows[0];

  // Automatically mark ticket as used if the event date has passed
  if (ticket.date && new Date(ticket.date) < new Date()) {
    ticket.used = true;
  }

  const itemsRes = await pool.query(
    `SELECT ti.*, tt.name
     FROM ticket_items ti
     JOIN ticket_types tt ON ti.ticket_type_id = tt.id
     WHERE ticket_id = $1`,
    [id]
  );

  return {
    ...ticket,
    items: itemsRes.rows
  };
};


export const getTicketsByEmail = async (email: string): Promise<Ticket[]> => {
  const result = await pool.query(
    `
    SELECT
      t.*,
      json_agg(
        json_build_object(
          'ticket_type_id', ti.ticket_type_id,
          'quantity', ti.quantity,
          'price_at_purchase', ti.price_at_purchase,
          'name', tt.name
        )
      ) AS items
    FROM tickets t
    LEFT JOIN ticket_items ti ON ti.ticket_id = t.id
    LEFT JOIN ticket_types tt ON tt.id = ti.ticket_type_id
    WHERE t.email = $1
    GROUP BY t.id
    ORDER BY t.created_at DESC
    `,
    [email]
  );

  return result.rows;
};

// Get all tickets with their ticket types
export const getAllTickets = async (): Promise<Ticket[]> => {
  // 1. Get all tickets
  const ticketRes = await pool.query("SELECT * FROM tickets ORDER BY created_at DESC");
  const tickets = ticketRes.rows;

  // 2. For each ticket, get its items from junction table
  const ticketIds = tickets.map(t => t.id);
  if (ticketIds.length === 0) return [];

  // Query all items in one go using IN (...)
  const itemsRes = await pool.query(
    `
    SELECT ti.ticket_id, ti.ticket_type_id, tt.name, tt.price, ti.quantity
    FROM ticket_items ti
    JOIN ticket_types tt ON tt.id = ti.ticket_type_id
    WHERE ti.ticket_id = ANY($1)
    `,
    [ticketIds]
  );

  const items = itemsRes.rows;

  // Map items into tickets
  const ticketsWithItems = tickets.map(t => ({
    ...t,
    items: items.filter(i => i.ticket_id === t.id)
  }));

  return ticketsWithItems;
};
