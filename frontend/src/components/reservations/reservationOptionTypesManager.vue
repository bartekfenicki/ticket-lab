<template>
  <div class="max-w-5xl mx-auto p-6">
    <h2 class="text-2xl font-semibold mb-6">Reservation Option Types</h2>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300"
    >
      {{ error }}
    </div>

    <!-- CREATE / EDIT FORM -->
    <form
      @submit.prevent="handleSubmit"
      class="bg-white shadow-md rounded-lg p-6 mb-10"
    >
      <h3 class="text-xl font-medium mb-4">
        {{ editingId ? "Edit Option Type" : "Create Option Type" }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- NAME -->
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input
            v-model="form.name"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <!-- BASE PRICE -->
        <div>
          <label class="block text-sm font-medium mb-1">Default Price</label>
          <input
            v-model.number="form.default_price"
            type="number"
            min="0"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <!-- ACTIVE -->
        <div class="flex items-center space-x-3 mt-6">
          <input
            type="checkbox"
            v-model="form.active"
            class="h-5 w-5 text-blue-600 rounded"
          />
          <label class="text-sm font-medium">Active</label>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea
          v-model="form.description"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          rows="3"
        ></textarea>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="mt-6 flex space-x-3">
        <button
          type="submit"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {{ editingId ? "Save Changes" : "Create Option Type" }}
        </button>

        <button
          v-if="editingId"
          type="button"
          @click="cancelEdit"
          class="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>

    <!-- LIST -->
    <h3 class="text-xl font-medium mb-4">All Option Types</h3>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
              default_price
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Active
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="o in optionTypes"
            :key="o.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3">{{ o.name }}</td>
            <td class="px-4 py-3">{{ o.default_price }}</td>
            <td class="px-4 py-3">
              <span
                :class="o.active
                  ? 'text-green-600 font-semibold'
                  : 'text-gray-500'"
              >
                {{ o.active ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-4 py-3 space-x-3">
              <button
                @click="editOption(o)"
                class="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Edit
              </button>
              <button
                @click="deleteOption(o.id)"
                class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="optionTypes.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No option types found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useReservationOptionTypesStore } from "@/stores/reservationOptionTypesStore";

const reservationTypeStore = useReservationOptionTypesStore();


const optionTypes = computed(() => reservationTypeStore.optionTypes);
const loading = computed(() => reservationTypeStore.loading);
const error = computed(() => reservationTypeStore.error);

const editingId = ref<number | null>(null);

const form = ref({
  name: "",
  description: "",
  default_price: 0,
  active: true,
});

onMounted(() => {
  reservationTypeStore.fetchOptionTypes();
});

const handleSubmit = async () => {
  if (editingId.value) {
    await reservationTypeStore.updateOptionType(editingId.value, form.value);
  } else {
    await reservationTypeStore.createOptionType(form.value);
  }
  resetForm();
};

const editOption = (o: any) => {
  editingId.value = o.id;
  form.value = { ...o };
};

const deleteOption = async (id: number) => {
  if (confirm("Delete this option type?")) {
    await reservationTypeStore.deleteOptionType(id);
  }
};

const cancelEdit = () => resetForm();

const resetForm = () => {
  editingId.value = null;
  form.value = {
    name: "",
    description: "",
    default_price: 0,
    active: true,
  };
};
</script>
