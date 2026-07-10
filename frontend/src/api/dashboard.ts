const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const getToken = () => localStorage.getItem('token')

export const dashboardAPI = {
    getStats: async () => {
        const [ideasRes, scriptsRes] = await Promise.all([
            fetch(`${API_URL}/ideas/history`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            }),
            fetch(`${API_URL}/scripts/history`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
        ])
        const ideas = await ideasRes.json()
        const scripts = await scriptsRes.json()
        return { ideas, scripts }
    }
}