import { defineStore } from "pinia";
import { useReservationStore } from "@/stores/reservationStore";

export const useStatisticsStore = defineStore("statistics", {
  state: () => ({
    paidReservations: [] as any[],   // filled by action loadStats()
    revenueByDay: {} as Record<string, number>,
    revenueByMonth: {} as Record<string, number>,
    totalRevenue: 0
  }),

  getters: {
    // optional getters if needed in components
    months(state) {
      return Object.keys(state.revenueByMonth);
    },

    daysOfSelectedMonth: (state) => {
      return (month: string) =>
        Object.fromEntries(
          Object.entries(state.revenueByDay).filter(([day]) =>
            day.startsWith(month)
          )
        );
    }
  },

  actions: {
    /**
     * Load and compute ALL statistics
     * This should be called once onMounted() inside your component
     */
    loadStats() {
      const reservationStore = useReservationStore();
      const reservations = reservationStore.reservations;

      // 1️⃣ Filter PAID reservations
      this.paidReservations = reservations.filter(
        (r) => r.payment_status?.toLowerCase() === "paid"
      );

      // Reset maps
      this.revenueByDay = {};
      this.revenueByMonth = {};
      this.totalRevenue = 0;

      // 2️⃣ Build statistics
      this.paidReservations.forEach((r) => {
        const day = r.date.slice(0, 10);   // YYYY-MM-DD
        const month = r.date.slice(0, 7);  // YYYY-MM
        const price = Number(r.total_price) || 0;

        // Daily revenue
        this.revenueByDay[day] = (this.revenueByDay[day] || 0) + price;

        // Monthly revenue
        this.revenueByMonth[month] =
          (this.revenueByMonth[month] || 0) + price;

        // Total revenue
        this.totalRevenue += price;
      });
    }
  }
});
