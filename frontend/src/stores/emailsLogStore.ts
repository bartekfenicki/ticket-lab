import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface EmailLog {
  id?: number;
  email: string;
  subject: string;
  type: string;
  sent_at: string;
}

export const useEmailLogsStore = defineStore("emailLogs", () => {
  // ====== STATE ======
  const emailLogs = ref<EmailLog[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ====== ACTIONS ======
  const fetchEmailLogs = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/email-logs");
      if (!res.ok) throw new Error("Failed to fetch email logs");
      emailLogs.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching email logs";
    } finally {
      loading.value = false;
    }
  };

  const fetchEmailLog = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/email-logs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch email log");

      const log = await res.json();
      const index = emailLogs.value.findIndex((l) => l.id === id);
      if (index > -1) emailLogs.value[index] = log;
      else emailLogs.value.push(log);

      return log;
    } catch (err: any) {
      error.value = err.message || "Error fetching email log";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createEmailLog = async (payload: Omit<EmailLog, "id">) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/email-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create email log");

      const newLog = await res.json();
      emailLogs.value.push(newLog);
      return newLog;
    } catch (err: any) {
      error.value = err.message || "Error creating email log";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateEmailLog = async (id: number, payload: Partial<EmailLog>) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/email-logs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update email log");

      const updatedLog = await res.json();
      const index = emailLogs.value.findIndex((l) => l.id === id);
      if (index > -1) emailLogs.value[index] = updatedLog;

      return updatedLog;
    } catch (err: any) {
      error.value = err.message || "Error updating email log";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteEmailLog = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/email-logs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete email log");

      emailLogs.value = emailLogs.value.filter((l) => l.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || "Error deleting email log";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    emailLogs,
    loading,
    error,
    fetchEmailLogs,
    fetchEmailLog,
    createEmailLog,
    updateEmailLog,
    deleteEmailLog,
  };
});
