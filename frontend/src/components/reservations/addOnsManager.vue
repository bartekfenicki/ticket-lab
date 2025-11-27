<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Manage Add-Ons</h2>

    <!-- Select Reservation Option Type -->
    <div class="mb-4">
      <label class="block mb-1 font-medium">
        Reservation Option Type
        <span class="font-thin text-gray-400">(select a type to display add-ons)</span>
      </label>
      <select v-model="selectedOptionTypeId" @change="loadAddOns" class="border rounded-lg p-2 w-full">
        <option value="" disabled>Select an option type</option>
        <option v-for="opt in optionTypes" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
      </select>
    </div>

    <!-- Add-On Form -->
    <div class="mb-6 border p-4 rounded-lg shadow-sm bg-white">
      <h3 class="text-xl font-medium mb-3">{{ editingId ? "Edit Add-On" : "Create Add-On" }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="form.name" type="text" placeholder="Add-On Name" class="border rounded-lg p-2 w-full"/>
        <input v-model.number="form.price" type="number" placeholder="Price" class="border rounded-lg p-2 w-full"/>
        <select v-model="form.pricing_type" class="border rounded-lg p-2 w-full">
          <option value="flat">Flat</option>
          <option value="per_person">Per Person</option>
        </select>
        <textarea v-model="form.description" placeholder="Description" class="border rounded-lg p-2 w-full col-span-3"></textarea>
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="form.active" class="rounded"/>
          <span>Active</span>
        </label>
      </div>

      <div class="mt-4 space-x-2">
        <button @click="handleSubmit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {{ editingId ? "Update" : "Create" }}
        </button>
        <button v-if="editingId" @click="cancelEdit" class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
          Cancel
        </button>
      </div>
    </div>

    <!-- List of Add-Ons -->
    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Name</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Price</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Pricing Type</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Active</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="a in addOnsStore.addOns" :key="a.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-3">{{ a.name }}</td>
            <td class="px-4 py-3">{{ a.price }}</td>
            <td class="px-4 py-3">{{ a.pricing_type }}</td>
            <td class="px-4 py-3">
              <span :class="a.active ? 'text-green-600 font-semibold' : 'text-gray-500'">
                {{ a.active ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-4 py-3 space-x-2">
              <button @click="editAddOn(a)" class="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Edit</button>
              <button @click="deleteAddOn(a.id)" class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </td>
          </tr>
          <tr v-if="addOnsStore.addOns.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">No add-ons found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useReservationOptionAddOnsStore } from "@/stores/addOnsStore";
import { useReservationOptionTypesStore } from "@/stores/reservationOptionTypesStore";

const addOnsStore = useReservationOptionAddOnsStore();
const optionTypesStore = useReservationOptionTypesStore();

const optionTypes = optionTypesStore.optionTypes;
const selectedOptionTypeId = ref<number | null>(null);

const editingId = ref<number | null>(null);

const form = ref({
  reservation_option_type_id: 0,
  name: "",
  description: "",
  price: 0,
  pricing_type: "flat",
  active: true,
});

onMounted(async () => {
  await optionTypesStore.fetchOptionTypes();

});

const loadAddOns = async () => {
  if (selectedOptionTypeId.value) {
    form.value.reservation_option_type_id = selectedOptionTypeId.value;
    await addOnsStore.fetchAddOnsByOptionType(selectedOptionTypeId.value);
  }
};

const handleSubmit = async () => {
  form.value.reservation_option_type_id = selectedOptionTypeId.value!;
  if (editingId.value) {
    await addOnsStore.updateAddOn(editingId.value, form.value);
  } else {
    await addOnsStore.createAddOn(form.value);
  }
  resetForm();
  await loadAddOns();
};

const editAddOn = (a: any) => {
  editingId.value = a.id;
  form.value = { ...a };
};

const deleteAddOn = async (id: number) => {
  if (confirm("Delete this add-on?")) {
    await addOnsStore.deleteAddOn(id);
  }
};

const cancelEdit = () => resetForm();

const resetForm = () => {
  editingId.value = null;
  form.value = {
    reservation_option_type_id: selectedOptionTypeId.value || 0,
    name: "",
    description: "",
    price: 0,
    pricing_type: "flat",
    active: true,
  };
};
</script>
