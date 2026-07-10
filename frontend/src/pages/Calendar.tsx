import React, { useState, useEffect } from 'react'
import { calendarAPI } from '../api/calendar'

const platforms = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn']
const languages = ['English', 'Urdu', 'Hindi']
const niches = ['Technology', 'Cooking', 'Fitness', 'Finance', 'Education', 'Entertainment', 'Travel', 'Gaming', 'Business']

interface CalendarPost {
    id: string
    topic: string
    platform: string
    post_date: string
    status: string
    day: number
}

const statusColors: Record<string, string> = {
    planned: 'bg-gray-700 text-gray-300',
    done: 'bg-green-500/20 text-green-400',
    skipped: 'bg-red-500/20 text-red-400',
}

const Calendar: React.FC = () => {
    const [niche, setNiche] = useState('Technology')
    const [platform, setPlatform] = useState('YouTube')
    const [language, setLanguage] = useState('English')
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [posts, setPosts] = useState<CalendarPost[]>([])

    useEffect(() => {
        fetchCalendar()
    }, [])

    const fetchCalendar = async () => {
        setLoading(true)
        try {
            const data = await calendarAPI.getCalendar()
            setPosts(data.calendar || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            const data = await calendarAPI.generate({ niche, platform, language })
            setPosts(data.calendar || [])
        } catch (err) {
            console.error(err)
        } finally {
            setGenerating(false)
        }
    }

    const handleStatusChange = async (postId: string, status: string) => {
        await calendarAPI.updateStatus(postId, status)
        setPosts(posts.map(p => p.id === postId ? { ...p, status } : p))
    }

    const doneCount = posts.filter(p => p.status === 'done').length

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">📅 Content Calendar</h1>
            <p className="text-gray-400 mb-6">30-day AI powered content schedule</p>

            {/* Generator Form */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
                <h2 className="text-white font-semibold mb-4">🤖 Generate 30-Day Calendar</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Platform</label>
                        <select
                            value={platform}
                            onChange={e => setPlatform(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {platforms.map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Niche</label>
                        <select
                            value={niche}
                            onChange={e => setNiche(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {niches.map(n => <option key={n}>{n}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Language</label>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {languages.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition"
                >
                    {generating ? '⏳ Generating 30-day calendar...' : '📅 Generate Calendar'}
                </button>
            </div>

            {/* Progress Bar */}
            {posts.length > 0 && (
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-white font-medium">Progress</p>
                        <p className="text-green-400 font-bold">{doneCount}/{posts.length} Done</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${(doneCount / posts.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Calendar Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">📅</div>
                    <p className="text-gray-400">Calendar load ho raha hai...</p>
                </div>
            ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className={`bg-gray-900 rounded-xl p-4 border transition ${post.status === 'done'
                                    ? 'border-green-500/30'
                                    : 'border-gray-800 hover:border-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Day Number */}
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {post.day}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${post.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>
                                            {post.topic}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-500 text-xs">📅 {post.post_date}</span>
                                            <span className="text-gray-500 text-xs">•</span>
                                            <span className="text-gray-500 text-xs">{post.platform}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Buttons */}
                                <div className="flex items-center gap-2 ml-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[post.status]}`}>
                                        {post.status}
                                    </span>
                                    {post.status !== 'done' && (
                                        <button
                                            onClick={() => handleStatusChange(post.id, 'done')}
                                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-lg transition"
                                        >
                                            ✅ Done
                                        </button>
                                    )}
                                    {post.status === 'done' && (
                                        <button
                                            onClick={() => handleStatusChange(post.id, 'planned')}
                                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-lg transition"
                                        >
                                            ↩️ Undo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                    <p className="text-6xl mb-4">📅</p>
                    <p className="text-white font-semibold text-lg mb-2">No Calendar Yet</p>
                    <p className="text-gray-400 mb-6">Upar form fill karo aur 30-day calendar generate karo!</p>
                </div>
            )}
        </div>
    )
}

export default Calendar