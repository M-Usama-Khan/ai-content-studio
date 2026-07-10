import React, { useState } from 'react'
import { ideasAPI, Idea } from '../api/ideas'

const platforms = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter']
const languages = ['English', 'Urdu', 'Hindi']
const niches = [
    'Technology', 'Cooking', 'Fitness', 'Finance',
    'Education', 'Entertainment', 'Travel', 'Fashion',
    'Gaming', 'Business', 'Health', 'Motivation'
]

const IdeaGenerator: React.FC = () => {
    const [platform, setPlatform] = useState('YouTube')
    const [niche, setNiche] = useState('Technology')
    const [language, setLanguage] = useState('English')
    const [count, setCount] = useState(5)
    const [loading, setLoading] = useState(false)
    const [ideas, setIdeas] = useState<Idea[]>([])
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        setLoading(true)
        setError('')
        setIdeas([])
        try {
            const data = await ideasAPI.generate({ platform, niche, language, count })
            setIdeas(data.ideas)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">💡 Idea Generator</h1>
            <p className="text-gray-400 mb-6">AI se viral content ideas generate karo</p>

            {/* Form */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">

                    {/* Platform */}
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

                    {/* Niche */}
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

                    {/* Language */}
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

                    {/* Count */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Number of Ideas</label>
                        <select
                            value={count}
                            onChange={e => setCount(Number(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {[5, 10, 15].map(n => <option key={n} value={n}>{n} Ideas</option>)}
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
                    {loading ? '⏳ Generating Ideas...' : '✨ Generate Ideas'}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">🤖</div>
                    <p className="text-gray-400">AI viral ideas generate kar raha hai...</p>
                </div>
            )}

            {/* Ideas List */}
            {ideas.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                        🎯 {ideas.length} Ideas Generated!
                    </h2>
                    <div className="space-y-4">
                        {ideas.map((idea, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                                            #{index + 1}
                                        </span>
                                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                                            {idea.content_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400 text-sm">⭐</span>
                                        <span className="text-white font-bold">{idea.viral_score}/10</span>
                                    </div>
                                </div>

                                <h3 className="text-white font-semibold text-lg mb-2">{idea.title}</h3>
                                <p className="text-gray-400 text-sm mb-3">{idea.description}</p>

                                <div className="bg-gray-800 rounded-lg p-3 mb-3">
                                    <p className="text-xs text-gray-500 mb-1">🎬 Hook:</p>
                                    <p className="text-indigo-300 text-sm italic">"{idea.hook}"</p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(idea.title)}
                                    className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1 rounded-lg transition"
                                >
                                    📋 Copy Title
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default IdeaGenerator