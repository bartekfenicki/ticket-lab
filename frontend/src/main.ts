import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import { useUserStore } from "@/stores/staffUserStore";
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore();
userStore.persistLogin();

app.mount('#app')
