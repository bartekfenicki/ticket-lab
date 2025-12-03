<template>
  <div class="p-6">
    <div class="flex justify-between w-full">
      <h2 class="text-2xl font-semibold mb-4">Reservations </h2>

      <div class="block">
          <button
            @click="prevMonth"
            class="px-2 py-1 mx-1 bg-indigo-200 rounded hover:bg-gray-300"
          >
            ←
          </button>

          <select v-model.number="selectedMonth" class="px-3 mx-1 py-2 border rounded-lg">
            <option v-for="(m, index) in months" :key="index" :value="index + 1">
              {{ m }}
            </option>
          </select>

          <select v-model.number="selectedYear" class="px-3 py-2 border rounded-lg">
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>

          <button
            @click="nextMonth"
            class="px-2 mx-1 py-1 bg-indigo-200 rounded hover:bg-gray-300"
          >
            →
          </button>
        </div>
    </div>


    <!-- TOP BAR -->
    <div class="flex flex-wrap items-center gap-4 mb-6">

      <!-- SEARCH -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by email or last name..."
        class="px-3 py-2 border rounded-lg w-80"
      />

      <!-- SORT -->
      <button
        @click="toggleSort"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Sort by Date:
        {{ sortAsc ? 'Oldest → Newest' : 'Newest → Oldest' }}
      </button>

       <!-- Payment Status Filter -->
      <select v-model="paymentFilter" class="px-3 py-2 border rounded-lg">
        <option value="all">All Payments</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
    </div>

    <!-- STATUS TABS -->
    <div class="flex gap-3 mb-6 border-b pb-2">
      <button
        v-for="s in statuses"
        :key="s.key"
        @click="activeStatus = s.key"
        :class="[
          'px-4 py-2 font-medium transition-colors',
          activeStatus === s.key
            ? 'border-b-2 border-indigo-600 text-indigo-600'
            : 'text-gray-600 hover:text-indigo-600'
        ]"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-gray-500">Loading...</div>

    <!-- ERROR -->
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <!-- TABLE -->
    <table v-if="filteredAndSorted.length" class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-50 text-left">
          <th class="px-4 py-3 text-left font-medium text-gray-600">ID</th>
          <th class="px-4 py-3 text-left font-medium text-gray-600">Name</th>
          <th class="px-4 py-3 text-left font-medium text-gray-600">Email</th>
          <th class="px-4 py-3 text-left font-medium text-gray-600">Date</th>
          <th class="px-4 py-3 text-left font-medium text-gray-600">Payment</th>
          <th class="px-4 py-3 text-left font-medium text-gray-600">Status</th>
          <th class="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="r in filteredAndSorted" :key="r.id">
          <tr class="border-b cursor-pointer" @click="toggleExpanded(r.id)">
            <td class="px-4 py-3">{{ r.id }}</td>
            <td class="px-4 py-3">{{ r.first_name }} {{ r.last_name }}</td>
            <td class="px-4 py-3">{{ r.email }}</td>
            <td class="px-4 py-3">{{ formatDate(r.date) }} at {{ r.start_time }}</td>
            <td class="px-4 py-3">{{ r.payment_status }}</td>

            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded text-white"
                :class="statusColor(r.status)"
              >
                {{ r.status }}
              </span>
            </td>

            <td class="px-4 py-3 flex gap-2">
              <button
                @click.stop="openEditModal(r)"
                class="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                @click.stop="deleteRes(r.id)"
                class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>

          <!-- EXPANDED ROW -->
          <tr v-if="expanded.includes(r.id)" class="bg-gray-50 border-b">
            <td colspan="7" class="p-4">
              <h3 class="text-xl font-semibold mb-3">Reservation Details</h3>

              <div class="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Type:</strong> {{ r.option_type_id }}</p>

                <p v-if="r.selected_variant">
                  <strong>Variant:</strong>
                  {{ r.selected_variant.name }} ({{ r.selected_variant.price }} PLN)
                </p>

                <p v-if="r.selected_add_ons?.length">
                  <strong>Add-ons:</strong>
                  {{ r.selected_add_ons.map(a => a.name).join(', ') }}
                </p>

                <p><strong>Total price:</strong> {{ r.total_price }} PLN</p>
                <p><strong>People Count:</strong> {{ r.num_people }}</p>

                <p><strong>Phone:</strong> {{ r.phone }}</p>
                <p><strong>Notes:</strong> {{ r.note || 'None' }}</p>
              </div>

              <!-- SPECIAL ACTIONS FOR pending_confirmation -->
              <div
                v-if="r.status === 'pending_confirmation'"
                class="mt-4 flex gap-4"
              >
                <button
                  @click="changeStatus(r.id, 'confirmed')"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Confirm Reservation
                </button>
                <button
                  @click="changeStatus(r.id, 'declined')"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Decline Reservation
                </button>
              </div>
              <div
                v-if="r.status === 'confirmed'"
                class="mt-4 flex gap-4"
              >
                <button
                  @click="changeStatus(r.id, 'cancelled')"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Cancel Reservation
                </button>
              </div>
               <div
                v-if="r.status === 'declined' || r.status === 'cancelled'"
                class="mt-4 flex gap-4"
              >
                <button
                  @click="changeStatus(r.id, 'confirmed')"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Reactivate Reservation
                </button>
              </div>
              <div
                v-if="r.status === 'confirmed'"
                class="mt-4 flex gap-4"
              >
                <button
                    @click="togglePayStatus(r)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                     Mark Payment Status as {{ r.payment_status === 'pending' ? 'Paid' : 'Pending' }}
                  </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-else class="text-gray-600 mt-4">No reservations found.</div>

    <!-- EDIT MODAL -->
    <div
      v-if="editOpen"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg w-[600px] shadow-xl">
        <h2 class="text-xl font-bold mb-4">Edit Reservation #{{ editData.id }}</h2>

        <form @submit.prevent="saveEdit" class="space-y-3">

          <!-- Basic Info -->
          <input v-model="editData.first_name" class="input" placeholder="First Name" />
          <input v-model="editData.last_name" class="input" placeholder="Last Name" />
          <input v-model="editData.email" class="input" placeholder="Email" />
          <input v-model="editData.phone" class="input" placeholder="Phone" />

          <div class="grid grid-cols-2 gap-4">
            <input v-model="editData.date" type="date" class="input" />
            <input v-model="editData.start_time" type="time" class="input" />
          </div>

          <input v-model.number="editData.num_people" type="number" class="input" min="1" />

          <textarea v-model="editData.note" class="input" placeholder="Notes"></textarea>

          <!-- Status -->
          <select v-model="editData.status" class="input">
            <option>pending_confirmation</option>
            <option>confirmed</option>
            <option>completed</option>
            <option>cancelled</option>
            <option>declined</option>
          </select>

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="editOpen=false" class="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>

            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded">
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useReservationStore } from "@/stores/reservationStore";

const store = useReservationStore();
const reservations = computed(() => store.reservations);
const loading = store.loading;
const error = store.error;
console.log(reservations)
onMounted(async () => {
  await store.getAllReservations();

});

/* ---------------------------------------------
   TABS
--------------------------------------------- */
const statuses = [
  { key: "all", label: "All" },
  { key: "pending_confirmation", label: "Pending Confirmation" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "declined", label: "Declined" },
];

const activeStatus = ref("all");
const paymentFilter = ref<"all" | "pending" | "paid">("all");

/* ---------------------------------------------
   SEARCH
--------------------------------------------- */
const searchQuery = ref("");

/* ---------------------------------------------
   SORTING
--------------------------------------------- */
const sortAsc = ref(false);
const toggleSort = () => (sortAsc.value = !sortAsc.value);

/* ---------------------------------------------
   EXPANDED ROWS
--------------------------------------------- */
const expanded = ref<number[]>([]);

const toggleExpanded = (id: number) => {
  if (expanded.value.includes(id)) {
    expanded.value = expanded.value.filter(i => i !== id);
  } else {
    expanded.value.push(id);
  }
};

const today = new Date();
const selectedMonth = ref(today.getMonth() + 1); // JS month 0-11 → 1-12
const selectedYear = ref(today.getFullYear());

// Month names
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate year options (5 years around current year)
const yearOptions = computed(() => {
  const current = today.getFullYear();
  return Array.from({ length: 5 }, (_, i) => current - 2 + i);
});

// Navigate to previous month
const prevMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value -= 1;
  } else {
    selectedMonth.value -= 1;
  }
};

// Navigate to next month
const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value += 1;
  } else {
    selectedMonth.value += 1;
  }
};

/* ---------------------------------------------
   FILTER + SEARCH + SORT Combined
--------------------------------------------- */
const filteredAndSorted = computed(() => {
  let result = [...reservations.value];

  // Status filtering
  if (activeStatus.value !== "all") {
    result = result.filter(r => r.status === activeStatus.value);
  }

  // Search filtering
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      r =>
        r.email.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q)
    );
  }

  // Month/Year filtering
  result = result.filter(r => {
    const date = new Date(r.date);
    return (
      date.getMonth() + 1 === selectedMonth.value &&
      date.getFullYear() === selectedYear.value
    );
  });

    if (paymentFilter.value !== "all") {
    result = result.filter(r => r.payment_status === paymentFilter.value);
  }

  // Sorting by date
  result.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time || "00:00"}`);
    const dateB = new Date(`${b.date}T${b.start_time || "00:00"}`);

    return sortAsc.value
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  return result;
});

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

/* ---------------------------------------------
   STATUS BADGES
--------------------------------------------- */
const statusColor = (status: string) => ({
  pending_confirmation: "bg-green-300",
  confirmed: "bg-green-600",
  completed: "bg-blue-600",
  cancelled: "bg-gray-600",
  declined: "bg-red-600",
}[status] || "bg-gray-400");


const changeStatus = (id: number, status: string) =>
  store.updateReservation(id, { status });

const togglePayStatus = (reservation: any) => {
  const newStatus = reservation.payment_status === "pending" ? "paid" : "pending";
  store.updateReservation(reservation.id, { payment_status: newStatus });
};
const deleteRes = async (id: number) => {
  if (!confirm("Delete this reservation?")) return;
  await store.deleteReservation(id);
};

/* ---------------------------------------------
   EDIT MODAL
--------------------------------------------- */
const editOpen = ref(false);
const editData = reactive<any>({});

const openEditModal = (reservation: any) => {
  Object.assign(editData, {
    ...reservation,
    date: reservation.date?.split("T")[0], // extract YYYY-MM-DD
    start_time: reservation.start_time?.slice(0,5) // extract HH:MM
  });
  editOpen.value = true;
};

const saveEdit = async () => {
  // clone and clean the object
  const payload = {
    ...editData,
    selected_variant: editData.selected_variant ? JSON.stringify(editData.selected_variant) : null,
    selected_add_ons: editData.selected_add_ons ? JSON.stringify(editData.selected_add_ons) : null,
  };

  await store.updateReservation(editData.id, payload);
  editOpen.value = false;
};
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2;
}
table th,
table td {
  border: 1px solid #e2e2e2;
}
</style>
