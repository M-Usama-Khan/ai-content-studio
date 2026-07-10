import React, { useState, useEffect } from 'react'
import { calendarAPI, CalendarSummary, CalendarPost } from '../api/calendar'
import toast from 'react-hot-toast'

const platforms = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn']
const languages = ['English', 'Urdu', 'Hindi']
const niches = ['Technology', 'Cooking', 'Fitness', 'Finance', 'Education', 'Entertainment', 'Travel', 'Gaming', 'Business']

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    planned: { bg: 'bg-gray-800', text: 'text-gray-300', dot: 'bg-gray-400', label: 'Planned' },
    done: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400', label: 'Done' },
    skipped: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', label: 'Skipped' },
}

const platformEmojis: Record<string, string> = {
    YouTube: '🎬',
    Instagram: '📸',
    TikTok: '🎵',
    LinkedIn: '💼',
}

const Calendar: React.FC = () => {
    // Generator form
    const [niche, setNiche] = useState('Technology')
    const [platform, setPlatform] = useState('YouTube')
    const [language, setLanguage] = useState('English')
    const [generating, setGenerating] = useState(false)

    // Calendar data
    const [calendars, setCalendars] = useState<CalendarSummary[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [posts, setPosts] = useState<CalendarPost[]>([])
    const [loadingList, setLoadingList] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(false)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        fetchCalendars()
    }, [])

    const fetchCalendars = async () => {
        setLoadingList(true)
        try {
            const data = await calendarAPI.list()
            setCalendars(data.calendars || [])
            // Auto-select first calendar if available
            if (data.calendars?.length > 0 && !selectedId) {
                selectCalendar(data.calendars[0].id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingList(false)
        }
    }

    const selectCalendar = async (id: string) => {
        setSelectedId(id)
        setLoadingPosts(true)
        try {
            const data = await calendarAPI.getCalendar(id)
            setPosts(data.calendar || [])
        } catch (err) {
            toast.error('Failed to load calendar')
        } finally {
            setLoadingPosts(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            const data = await calendarAPI.generate({ niche, platform, language })
            toast.success('30-day calendar created! 📅')
            setShowForm(false)
            // Refresh list and select new calendar
            await fetchCalendars()
            if (data.calendar_id) {
                selectCalendar(data.calendar_id)
            }
        } catch (err) {
            toast.error('Failed to generate calendar!')
        } finally {
            setGenerating(false)
        }
    }

    const handleStatusChange = async (postId: string, status: string) => {
        try {
            await calendarAPI.updateStatus(postId, status)
            setPosts(posts.map(p => p.id === postId ? { ...p, status } : p))
            // Update calendar summary counts
            setCalendars(prev => prev.map(c => {
                if (c.id !== selectedId) return c
                const delta = status === 'done' ? 1 : -1
                return { ...c, done_count: Math.max(0, c.done_count + delta) }
            }))
            if (status === 'done') toast.success('Post marked as done! ✅')
            else toast('Post unmarked ↩️')
        } catch (err) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (calId: string) => {
        try {
            await calendarAPI.deleteCalendar(calId)
            toast.success('Calendar deleted!')
            setCalendars(prev => prev.filter(c => c.id !== calId))
            if (selectedId === calId) {
                setSelectedId(null)
                setPosts([])
            }
        } catch (err) {
            toast.error('Failed to delete calendar')
        }
    }

    const selectedCal = calendars.find(c => c.id === selectedId)
    const doneCount = posts.filter(p => p.status === 'done').length

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">📅 Content Calendars</h1>
                    <p className="text-gray-400 text-sm mt-1">Create multiple 30-day calendars for different content</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2 text-sm"
                >
                    {showForm ? '✕ Close' : '➕ New Calendar'}
                </button>
            </div>

            {/* Generator Form (Collapsible) */}
            {showForm && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl p-6 border border-indigo-500/30 mb-6 animate-fadeIn">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm">🤖</span>
                        Generate 30-Day Calendar
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-gray-400 text-xs font-medium mb-1.5 block uppercase tracking-wider">Platform</label>
                            <select
                                value={platform}
                                onChange={e => setPlatform(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                            >
                                {platforms.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs font-medium mb-1.5 block uppercase tracking-wider">Niche</label>
                            <select
                                value={niche}
                                onChange={e => setNiche(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                            >
                                {niches.map(n => <option key={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs font-medium mb-1.5 block uppercase tracking-wider">Language</label>
                            <select
                                value={language}
                                onChange={e => setLanguage(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                            >
                                {languages.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
                    >
                        {generating ? '⏳ Generating 30 days...' : '🚀 Generate Calendar'}
                    </button>
                </div>
            )}

            {/* Calendar Cards Row */}
            {loadingList ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-36 bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
                    ))}
                </div>
            ) : calendars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {calendars.map(cal => {
                        const isSelected = selectedId === cal.id
                        const progress = cal.total_posts > 0 ? Math.round((cal.done_count / cal.total_posts) * 100) : 0
                        return (
                            <div
                                key={cal.id}
                                onClick={() => selectCalendar(cal.id)}
                                className={`relative bg-gray-900 rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 group ${
                                    isSelected
                                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
                                        : 'border-gray-800 hover:border-gray-700'
                                }`}
                            >
                                {/* Delete button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(cal.id) }}
                                    className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-sm"
                                    title="Delete Calendar"
                                >
                                    🗑️
                                </button>

                                {/* Platform emoji & name */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-xl">
                                        {platformEmojis[cal.platform] || '📅'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white font-semibold text-sm truncate">{cal.name}</p>
                                        <p className="text-gray-500 text-xs">{cal.language} • {new Date(cal.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">{cal.done_count}/{cal.total_posts} done</span>
                                        <span className={`font-bold ${progress === 100 ? 'text-green-400' : 'text-indigo-400'}`}>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Selected indicator */}
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-gray-950" />
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : !showForm ? (
                <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800 mb-6">
                    <p className="text-6xl mb-4">📅</p>
                    <p className="text-white font-semibold text-lg mb-2">No Calendars Yet</p>
                    <p className="text-gray-400 mb-6 text-sm">Create your first 30-day content calendar!</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
                    >
                        ➕ Create First Calendar
                    </button>
                </div>
            ) : null}

            {/* Selected Calendar Content */}
            {selectedId && selectedCal && (
                <div>
                    {/* Calendar Header */}
                    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl">
                                    {platformEmojis[selectedCal.platform] || '📅'}
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">{selectedCal.name}</h2>
                                    <p className="text-gray-400 text-sm">{selectedCal.language} • {selectedCal.total_posts} days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-400">{doneCount}</p>
                                    <p className="text-gray-500 text-xs">Done</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-400">{posts.length - doneCount}</p>
                                    <p className="text-gray-500 text-xs">Remaining</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-indigo-400">{posts.length > 0 ? Math.round((doneCount / posts.length) * 100) : 0}%</p>
                                    <p className="text-gray-500 text-xs">Progress</p>
                                </div>
                            </div>
                        </div>

                        {/* Full progress bar */}
                        {posts.length > 0 && (
                            <div className="mt-4">
                                <div className="w-full bg-gray-800 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${(doneCount / posts.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Posts Grid */}
                    {loadingPosts ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-32 bg-gray-900 rounded-xl animate-pulse border border-gray-800" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {posts.map((post) => {
                                const config = statusConfig[post.status] || statusConfig.planned
                                const isDone = post.status === 'done'
                                return (
                                    <div
                                        key={post.id}
                                        className={`bg-gray-900 rounded-xl p-4 border transition-all duration-200 ${
                                            isDone
                                                ? 'border-green-500/30 opacity-75'
                                                : 'border-gray-800 hover:border-indigo-500/30'
                                        }`}
                                    >
                                        {/* Day badge + status */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                                    {post.day}
                                                </span>
                                                <span className="text-gray-500 text-xs">{post.post_date}</span>
                                            </div>
                                            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Topic */}
                                        <p className={`text-sm font-medium leading-snug mb-3 ${isDone ? 'line-through text-gray-500' : 'text-white'}`}>
                                            {post.topic}
                                        </p>

                                        {/* Action buttons */}
                                        <div className="flex gap-2">
                                            {!isDone ? (
                                                <button
                                                    onClick={() => handleStatusChange(post.id, 'done')}
                                                    className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs py-2 rounded-lg transition font-medium"
                                                >
                                                    ✅ Mark Done
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusChange(post.id, 'planned')}
                                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs py-2 rounded-lg transition font-medium"
                                                >
                                                    ↩️ Undo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Calendar