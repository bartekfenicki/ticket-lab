<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
    <div class="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-bold text-indigo-700 mb-6">Reservation Details</h1>

      <!-- Summary Card -->
      <div v-if="reservationData" class="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-200">
        <h2 class="text-xl font-semibold text-indigo-800 mb-2">Your Reservation Summary</h2>

        <ul class="text-gray-700 space-y-1">
          <li><strong>Type:</strong> {{ reservationData.reservation_option_type.name }}</li>
              <li v-if="reservationData.variant">
                <strong>Variant:</strong> {{ reservationData.variant.name }}
                ({{ formatPrice(reservationData.variant.price, reservationData.variant.pricing_type) }})
              </li>
              <li><strong>People:</strong> {{ reservationData.numPeople }}</li>
              <li v-if="reservationData.addOns.length > 0">
                <strong>Add-ons:</strong> {{ reservationData.addOns.map(a => a.name).join(", ") }}
              </li>
              <li><strong>Total:</strong> {{ reservationData.totalPrice }} PLN</li>

        </ul>
      </div>

      <!-- Reservation Form -->
      <form @submit.prevent="submitReservation" class="space-y-6">
        <!-- Contact Info -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Contact Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input v-model="form.firstName" required
                type="text"
                class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input v-model="form.lastName" required
                type="text"
                class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" required
                type="email"
                class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input v-model="form.phone" required
                type="tel"
                class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>
        </div>

        <!-- Reservation Date/Time -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Reservation Details</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input disabled v-model="form.date"
                type="date"
                class="mt-1 w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Start Time</label>
              <input v-model="form.time" required
                type="time"
                class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Special requests, dietary needs, etc."
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-between items-center mt-6">
          <button
            type="button"
            @click="$emit('back')"
            class="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition"
          >
            ← Back
          </button>

          <button
            type="submit"
            class="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Confirm Reservation
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {  useRoute, useRouter } from "vue-router";
import { useReservationStore, type Reservation, type ReservationStepData } from "@/stores/reservationStore";

const props = defineProps<{ reservationData: ReservationStepData }>();
const router = useRouter();
const reservationStore = useReservationStore();
const route = useRoute()

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  date: route.query.date,
  time: "",
  notes: "",
});

const formatPrice = (price: number, type: string) =>
  type === "per_person" ? `${price} PLN / person` : `${price} PLN`;

const submitReservation = async () => {
  const payload: Reservation = {
    email: form.value.email,
    first_name: form.value.firstName,
    last_name: form.value.lastName,
    phone: form.value.phone,
    note: form.value.notes || null,
    date: route.query.date as string,
    start_time: form.value.time,
    num_people: props.reservationData.numPeople,
    total_price: props.reservationData.totalPrice,
    payment_method: "unpaid",
    payment_status: "pending",
    status: "new",
    title: props.reservationData.reservation_option_type.name,
    option_type_id: props.reservationData.reservation_option_type.id,
    selected_variant: props.reservationData.variant || null,
    selected_add_ons: props.reservationData.addOns || [],
  };
  if (!route.query.date) throw new Error("Date not provided");

  await reservationStore.createReservation(payload);

  router.push({
    name: "reservationReceipt",
    query: { data: JSON.stringify(payload), id: payload.id },
  });
};

</script>


