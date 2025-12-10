import { defineStore } from "pinia";
import { useReservationStore } from "@/stores/reservationStore";

export const useStatisticsStore = defineStore("statistics", {
  state: () => ({
    paidReservations: [] as any[],
    revenueByDay: {} as Record<string, number>,
    revenueByMonth: {} as Record<string, number>,
    totalRevenue: 0
  }),

  getters: {
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

    loadStats() {
      const reservationStore = useReservationStore();
      const reservations = reservationStore.reservations;

      this.paidReservations = reservations.filter(
        (r) => r.payment_status?.toLowerCase() === "paid"
      );

      this.revenueByDay = {};
      this.revenueByMonth = {};
      this.totalRevenue = 0;

      this.paidReservations.forEach((r) => {
        const day = r.date.slice(0, 10);
        const month = r.date.slice(0, 7);
        const price = Number(r.total_price) || 0;

        this.revenueByDay[day] = (this.revenueByDay[day] || 0) + price;

        this.revenueByMonth[month] =
          (this.revenueByMonth[month] || 0) + price;

        this.totalRevenue += price;
      });
    }
  }
});
