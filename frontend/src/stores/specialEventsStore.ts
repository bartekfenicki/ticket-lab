// src/stores/specialEventsStore.ts
import { apiFetch } from '@/utils/api'
import { defineStore } from 'pinia'

export interface SpecialEvent {
  id?: number
  title: string
  description: string
  date: string // ISO string
  ticket_type_id: number
  max_tickets: number
  active: boolean
}

interface SpecialEventsState {
  events: SpecialEvent[]
  loading: boolean
  error: string | null
}

export const useSpecialEventsStore = defineStore('specialEvents', {
  state: (): SpecialEventsState => ({
    events: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchEvents() {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch('/api/special-events')
    if (!res.ok) throw new Error('Failed to fetch events')

    const data = await res.json()

    this.events = data.map((e: any) => ({
      ...e,
      date: e.date.split('T')[0]  // ← FIX HERE
    }))
      } catch (err: any) {
        this.error = err.message || 'Error fetching events'
      } finally {
        this.loading = false
      }
    },

    async createEvent(eventData: Omit<SpecialEvent, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch('/api/special-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        })
        if (!res.ok) throw new Error('Failed to create event')
        const newEvent = await res.json()
        this.events.push(newEvent)
        return newEvent
      } catch (err: any) {
        this.error = err.message || 'Error creating event'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id: number, updatedData: Partial<SpecialEvent>) {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch(`/api/special-events/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        })
        if (!res.ok) throw new Error('Failed to update event')
        const updatedEvent = await res.json()
        const index = this.events.findIndex(e => e.id === id)
        if (index !== -1) this.events[index] = updatedEvent
        return updatedEvent
      } catch (err: any) {
        this.error = err.message || 'Error updating event'
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteEvent(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch(`/api/special-events/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete event')
        this.events = this.events.filter(e => e.id !== id)
        return true
      } catch (err: any) {
        this.error = err.message || 'Error deleting event'
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
