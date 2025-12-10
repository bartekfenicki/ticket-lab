<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
    <div class="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-indigo-700 mb-6">
        🎉 Reservation Confirmed!
      </h1>

      <!-- Confirmation Message -->
      <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg">
        <p class="text-green-700">
          Your reservation request has been placed and sent to the Lab Crew!
        </p>
        <p class="text-green-700 mt-1">
          We will contact you shortly via email to confirm the reservation and provide the payment details.
        </p>
      </div>

      <!-- Reservation Summary -->
      <div v-if="reservation" class="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-200">
        <h2 class="text-xl font-semibold text-indigo-800 mb-2">Reservation Summary</h2>
        <ul class="text-gray-700 space-y-2">
          <li><strong>Reservation ID:</strong> {{ reservation.id }}</li>
          <li><strong>Type:</strong> {{ reservation.option_type_id }}</li>
          <li v-if="reservation.selected_variant">
            <strong>Variant:</strong> {{ reservation.selected_variant.name }}
            ({{ formatPrice(reservation.selected_variant.price, reservation.selected_variant.pricing_type) }})
          </li>
          <li><strong>Number of People:</strong> {{ reservation.num_people }}</li>
          <li v-if="reservation.selected_add_ons.length">
            <strong>Add-Ons:</strong> {{ reservation.selected_add_ons.map(a => a.name).join(", ") }}
          </li>
          <li><strong>Total Price:</strong> {{ reservation.total_price }} PLN</li>
          <li><strong>Date:</strong> {{ formatDate(reservation.date) }}</li>
          <li><strong>Start Time:</strong> {{ reservation.start_time }}</li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div v-if="reservation" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Contact Information</h2>
        <ul class="text-gray-700 space-y-1">
          <li><strong>Name:</strong> {{ reservation.first_name }} {{ reservation.last_name }}</li>
          <li><strong>Email:</strong> {{ reservation.email }}</li>
          <li><strong>Phone:</strong> {{ reservation.phone }}</li>
          <li v-if="reservation.note"><strong>Notes:</strong> {{ reservation.note }}</li>
        </ul>
      </div>

      <!-- Back to Home or Reservations -->
      <div class="mt-6 flex justify-end">
        <router-link
          to="/"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useReservationStore } from "@/stores/reservationStore";
import { useEmailLogsStore } from "@/stores/emailsLogStore";
import { apiFetch } from "@/utils/api";

const route = useRoute();
const reservationStore = useReservationStore();
const reservationId = Number(route.query.id); // Pass reservation ID in query param
const emailLogsStore = useEmailLogsStore();

onMounted(async () => {
  if (reservationId) {
    await reservationStore.fetchReservationById(reservationId);
  }

 if (reservation.value) {
    await sendReservationEmail(reservation.value);
  } else {
    console.error("❌ Reservation not found");
  }
});

const reservation = computed(() => reservationStore.currentReservation);


const formatPrice = (price: number, type: string) =>
  type === "per_person" ? `${price} PLN / person` : `${price} PLN`;

  const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};


const sendReservationEmail = async (reservationData: any) => {
  try {
    // Send the email via backend endpoint
    const res = await apiFetch(`/api/reservations/${reservationData.id}/by-email`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Email failed to send");

    console.log("📨 Reservation confirmation email sent to admin.");

    // Create email log
    const emailLogPayload = {
      email: reservationData.email,
      subject: `Reservation Confirmation #${reservationData.id}`,
      type: "reservation",
      sent_at: new Date().toISOString(),
    };

    await emailLogsStore.createEmailLog(emailLogPayload);

  } catch (err) {
    console.error("❌ Failed to send reservation email or log:", err);
  }
};
</script>
