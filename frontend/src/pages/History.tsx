import React, { useState, useEffect } from 'react'
import { ideasAPI } from '../api/ideas'
import { scriptsAPI } from '../api/scripts'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const getToken = () => localStorage.getItem('token')

const History: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ideas' | 'scripts'>('ideas')
    const [ideas, setIdeas] = useState<any[]>([])
    const [scripts, setScripts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const [ideasData, scriptsData] = await Promise.all([
                ideasAPI.getHistory(),
                scriptsAPI.getHistory ? scriptsAPI.getHistory() : Promise.resolve({ scripts: [] })
            ])
            setIdeas(ideasData.ideas || [])
            setScripts(scriptsData.scripts || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
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

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">📚 History</h1>
            <p className="text-gray-400 mb-6">Apna saved content dekho aur PDF download karo</p>

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
            </div>

            {/* Download PDF Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => downloadPDF(activeTab)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                    📥 Download PDF
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">📚</div>
                    <p className="text-gray-400">Loading history...</p>
                </div>
            ) : (

                /* Ideas Tab */
                activeTab === 'ideas' ? (
                    <div className="space-y-4">
                        {ideas.length === 0 ? (
                            <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                                <p className="text-4xl mb-2">💡</p>
                                <p className="text-gray-400">Koi ideas nahi — pehle generate karo!</p>
                            </div>
                        ) : ideas.map((idea: any, i: number) => (
                            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                                                {idea.platform}
                                            </span>
                                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                                                {idea.niche}
                                            </span>
                                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                                                {idea.language}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-1">
                                            {idea.generated_ideas?.length || 0} ideas generated
                                        </p>
                                    </div>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(idea.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {idea.generated_ideas?.slice(0, 3).map((item: any, j: number) => (
                                        <div key={j} className="bg-gray-800 rounded-lg p-3">
                                            <p className="text-white text-sm font-medium">{item.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-yellow-400 text-xs">⭐ {item.viral_score}/10</span>
                                                <span className="text-gray-500 text-xs">• {item.content_type}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(idea.generated_ideas?.length || 0) > 3 && (
                                        <p className="text-gray-500 text-xs text-center">
                                            +{idea.generated_ideas.length - 3} more ideas
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (

                    /* Scripts Tab */
                    <div className="space-y-4">
                        {scripts.length === 0 ? (
                            <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                                <p className="text-4xl mb-2">✍️</p>
                                <p className="text-gray-400">Koi scripts nahi — pehle likho!</p>
                            </div>
                        ) : scripts.map((script: any, i: number) => (
                            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-semibold">{script.idea_title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                                {script.platform}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(script.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                {script.caption && (
                                    <p className="text-gray-400 text-sm mt-3 italic">"{script.caption}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}

export default History