const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const getToken = () => localStorage.getItem('token')

export interface ScriptRequest {
    title: string
    platform: string
    language: string
    duration: number
}

export interface HashtagRequest {
    niche: string
    platform: string
    topic: string
    language: string
}

export const scriptsAPI = {
    generate: async (data: ScriptRequest) => {
        const response = await fetch(`${API_URL}/scripts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Failed to generate script')
        }
        return response.json()
    },

    generateHashtags: async (data: HashtagRequest) => {
        const response = await fetch(`${API_URL}/scripts/hashtags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Failed to generate hashtags')
        }
        return response.json()
    },
}