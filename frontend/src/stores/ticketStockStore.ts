// src/stores/ticketStockStore.ts
import { defineStore } from 'pinia'

export interface TicketStock {
  id?: number
  ticket_type_id: number
  date: string
  total_quantity: number
  sold_quantity: number
  modified_by?: string
  updated_at?: string
}

interface TicketStockState {
  stocks: TicketStock[]
  stock: null
  loading: boolean
  error: string | null
}

export const useTicketStockStore = defineStore('ticketStock', {
  state: (): TicketStockState => ({
    stocks: [],
    stock: null as any,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStocks() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch("/api/ticket-stock");
        if (!res.ok) throw new Error('Failed to fetch ticket stocks')
        const data = await res.json()
        this.stocks = data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchStockByDate(date: string) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`/api/ticket-stock/by-date?date=${date}`)
        if (!res.ok) throw new Error("Failed to load stock")

        this.stock = await res.json()
      } catch (err: any) {
        this.error = err.message || "Error loading stock"
      } finally {
        this.loading = false
      }
    },

    async createStock(stock: Omit<TicketStock, 'id' | 'updated_at'>) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch('/api/ticket-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stock),
        })
        if (!res.ok) throw new Error('Failed to create stock')
        const data = await res.json()
        this.stocks.push(data)
        return data
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async updateStock(id: number, stock: Partial<TicketStock>) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`/api/ticket-stock/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stock),
        })
        if (!res.ok) throw new Error('Failed to update stock')
        const data = await res.json()
        const index = this.stocks.findIndex((s) => s.id === id)
        if (index !== -1) this.stocks[index] = data
        return data
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteStock(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`/api/ticket-stock/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete stock')
        this.stocks = this.stocks.filter((s) => s.id !== id)
        return true
      } catch (err: any) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    stockForSelectedDate: (state) => {
      if (!state.stock) return {}
      return state.stock.stock_data || {}
    },
  }
})
