import { defineStore } from "pinia";
import { ref } from "vue";
import type { ReservationOptionType } from "./reservationOptionTypesStore";

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

export interface Reservation {
  id?: number;
  email: string;
  title: string;
  note?: string | null;
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
  selected_variant?: ReservationVariant | null;
  selected_add_ons: ReservationAddOn[];
}

export interface ReservationStepData {
  reservation_option_type: ReservationOptionType;  // full object
  variant?: ReservationVariant;                    // optional
  addOns: ReservationAddOn[];
  numPeople: number;
  totalPrice: number;
}

export const useReservationStore = defineStore("reservationStore", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentReservation = ref<Reservation | null>(null);

  const fetchReservationById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`/api/reservations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch reservation");

      currentReservation.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching reservation";
    } finally {
      loading.value = false;
    }
  };

  const createReservation = async (data: Reservation) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create reservation");
      const result = await response.json();
      return result as Reservation;
    } catch (err: any) {
      error.value = err.message || "Error creating reservation";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, createReservation, fetchReservationById, currentReservation };
});
