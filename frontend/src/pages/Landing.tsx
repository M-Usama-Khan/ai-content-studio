import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
    {
        icon: '💡',
        title: 'AI Idea Generator',
        description: 'Platform aur niche ke hisaab se viral content ideas generate karo instantly'
    },
    {
        icon: '✍️',
        title: 'Script Writer',
        description: 'Complete video scripts with hooks, timestamps, aur call-to-action'
    },
    {
        icon: '#️⃣',
        title: 'Hashtag Strategy',
        description: 'Trending hashtags, best posting time, aur target audience insights'
    },
    {
        icon: '📅',
        title: 'Content Calendar',
        description: '30-day AI powered content schedule automatically generate karo'
    },
    {
        icon: '📊',
        title: 'Analytics Dashboard',
        description: 'Apni content creation activity track karo ek jagah se'
    },
    {
        icon: '📥',
        title: 'PDF Export',
        description: 'Apni ideas aur scripts PDF mein download karo'
    },
]

const platforms = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter']

const Landing: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="border-b border-gray-800 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-indigo-400">AI Content Studio</h1>
                        <p className="text-gray-500 text-xs">IBM Competition 2025</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition text-sm hidden sm:block"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                            Get Started Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-8">
                    <span className="text-indigo-400 text-sm">🚀 Powered by Groq AI (Llama 3.3 70B)</span>
                </div>

                <h1 className="text-5xl font-bold mb-6 leading-tight">
                    Content Creation Ko{' '}
                    <span className="text-indigo-400">AI Se</span>
                    {' '}Reimagine Karo
                </h1>

                <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                    Viral ideas, complete scripts, hashtag strategy, aur 30-day calendar —
                    sab kuch ek jagah, AI ki madad se seconds mein.
                </p>

                <div className="flex gap-4 justify-center flex-wrap mb-8">
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
                    >
                        ✨ Start Creating Free
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
                    >
                        Login →
                    </button>
                </div>

                {/* Platform Pills */}
                <div className="flex gap-2 justify-center flex-wrap">
                    {platforms.map(p => (
                        <span key={p} className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">
                            {p}
                        </span>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-gray-800 py-12">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '10x', label: 'Faster Content Creation' },
                        { value: '5', label: 'Platforms Supported' },
                        { value: '3', label: 'Languages (EN/UR/HI)' },
                        { value: '30', label: 'Day Calendar Generated' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <p className="text-4xl font-bold text-indigo-400">{stat.value}</p>
                            <p className="text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Sab Kuch Ek Jagah 🎯
                </h2>
                <p className="text-gray-400 text-center mb-12">
                    Content creators ke liye complete AI-powered toolkit
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-gray-900 border-y border-gray-800 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Kaise Kaam Karta Hai? 🤔
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Register Karo', desc: 'Free account banao seconds mein', icon: '👤' },
                            { step: '02', title: 'Platform Choose Karo', desc: 'YouTube, Instagram, TikTok ya koi bhi', icon: '📱' },
                            { step: '03', title: 'AI Se Generate Karo', desc: 'Ideas, scripts, hashtags — sab AI generate karega', icon: '🤖' },
                            { step: '04', title: 'Publish Karo', desc: 'Copy karo, download karo, post karo!', icon: '🚀' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <div className="text-indigo-400 font-mono text-sm mb-2">Step {item.step}</div>
                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                <h2 className="text-4xl font-bold mb-4">
                    Ready Ho? 🚀
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                    Aaj se apni content creation journey AI ke saath shuru karo
                </p>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition"
                >
                    ✨ Get Started Free
                </button>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8">
                <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                    <div>
                        <p className="text-indigo-400 font-bold">AI Content Studio</p>
                        <p className="text-gray-500 text-xs">IBM Competition 2025</p>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Built with ❤️ for creators
                    </p>
                </div>
            </footer>

        </div>
    )
}

export default Landing