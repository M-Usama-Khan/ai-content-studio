const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const getToken = () => localStorage.getItem('token')

export interface IdeaRequest {
    platform: string
    niche: string
    language: string
    count: number
}

export interface Idea {
    title: string
    description: string
    content_type: string
    viral_score: number
    hook: string
}

export const ideasAPI = {
    generate: async (data: IdeaRequest) => {
        const response = await fetch(`${API_URL}/ideas/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Failed to generate ideas')
        }
        return response.json()
    },

    getHistory: async () => {
        const response = await fetch(`${API_URL}/ideas/history`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        return response.json()
    }
}