import { defineStore } from "pinia";

interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  }),

  actions: {
    async createUser(userData: Omit<User, "id">) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            password_hash: userData.password, // backend hashes it
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
        const res = await fetch("/api/users/login", {
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

        localStorage.setItem("token", this.token);
        this.loading = false;
        return true;
      } catch (err: any) {
        this.error = err.message || "Login failed";
        this.loading = false;
        return false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
