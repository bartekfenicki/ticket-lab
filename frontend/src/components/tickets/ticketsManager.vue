<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8 space-y-6">

      <h1 class="text-3xl font-bold text-green-700 mb-6">Tickets Manager</h1>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          v-model="searchEmail"
          placeholder="Search by email"
          class="px-3 py-2 border rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select v-model="paymentFilter" class="px-3 py-2 border rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="date"
          v-model="dateFilter"
          class="px-3 py-2 border rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label class="flex items-center gap-2 w-full sm:w-auto">
          <input type="checkbox" v-model="showUnusedOnly" />
          Show only unused tickets
        </label>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-gray-500 text-center">Loading tickets...</div>
      <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

      <!-- Tickets List -->
      <div v-else>
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="border px-4 py-2 text-left">ID</th>
                <th class="border px-4 py-2 text-left">Full Name</th>
                <th class="border px-4 py-2 text-left">Email</th>
                <th class="border px-4 py-2 text-left">Phone</th>
                <th class="border px-4 py-2 text-left">Date</th>
                <th class="border px-4 py-2 text-left">Total Price</th>
                <th class="border px-4 py-2 text-left">Payment Status</th>
                <th class="border px-4 py-2 text-left">Used</th>
                <th class="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in filteredTickets" :key="ticket.id" class="border-b hover:bg-gray-50">
                <td class="border px-4 py-2">{{ ticket.id }}</td>
                <td class="border px-4 py-2">{{ ticket.full_name }}</td>
                <td class="border px-4 py-2">{{ ticket.email }}</td>
                <td class="border px-4 py-2">{{ ticket.phone || "-" }}</td>
                <td class="border px-4 py-2">{{ formatDate(ticket.date) }}</td>
                <td class="border px-4 py-2">{{ ticket.total_price }} PLN</td>
                <td class="border px-4 py-2">{{ ticket.payment_status }}</td>
                <td class="border px-4 py-2">{{ ticket.used ? 'Yes' : 'No' }}</td>
                <td class="border px-4 py-2 flex gap-2 justify-center">
                  <button @click="downloadTicket(ticket)" class="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm">Download PDF</button>
                  <button @click="togglePayStatus(ticket)" class="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Mark as {{ ticket.payment_status === 'pending' ? 'Paid' : 'Pending' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden grid gap-4">
          <div v-for="ticket in filteredTickets" :key="'mobile-'+ticket.id" class="p-4 border rounded-lg bg-white shadow-sm space-y-1">
            <p><strong>ID:</strong> {{ ticket.id }}</p>
            <p><strong>Name:</strong> {{ ticket.full_name }}</p>
            <p><strong>Email:</strong> {{ ticket.email }}</p>
            <p><strong>Phone:</strong> {{ ticket.phone || "-" }}</p>
            <p><strong>Date:</strong> {{ formatDate(ticket.date) }}</p>
            <p><strong>Total Price:</strong> {{ ticket.total_price }} PLN</p>
            <p><strong>Payment:</strong> {{ ticket.payment_status }}</p>
            <p><strong>Used:</strong> {{ ticket.used ? 'Yes' : 'No' }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <button @click="downloadTicket(ticket)" class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm w-full sm:w-auto">Download</button>
              <button @click="togglePayStatus(ticket)" class="bg-green-600 text-white px-3 py-1 rounded text-sm w-full sm:w-auto">
                Mark as {{ ticket.payment_status === 'pending' ? 'Paid' : 'Pending' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="!filteredTickets.length" class="text-gray-500 text-center mt-4">No tickets found.</div>
      </div>

      <!-- Refresh Button -->
      <button
        @click="fetchTickets"
        class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
      >
        Refresh Tickets
      </button>

    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTicketStore, type Ticket } from '@/stores/ticketStore'
import { storeToRefs } from 'pinia'
import jsPDF from "jspdf";
import QRCode from "qrcode";

// Pinia store
const ticketStore = useTicketStore()
const { tickets, loading, error } = storeToRefs(ticketStore)

// Filters
const searchEmail = ref('')
const paymentFilter = ref('')
const showUnusedOnly = ref(false)
const dateFilter = ref('')

// Fetch tickets on mount
const fetchTickets = async () => {
  await ticketStore.fetchAllTickets()
}

onMounted(fetchTickets)

// Helper function to format dates nicely
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return d.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Computed filtered tickets
const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    let matches = true

    if (searchEmail.value) {
      matches = ticket.email.toLowerCase().includes(searchEmail.value.toLowerCase())
    }

    if (matches && paymentFilter.value) {
      matches = ticket.payment_status === paymentFilter.value
    }

    if (matches && showUnusedOnly.value) {
      matches = !ticket.used
    }

    // NEW: Date filter
    if (matches && dateFilter.value) {
      const ticketDate = new Date(ticket.date).toISOString().split("T")[0]
      matches = ticketDate === dateFilter.value
    }

    return matches
  })
})

const togglePayStatus = async (ticket: Ticket) => {
  const newStatus = ticket.payment_status === "pending" ? "paid" : "pending";

  await ticketStore.updateTicket(ticket.id, {
    payment_status: newStatus,
  });
};

const downloadTicket = async (ticket: Ticket) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 842, "F");

  // Logo
  const logoUrl = new URL('@/assets/icons/logo/lab-logo.jpeg', import.meta.url).href;

  async function loadImageWithDimensions(
      url: string
    ): Promise<{ dataUrl: string; width: number; height: number }> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            dataUrl: getBase64(img),
            width: img.width,
            height: img.height,
          });
        };
        img.onerror = reject;
        img.src = url;

        function getBase64(image: HTMLImageElement) {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(image, 0, 0);
          return canvas.toDataURL("image/jpeg");
        }
      });
    }

  try {
const { dataUrl, width: imgW, height: imgH } = await loadImageWithDimensions(logoUrl);

const maxWidth = 170;
const ratio = Math.min(maxWidth / imgW, 1);

doc.addImage(dataUrl, "JPEG", 40, 20, imgW * ratio, imgH * ratio);
  } catch (e) {
    console.error("Error loading logo:", e);
  }

  doc.setFontSize(22);
  doc.text("Labirynt pod Warszawa Ticket", pageWidth / 2, 80, { align: "center" });

  doc.setFillColor(245, 245, 245);
  doc.rect(40, 100, pageWidth - 80, 200, "FD");

  doc.setFontSize(12);
  const startY = 120;
  const gap = 20;

  doc.text(`Full Name: ${ticket.full_name}`, 60, startY);
  doc.text(`Email: ${ticket.email}`, 60, startY + gap);
  doc.text(`Phone: ${ticket.phone || "-"}`, 60, startY + 2 * gap);

  const formattedDate = new Date(ticket.date).toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.text(`Date: ${formattedDate}`, 60, startY + 3 * gap);
  doc.text(`Total Price: ${ticket.total_price} PLN`, 60, startY + 4 * gap);
  doc.text(`Payment Status: ${ticket.payment_status}`, 60, startY + 5 * gap);

  // Tickets table
  let y = startY + 120;
  doc.text("Tickets:", 60, y);

  y += 20;

  doc.setFont("helvetica", "bold");
  doc.text("Name", 60, y);
  doc.text("Qty", 200, y);
  doc.text("Price", 260, y);
  doc.text("Subtotal", 330, y);
  doc.setFont("helvetica", "normal");

  y += 15;

  ticket.items.forEach((item) => {
    doc.text(item.name, 60, y);
    doc.text(String(item.quantity), 200, y);
    const price = Number(item.price_at_purchase ?? 0);
    const qty = Number(item.quantity ?? 0);
    doc.text(price.toFixed(2), 260, y);
    doc.text((price * qty).toFixed(2), 330, y);
    y += 15;
  });

  // QR Code
  const qr = await QRCode.toDataURL(ticket.qr_token);
  doc.addImage(qr, "PNG", pageWidth - 150, 100, 100, 100);

  doc.save(`ticket-${ticket.id}.pdf`);
};



</script>



