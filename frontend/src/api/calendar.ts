const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('token')

export interface CalendarSummary {
    id: string
    name: string
    platform: string
    niche: string
    language: string
    total_posts: number
    done_count: number
    created_at: string
}

export interface CalendarPost {
    id: string
    topic: string
    platform: string
    post_date: string
    status: string
    day: number
}

export interface CalendarDetail {
    id: string
    name: string
    platform: string
    niche: string
    language: string
    calendar: CalendarPost[]
    total: number
}

export const calendarAPI = {
    generate: async (data: { niche: string; platform: string; language: string }) => {
        const response = await fetch(`${API_URL}/calendar/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error('Failed to generate calendar')
        return response.json()
    },

    list: async (): Promise<{ calendars: CalendarSummary[]; total: number }> => {
        const response = await fetch(`${API_URL}/calendar/list`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    },

    getCalendar: async (calendarId: string): Promise<CalendarDetail> => {
        const response = await fetch(`${API_URL}/calendar/${calendarId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    },

    updateStatus: async (postId: string, status: string) => {
        const response = await fetch(`${API_URL}/calendar/post/${postId}?status=${status}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    },

    deleteCalendar: async (calendarId: string) => {
        const response = await fetch(`${API_URL}/calendar/${calendarId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    }
}