import React, { useState } from 'react'
import { scriptsAPI } from '../api/scripts'
import toast from 'react-hot-toast'

const platforms = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn']
const languages = ['English', 'Urdu', 'Hindi']

const ScriptWriter: React.FC = () => {
    const [title, setTitle] = useState('')
    const [platform, setPlatform] = useState('YouTube')
    const [language, setLanguage] = useState('English')
    const [duration, setDuration] = useState(3)
    const [loading, setLoading] = useState(false)
    const [script, setScript] = useState<any>(null)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title!')
            return
        }
        setLoading(true)
        setError('')
        setScript(null)
        try {
            const data = await scriptsAPI.generate({ title, platform, language, duration })
            setScript(data.script)
            toast.success('Script generated! ✍️')
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate script')
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const copyScript = () => {
        if (!script) return
        const text = `
HOOK: ${script.hook}
INTRO: ${script.intro}
MAIN CONTENT:
${script.main_content?.map((s: any) => `[${s.timestamp}] ${s.content}`).join('\n\n')}
CALL TO ACTION: ${script.call_to_action}
CAPTION: ${script.caption}
  `.trim()
        navigator.clipboard.writeText(text)
        toast.success('Script copied! 📋')
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">✍️ Script Writer</h1>
            <p className="text-gray-400 mb-6">AI se complete video script banao</p>

            {/* Form */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">Video Title / Topic</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
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
                        <label className="text-gray-400 text-sm mb-1 block">Language</label>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {languages.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Duration (minutes)</label>
                        <select
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n} min</option>)}
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
                    {loading ? '⏳ Writing Script...' : '✍️ Generate Script'}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">✍️</div>
                    <p className="text-gray-400">AI script likh raha hai...</p>
                </div>
            )}

            {/* Script Result */}
            {script && (
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-white">📄 Generated Script</h2>
                        <button
                            onClick={copyScript}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                            {copied ? '✅ Copied!' : '📋 Copy Script'}
                        </button>
                    </div>

                    {/* Hook */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                        <p className="text-yellow-400 text-xs font-semibold mb-1">🎬 HOOK (First 5 seconds)</p>
                        <p className="text-white">{script.hook}</p>
                    </div>

                    {/* Intro */}
                    <div className="bg-gray-800 rounded-xl p-4 mb-4">
                        <p className="text-gray-400 text-xs font-semibold mb-1">📢 INTRO</p>
                        <p className="text-gray-200">{script.intro}</p>
                    </div>

                    {/* Main Content */}
                    <div className="mb-4">
                        <p className="text-gray-400 text-xs font-semibold mb-2">🎥 MAIN CONTENT</p>
                        <div className="space-y-3">
                            {script.main_content?.map((section: any, i: number) => (
                                <div key={i} className="bg-gray-800 rounded-xl p-4">
                                    <span className="text-indigo-400 text-xs font-mono">{section.timestamp}</span>
                                    <p className="text-gray-200 mt-1">{section.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                        <p className="text-green-400 text-xs font-semibold mb-1">🎯 CALL TO ACTION</p>
                        <p className="text-white">{script.call_to_action}</p>
                    </div>

                    {/* Caption */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-xs font-semibold mb-1">📱 CAPTION</p>
                        <p className="text-white">{script.caption}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScriptWriter