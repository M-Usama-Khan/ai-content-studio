import React, { useState, useEffect } from 'react'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('token')

const platforms = ['All', 'YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter']
const languages = ['All', 'English', 'Urdu', 'Hindi']
const niches = ['All', 'Technology', 'Cooking', 'Fitness', 'Finance', 'Education', 'Entertainment', 'Travel', 'Gaming', 'Business']

const History: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ideas' | 'scripts'>('ideas')
    const [ideas, setIdeas] = useState<any[]>([])
    const [scripts, setScripts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filters
    const [search, setSearch] = useState('')
    const [platform, setPlatform] = useState('All')
    const [language, setLanguage] = useState('All')
    const [niche, setNiche] = useState('All')

    useEffect(() => {
        fetchIdeas()
        fetchScripts()
    }, [])

    useEffect(() => {
        fetchIdeas()
    }, [platform, language, niche])

    const fetchIdeas = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (platform !== 'All') params.append('platform', platform)
            if (language !== 'All') params.append('language', language)
            if (niche !== 'All') params.append('niche', niche)
            if (search) params.append('search', search)

            const res = await fetch(`${API_URL}/ideas/history?${params}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
            const data = await res.json()
            setIdeas(data.ideas || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchScripts = async () => {
        try {
            const res = await fetch(`${API_URL}/scripts/history`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
            const data = await res.json()
            setScripts(data.scripts || [])
        } catch (err) {
            console.error(err)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchIdeas()
    }

    const downloadPDF = async (type: 'ideas' | 'scripts') => {
        const response = await fetch(`${API_URL}/export/${type}/pdf`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}-report.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const resetFilters = () => {
        setSearch('')
        setPlatform('All')
        setLanguage('All')
        setNiche('All')
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">📚 History</h1>
            <p className="text-gray-400 mb-6">Apna saved content search aur filter karo</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('ideas')}
                    className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'ideas'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                >
                    💡 Ideas ({ideas.length})
                </button>
                <button
                    onClick={() => setActiveTab('scripts')}
                    className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'scripts'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                >
                    ✍️ Scripts ({scripts.length})
                </button>
                <div className="ml-auto">
                    <button
                        onClick={() => downloadPDF(activeTab)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        📥 Download PDF
                    </button>
                </div>
            </div>

            {/* Search + Filters (only for ideas) */}
            {activeTab === 'ideas' && (
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-6">

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search ideas by title, niche, platform..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            🔍 Search
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            ✕ Reset
                        </button>
                    </form>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Platform</label>
                            <select
                                value={platform}
                                onChange={e => setPlatform(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                                {platforms.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Niche</label>
                            <select
                                value={niche}
                                onChange={e => setNiche(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                                {niches.map(n => <option key={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Language</label>
                            <select
                                value={language}
                                onChange={e => setLanguage(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                                {languages.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
                    ))}
                </div>
            ) : activeTab === 'ideas' ? (
                <div className="space-y-4">
                    {ideas.length === 0 ? (
                        <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                            <p className="text-4xl mb-2">🔍</p>
                            <p className="text-white font-semibold mb-1">Koi result nahi mila</p>
                            <p className="text-gray-400 text-sm">Filters change karo ya search clear karo</p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : ideas.map((idea: any, i: number) => (
                        <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/30 transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{idea.platform}</span>
                                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{idea.niche}</span>
                                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{idea.language}</span>
                                    <span className="text-gray-500 text-xs">{idea.generated_ideas?.length || 0} ideas</span>
                                </div>
                                <p className="text-gray-500 text-xs">{new Date(idea.created_at).toLocaleDateString()}</p>
                            </div>

                            <div className="space-y-2">
                                {idea.generated_ideas?.slice(0, 3).map((item: any, j: number) => (
                                    <div key={j} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                                        <p className="text-white text-sm">{item.title}</p>
                                        <span className="text-yellow-400 text-xs ml-2 flex-shrink-0">⭐ {item.viral_score}/10</span>
                                    </div>
                                ))}
                                {(idea.generated_ideas?.length || 0) > 3 && (
                                    <p className="text-gray-500 text-xs text-center pt-1">
                                        +{idea.generated_ideas.length - 3} more ideas
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {scripts.length === 0 ? (
                        <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                            <p className="text-4xl mb-2">✍️</p>
                            <p className="text-gray-400">Koi scripts nahi — pehle likho!</p>
                        </div>
                    ) : scripts.map((script: any, i: number) => (
                        <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white font-semibold">{script.idea_title}</p>
                                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mt-2 inline-block">
                                        {script.platform}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs">{new Date(script.created_at).toLocaleDateString()}</p>
                            </div>
                            {script.caption && (
                                <p className="text-gray-400 text-sm mt-3 italic">"{script.caption}"</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default History