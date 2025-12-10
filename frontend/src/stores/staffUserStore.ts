import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";

interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

interface AuthState {
  users_list: any[] | null;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): AuthState => ({
    users_list: [],
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createUser(userData: Omit<User, "id">) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apiFetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            password_hash: userData.password,
            role: userData.role,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create user");
        }

        const data = await res.json();
        this.loading = false;
        return data;
      } catch (err: any) {
        this.error = err.message || "Failed to create user";
        this.loading = false;
        return null;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apiFetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Login failed");
        }

        const data = await res.json();

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem("auth", JSON.stringify({ user: this.user, token: this.token }));
        this.loading = false;
        return true;
      } catch (err: any) {
        this.error = err.message || "Login failed";
        this.loading = false;
        return false;
      }
    },

    persistLogin() {
      const saved = localStorage.getItem("auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.user = parsed.user;
        this.token = parsed.token;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth");
    },

    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const API_URL = "/api/users";
        const res = await apiFetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch users");
        this.users_list = await res.json();
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
