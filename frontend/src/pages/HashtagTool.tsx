import React, { useState } from 'react'
import { scriptsAPI } from '../api/scripts'
import toast from 'react-hot-toast'

const platforms = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter']
const languages = ['English', 'Urdu', 'Hindi']
const niches = ['Technology', 'Cooking', 'Fitness', 'Finance', 'Education', 'Entertainment', 'Travel', 'Fashion', 'Gaming', 'Business']

const HashtagTool: React.FC = () => {
    const [niche, setNiche] = useState('Technology')
    const [platform, setPlatform] = useState('Instagram')
    const [topic, setTopic] = useState('')
    const [language, setLanguage] = useState('English')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic!')
            return
        }
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const data = await scriptsAPI.generateHashtags({ niche, platform, topic, language })
            setResult(data.hashtags)
            toast.success('Hashtag strategy ready! #️⃣')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const copyHashtags = (tags: string[]) => {
        navigator.clipboard.writeText(tags.join(' '))
        toast.success('Hashtags copied! 📋')
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">#️⃣ Hashtag Strategy</h1>
            <p className="text-gray-400 mb-6">AI se viral hashtags aur strategy generate karo</p>

            {/* Form */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">Topic</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g. Top 10 Futuristic Gadgets"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition"
                >
                    {loading ? '⏳ Generating...' : '#️⃣ Generate Hashtags'}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">#️⃣</div>
                    <p className="text-gray-400">AI hashtag strategy bana raha hai...</p>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-4">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                            <p className="text-2xl font-bold text-indigo-400">⏰</p>
                            <p className="text-white font-semibold mt-1">{result.best_posting_time}</p>
                            <p className="text-gray-500 text-xs">Best Time to Post</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                            <p className="text-2xl font-bold text-green-400">📈</p>
                            <p className="text-white font-semibold mt-1">{result.estimated_reach}</p>
                            <p className="text-gray-500 text-xs">Estimated Reach</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                            <p className="text-2xl font-bold text-yellow-400">👥</p>
                            <p className="text-white font-semibold mt-1 text-xs">{result.target_audience}</p>
                            <p className="text-gray-500 text-xs">Target Audience</p>
                        </div>
                    </div>

                    {/* Trending */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-red-400 font-semibold">🔥 Trending Hashtags</p>
                            <button
                                onClick={() => copyHashtags(result.trending)}
                                className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-lg"
                            >
                                📋 Copy
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.trending?.map((tag: string, i: number) => (
                                <span key={i} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Niche */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-indigo-400 font-semibold">🎯 Niche Hashtags</p>
                            <button
                                onClick={() => copyHashtags(result.niche)}
                                className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-lg"
                            >
                                📋 Copy
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.niche?.map((tag: string, i: number) => (
                                <span key={i} className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* General */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-green-400 font-semibold">✅ General Hashtags</p>
                            <button
                                onClick={() => copyHashtags(result.general)}
                                className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-lg"
                            >
                                📋 Copy
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.general?.map((tag: string, i: number) => (
                                <span key={i} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{tag}</span>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default HashtagTool