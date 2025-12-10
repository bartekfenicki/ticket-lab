import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";

export interface EmailLog {
  id?: number;
  email: string;
  subject: string;
  type: string;
  sent_at: string;
}

interface EmailLogState {
  emailLogs: EmailLog[];
  loading: boolean;
  error: string | null;
}

export const useEmailLogsStore = defineStore("emailLogs", {
  state: (): EmailLogState => ({
    emailLogs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchEmailLogs() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiFetch("/api/email-logs");
        if (!res.ok) throw new Error("Failed to fetch email logs");
        this.emailLogs = await res.json();
      } catch (err: any) {
        this.error = err.message || "Error fetching email logs";
      } finally {
        this.loading = false;
      }
    },

    async fetchEmailLog(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiFetch(`/api/email-logs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch email log");
        const log = await res.json();
        const index = this.emailLogs.findIndex((l) => l.id === id);
        if (index > -1) this.emailLogs[index] = log;
        else this.emailLogs.push(log);
        return log;
      } catch (err: any) {
        this.error = err.message || "Error fetching email log";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createEmailLog(payload: Omit<EmailLog, "id">) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiFetch("/api/email-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create email log");
        const newLog = await res.json();
        this.emailLogs.push(newLog);
        return newLog;
      } catch (err: any) {
        this.error = err.message || "Error creating email log";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateEmailLog(id: number, payload: Partial<EmailLog>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiFetch(`/api/email-logs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update email log");
        const updatedLog = await res.json();
        const index = this.emailLogs.findIndex((l) => l.id === id);
        if (index > -1) this.emailLogs[index] = updatedLog;
        return updatedLog;
      } catch (err: any) {
        this.error = err.message || "Error updating email log";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteEmailLog(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiFetch(`/api/email-logs/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete email log");
        this.emailLogs = this.emailLogs.filter((l) => l.id !== id);
        return true;
      } catch (err: any) {
        this.error = err.message || "Error deleting email log";
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
