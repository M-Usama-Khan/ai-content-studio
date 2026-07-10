import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/ideas', icon: '💡', label: 'Idea Generator' },
    { path: '/scripts', icon: '✍️', label: 'Script Writer' },
    { path: '/hashtags', icon: '#️⃣', label: 'Hashtags' },
]

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">

            {/* Sidebar */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-indigo-400">AI Content Studio</h1>
                    <p className="text-gray-500 text-xs mt-1">IBM Competition 2025</p>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${location.pathname === item.path
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">{user?.name}</p>
                            <p className="text-gray-500 text-xs">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-gray-400 hover:text-white text-sm py-2 hover:bg-gray-800 rounded-lg transition"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}

export default Layout