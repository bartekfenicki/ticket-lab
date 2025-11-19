import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PricingView from '@/views/PricingView.vue'
import ContactView from '@/views/ContactView.vue'
import TicketBookingView from '@/views/TicketBookingView.vue'
import ReservationBookingView from '@/views/ReservationBookingView.vue'
import PaymentDetailsView from '@/views/PaymentDetailsView.vue'
import ReservationReceiptView from '@/views/ReservationReceiptView.vue'
import TicketReceiptView from '@/views/TicketReceiptView.vue'
import AdminPanelView from '@/views/AdminPanelView.vue'
import { useUserStore } from '@/stores/staffUserStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
     {
      path: '/pricing',
      name: 'pricing',
      component: PricingView,
    },
     {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/book/tickets',
      name: 'tickets',
      component: TicketBookingView
    },
    {
      path: '/book/reservation',
      name: 'reservation',
      component: ReservationBookingView
    },
   {
    path: '/book/payment/:type', // dynamic segment for source
    name: 'payment',
    component: PaymentDetailsView,
    props: true
  },
  {
    path: '/book/payment/reservation/receipt', // dynamic segment for source
    name: 'reservationReceipt',
    component: ReservationReceiptView,
    props: true
  },
  {
    path: '/book/payment/ticket/receipt', // dynamic segment for source
    name: 'ticketReceipt',
    component: TicketReceiptView,
    props: true
  },
  {
      path: "/admin",
      name: "admin",
      component: AdminPanelView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.user) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router
