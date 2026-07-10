const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('token')

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

    getCalendar: async () => {
        const response = await fetch(`${API_URL}/calendar/`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    },

    updateStatus: async (postId: string, status: string) => {
        const response = await fetch(`${API_URL}/calendar/${postId}?status=${status}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    }
}