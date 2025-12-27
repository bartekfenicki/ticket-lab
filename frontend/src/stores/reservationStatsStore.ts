import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useReservationStore } from "@/stores/reservationStore";

export const useStatisticsStore = defineStore("statistics", () => {
  // ====== STATE ======
  const paidReservations = ref<any[]>([]);
  const revenueByDay = ref<Record<string, number>>({});
  const revenueByMonth = ref<Record<string, number>>({});
  const totalRevenue = ref(0);

  const months = computed(() => Object.keys(revenueByMonth.value));

  const daysOfSelectedMonth = computed(() => {
    return (month: string) =>
      Object.fromEntries(
        Object.entries(revenueByDay.value).filter(([day]) =>
          day.startsWith(month)
        )
      );
  });

  const loadStats = () => {
    const reservationStore = useReservationStore();
    const reservations = reservationStore.reservations;

    paidReservations.value = reservations.filter(
      (r) => r.payment_status?.toLowerCase() === "paid"
    );

    revenueByDay.value = {};
    revenueByMonth.value = {};
    totalRevenue.value = 0;

    paidReservations.value.forEach((r) => {
      const day = r.date.slice(0, 10);
      const month = r.date.slice(0, 7);
      const price = Number(r.total_price) || 0;

      revenueByDay.value[day] = (revenueByDay.value[day] || 0) + price;
      revenueByMonth.value[month] = (revenueByMonth.value[month] || 0) + price;
      totalRevenue.value += price;
    });
  };

  return {
    paidReservations,
    revenueByDay,
    revenueByMonth,
    totalRevenue,
    months,
    daysOfSelectedMonth,
    loadStats,
  };
});
