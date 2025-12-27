import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export const useUserStore = defineStore("user", () => {
  const users_list = ref<any[] | null>([]);
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createUser = async (userData: Omit<User, "id">) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
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
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to create user";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

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
      user.value = data.user;
      token.value = data.token;

      localStorage.setItem(
        "auth",
        JSON.stringify({ user: user.value, token: token.value })
      );

      return true;
    } catch (err: any) {
      error.value = err.message || "Login failed";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const persistLogin = () => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      user.value = parsed.user;
      token.value = parsed.token;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth");
  };

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      users_list.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching users";
    } finally {
      loading.value = false;
    }
  };

  return {
    users_list,
    user,
    token,
    loading,
    error,
    createUser,
    login,
    persistLogin,
    logout,
    fetchUsers,
  };
});

