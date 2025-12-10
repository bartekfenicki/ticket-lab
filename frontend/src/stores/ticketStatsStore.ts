import { defineStore } from "pinia";
import { ref } from "vue";
import { useTicketStore } from "@/stores/ticketStore";

export const useTicketStatsStore = defineStore("ticketStatsStore", () => {
  const ticketStore = useTicketStore();

  const totalRevenue = ref(0);
  const revenueByMonth = ref<Record<string, number>>({});
  const revenueByDay = ref<Record<string, number>>({});
  const paidTickets = ref([]);
  const ticketTypeStats = ref<Record<number, { name: string; quantity: number; revenue: number }>>({});

  const loadStats = () => {
    const tickets = ticketStore.tickets;

    totalRevenue.value = 0;
    revenueByMonth.value = {};
    revenueByDay.value = {};
    paidTickets.value = [];
    ticketTypeStats.value = {};

    tickets.forEach(ticket => {
      const isPaid = ticket.payment_status === "paid";

      if (isPaid) paidTickets.value.push(ticket);

      const month = ticket.date.slice(0, 7);
      const day = ticket.date.slice(0, 10);

      if (isPaid) totalRevenue.value += Number(ticket.total_price);

      if (isPaid) {
        revenueByMonth.value[month] =
          (revenueByMonth.value[month] || 0) + Number(ticket.total_price);
      }

      if (isPaid) {
        revenueByDay.value[day] =
          (revenueByDay.value[day] || 0) + Number(ticket.total_price);
      }

      ticket.items.forEach(item => {
        const price = Number(item.price_at_purchase);

        if (!ticketTypeStats.value[item.ticket_type_id]) {
          ticketTypeStats.value[item.ticket_type_id] = {
            name: item.name,
            quantity: 0,
            paidQuantity: 0,
            revenue: 0
          };
        }

        // Total sold
        ticketTypeStats.value[item.ticket_type_id].quantity += Number(item.quantity);
        ticketTypeStats.value[item.ticket_type_id].revenue += price * Number(item.quantity);

        // Only increment paidQuantity if ticket is paid
        if (ticket.payment_status === "paid") {
          ticketTypeStats.value[item.ticket_type_id].paidQuantity += Number(item.quantity);
        }
      });
    });
  };

  return {
    totalRevenue,
    revenueByMonth,
    revenueByDay,
    paidTickets,
    ticketTypeStats,
    loadStats,
  };
});
