import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI } from '../api/dashboard'

interface Stats {
  totalIdeas: number
  totalScripts: number
  recentIdeas: any[]
  recentScripts: any[]
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({
    totalIdeas: 0,
    totalScripts: 0,
    recentIdeas: [],
    recentScripts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats()
        setStats({
          totalIdeas: data.ideas.total || 0,
          totalScripts: data.scripts.total || 0,
          recentIdeas: data.ideas.ideas?.slice(0, 3) || [],
          recentScripts: data.scripts.scripts?.slice(0, 3) || []
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Ideas Generated',
      value: stats.totalIdeas,
      icon: '💡',
      color: 'indigo',
      path: '/ideas'
    },
    {
      label: 'Scripts Created',
      value: stats.totalScripts,
      icon: '✍️',
      color: 'purple',
      path: '/scripts'
    },
    {
      label: 'Platforms',
      value: 5,
      icon: '📱',
      color: 'blue',
      path: '/ideas'
    },
    {
      label: 'Languages',
      value: 3,
      icon: '🌐',
      color: 'green',
      path: '/ideas'
    },
  ]

  const quickActions = [
    { label: 'Generate Ideas', icon: '💡', path: '/ideas', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'Write Script', icon: '✍️', path: '/scripts', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Get Hashtags', icon: '#️⃣', path: '/hashtags', color: 'bg-blue-600 hover:bg-blue-700' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Aaj kya create karna hai? AI ready hai!
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-indigo-500/50 cursor-pointer transition"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            {loading ? (
              <div className="h-8 bg-gray-800 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-3xl font-bold text-white">{card.value}</p>
            )}
            <p className="text-gray-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2`}
            >
              <span className="text-xl">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">

        {/* Recent Ideas */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">💡 Recent Ideas</h2>
            <button
              onClick={() => navigate('/ideas')}
              className="text-indigo-400 text-sm hover:text-indigo-300"
            >
              Generate New →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats.recentIdeas.length > 0 ? (
            <div className="space-y-3">
              {stats.recentIdeas.map((idea: any, i: number) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white text-sm font-medium">{idea.platform}</p>
                      <p className="text-gray-400 text-xs">{idea.niche} • {idea.language}</p>
                    </div>
                    <span className="text-indigo-400 text-xs bg-indigo-500/20 px-2 py-1 rounded-full">
                      {idea.generated_ideas?.length || 0} ideas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">💡</p>
              <p className="text-gray-400 text-sm">Koi ideas nahi — abhi generate karo!</p>
              <button
                onClick={() => navigate('/ideas')}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Generate Ideas
              </button>
            </div>
          )}
        </div>

        {/* Recent Scripts */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">✍️ Recent Scripts</h2>
            <button
              onClick={() => navigate('/scripts')}
              className="text-purple-400 text-sm hover:text-purple-300"
            >
              Write New →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats.recentScripts.length > 0 ? (
            <div className="space-y-3">
              {stats.recentScripts.map((script: any, i: number) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4">
                  <p className="text-white text-sm font-medium truncate">{script.idea_title}</p>
                  <p className="text-gray-400 text-xs mt-1">{script.platform}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">✍️</p>
              <p className="text-gray-400 text-sm">Koi scripts nahi — abhi likho!</p>
              <button
                onClick={() => navigate('/scripts')}
                className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Write Script
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard