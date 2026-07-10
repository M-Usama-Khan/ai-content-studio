import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('token')

const languages = ['English', 'Urdu', 'Hindi']

const Profile: React.FC = () => {
    const { user, setAuth, token } = useAuthStore()
    const [name, setName] = useState(user?.name || '')
    const [language, setLanguage] = useState(user?.preferred_language || 'English')
    const [stats, setStats] = useState({ total_ideas: 0, total_scripts: 0 })
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/profile/`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
            const data = await res.json()
            setStats(data.stats)
            setName(data.name)
            setLanguage(data.preferred_language)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/profile/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ name, preferred_language: language })
            })
            const data = await res.json()
            if (data.success) {
                if (user && token) {
                    setAuth(
                        { ...user, name: data.user.name, preferred_language: data.user.preferred_language },
                        token
                    )
                }
                toast.success('Profile updated! ✅')
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            }
        } catch (err) {
            toast.error('Update failed!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">⚙️ Profile & Settings</h1>
            <p className="text-gray-400 mb-8">Apni profile aur preferences manage karo</p>

            {/* Avatar + Info */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                        <span className="bg-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full mt-2 inline-block">
                            {user?.preferred_language}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 text-center">
                    <p className="text-3xl font-bold text-indigo-400">{stats.total_ideas}</p>
                    <p className="text-gray-400 text-sm mt-1">💡 Ideas Generated</p>
                </div>
                <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 text-center">
                    <p className="text-3xl font-bold text-purple-400">{stats.total_scripts}</p>
                    <p className="text-gray-400 text-sm mt-1">✍️ Scripts Created</p>
                </div>
            </div>

            {/* Edit Profile */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
                <h3 className="text-white font-semibold mb-4">✏️ Edit Profile</h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Email (cannot change)</label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Preferred Language</label>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {languages.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition"
                    >
                        {saved ? '✅ Saved!' : loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-4">ℹ️ Account Info</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Account Type</span>
                        <span className="text-indigo-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">AI Model</span>
                        <span className="text-green-400 font-medium">Groq Llama 3.3 70B</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Project</span>
                        <span className="text-white font-medium">IBM Competition 2025</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile