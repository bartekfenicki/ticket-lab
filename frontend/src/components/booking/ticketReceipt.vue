<template>
  <div class="min-h-screen  py-12 px-4">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h1 class="text-3xl font-bold text-green-700 mb-2 flex items-center gap-2">
         Ticket Receipt
      </h1>

      <!-- Loading state -->
      <div v-if="loading">Loading ticket...</div>

      <!-- Ticket info -->
      <div v-else-if="ticket">
        <p class="text-gray-700"><strong>Full Name:</strong> {{ ticket.full_name }}</p>
        <p class="text-gray-700"><strong>Email:</strong> {{ ticket.email }}</p>
        <p class="text-gray-700"><strong>Phone:</strong> {{ ticket.phone }}</p>
        <p class="text-gray-700"><strong>Date:</strong> {{ formattedDate }}</p>
        <p class="text-gray-700"><strong>Total Price:</strong> {{ ticket.total_price }} zł</p>
        <p class="text-gray-700"><strong>Payment Status:</strong> {{ ticket.payment_status }}</p>

        <h2 class="text-xl font-semibold mt-4">Tickets</h2>
        <div v-for="item in ticket.items" :key="item.ticket_type_id" class="border-b py-2 flex justify-between">
          <div>
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-sm text-gray-500">Price: {{ item.price }} zł × {{ item.quantity }}</p>
          </div>
          <p class="font-bold text-green-600">{{ item.price * item.quantity }} zł</p>
        </div>

        <button @click="downloadTicket" class="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Download Ticket
        </button>
        <button
            @click="sendTicketByEmail"
            class="mt-3 ms-0 sm:ms-4 px-6 py-3 bg-yellow-800 text-white rounded-lg hover:bg-blue-700"
          >
            Send Ticket via Email
          </button>
      </div>

      <!-- No ticket found -->
      <div v-else>
        <p class="text-red-500">Ticket not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketStore } from '@/stores/ticketStore'
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useEmailLogsStore } from "@/stores/emailsLogStore";
import { apiFetch } from '@/utils/api';

const route = useRoute()
const ticketStore = useTicketStore()
const emailLogsStore = useEmailLogsStore();

const ticket = ref<any>(null)
const loading = ref(true)

const ticketId = Number(route.params.ticketId)

const formattedDate = computed(() => {
  if (!ticket.value.date) return 'No date selected'
  const d = new Date(ticket.value.date)
  return d.toLocaleDateString('pl-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(async () => {
  if (!ticketId) return

  loading.value = true
  try {
    ticket.value = await ticketStore.fetchTicketById(ticketId)
  } catch (err) {
    console.error("Error fetching ticket:", err)
  } finally {
    loading.value = false
  }
})

const downloadTicket = async () => {
  if (!ticket.value) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 842, "F"); // Full A4 background

  // Event logo
  const logoUrl = new URL('@/assets/icons/logo/lab-logo.jpeg', import.meta.url).href;
try {
  const { dataUrl, width: imgW, height: imgH } = await loadImageWithDimensions(logoUrl);

  const maxWidth = 170;
  const maxHeight = 80;
  let width = imgW;
  let height = imgH;

  // scale proportionally
  if (width > maxWidth) {
    const scale = maxWidth / width;
    width *= scale;
    height *= scale;
  }
  if (height > maxHeight) {
    const scale = maxHeight / height;
    width *= scale;
    height *= scale;
  }

  doc.addImage(dataUrl, "JPEG", 40, 20, width, height);
} catch (e) {
  console.warn("Logo not loaded:", e);
}

  // Header
  doc.setFontSize(22);
  doc.setTextColor(50, 50, 50);
  doc.text("Labirynt pod Warszawa Ticket", pageWidth / 2, 80, { align: "center" });

  // Ticket info box
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(0, 0, 0);
  doc.rect(40, 100, pageWidth - 80, 200, "FD"); // Fill + border

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const startY = 120;
  const lineSpacing = 20;

  const formattedDate = computed(() => {
  if (!ticket.value.date) return 'No date selected'
  const d = new Date(ticket.value.date)
  return d.toLocaleDateString('pl-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

  const labelX = 60;        // X position for labels
const contentX = 180;     // X position for content (margin after label)


// Full Name
doc.setFont("helvetica", "bold");
doc.text("Full Name:", labelX, startY);
doc.setFont("helvetica", "normal");
doc.text(ticket.value.full_name, contentX, startY);

// Email
doc.setFont("helvetica", "bold");
doc.text("Email:", labelX, startY + lineSpacing);
doc.setFont("helvetica", "normal");
doc.text(ticket.value.email, contentX, startY + lineSpacing);

// Phone
doc.setFont("helvetica", "bold");
doc.text("Phone:", labelX, startY + 2 * lineSpacing);
doc.setFont("helvetica", "normal");
doc.text(ticket.value.phone || "-", contentX, startY + 2 * lineSpacing);

// Date
doc.setFont("helvetica", "bold");
doc.text("Date:", labelX, startY + 3 * lineSpacing);
doc.setFont("helvetica", "normal");
doc.text(formattedDate.value, contentX, startY + 3 * lineSpacing);

// Total Price
doc.setFont("helvetica", "bold");
doc.text("Total Price:", labelX, startY + 4 * lineSpacing);
doc.setFont("helvetica", "normal");
doc.text(`${ticket.value.total_price} PLN`, contentX, startY + 4 * lineSpacing);

// Payment Status
doc.setFont("helvetica", "bold");
doc.text("Payment Status:", labelX, startY + 5 * lineSpacing);
doc.setFont("helvetica", "normal");
doc.text(ticket.value.payment_status, contentX, startY + 5 * lineSpacing);

// Tickets section title with bottom margin
const tableStartY = startY + 6 * lineSpacing; // extra space for margin
doc.setFont("helvetica", "bold");
doc.text("Tickets:", labelX, tableStartY);
doc.setFont("helvetica", "normal");
  const tableY = tableStartY + 10;
  let rowY = tableY;

  // Table headers
  rowY += 20;
  doc.setFont("helvetica", "bold");
  doc.text("Name", 60, rowY);
  doc.text("Quantity", 200, rowY);
  doc.text("Price (PLN)", 280, rowY);
  doc.text("Subtotal (PLN)", 380, rowY);
  doc.setFont("helvetica", "normal");
  rowY += 15;

  ticket.value.items.forEach((item: any) => {
    doc.text(item.name, 60, rowY);
    doc.text(String(item.quantity), 200, rowY);
    doc.text(item.price.toFixed(2), 280, rowY);
    doc.text((item.quantity * item.price).toFixed(2), 380, rowY);
    rowY += 15;
  });

  // QR code
  const qrCodeDataUrl = await QRCode.toDataURL(ticket.value.qr_token);
  doc.addImage(qrCodeDataUrl, "PNG", pageWidth - 150, 100, 100, 100);

  // Footer / Instructions
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Show this ticket at the event entrance or scan the QR code for verification.",
    40,
    rowY + 40
  );

  // Save PDF
  doc.save(`ticket-${ticket.value.id}.pdf`);
};

// Helper function to load logo as base64
async function loadImageWithDimensions(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      resolve({ dataUrl: toDataURL(img), width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });

  function toDataURL(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg"); // keep original format
  }
}

const sendTicketByEmail = async () => {
  if (!ticket.value) return;

  try {
    const res = await apiFetch(`/api/tickets/${ticket.value.id}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to send email");

    const emailLogPayload = {
      email: ticket.value.email,
      subject: `Ticket with an ID of ${ticket.value.id} sent by mail to ${ticket.value.full_name}`,
      type: "ticket",
      sent_at: new Date().toISOString(),
    };

    await emailLogsStore.createEmailLog(emailLogPayload);

    alert("📨 Ticket sent to email!");
  } catch (err) {
    alert("❌ Email sending failed: " + err.message);
  }
};

</script>


